const express = require('express');
const AlchemyLanguage = require('watson-developer-cloud/alchemy-language/v1');
const alchemyApiKey = {api_key: process.env.ALCHEMY_API_KEY}
const alchemy_language = new AlchemyLanguage(alchemyApiKey)

// cfenv provides access to your xCloud Foundry environment
const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

const async = require('async');
const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const hbs = require('hbs');
const path = require('path');
const Q = require('q');

const app = express();


// // create db 
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:/myApp');
const db = mongoose.connection;

// // stock model
const Stock = require('./models/Stock');
const seed = require('./seed');
const sentiment = require('./sentiment');

// nasdaq feedparser

const feedparser = require('./feedparser');


// middleware

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'bower_components')))
app.use(bodyParser());


const urls = [
    "http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=IBM",
    "http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=AAPL",
    "http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=MSFT"
];  

let stockFeeds = Promise.all([
    feedparser.getFeed("http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=IBM"),
    feedparser.getFeed("http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=AAPL"),
    feedparser.getFeed("http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=MSFT")
]);

let articles = stockFeeds.then((content)=> {
    return new Promise((resolve, reject) => {
        let contentArray = []
        content.forEach(function(article) {
            article.forEach(function(fd) {
                contentArray.push(fd.link);
            });
        });
        resolve(contentArray);
    });
});

let articlesAsObject = articles.then((links) => {
    return new Promise((resolve, reject) => {
        let objectArray = []
        links.forEach(function(l) {
            objectArray.push({
                url: l
            });
        });
        resolve(objectArray);
    });
});


let sentimentAnalysis = articlesAsObject.then((feeds) => {
    sentiment.multipleSentiments(feeds);
})




app.get('/', (req, response) =>{ 

});

app.listen(3000, () => {
    console.log("listening on port 3000");
});