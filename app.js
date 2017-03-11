const express = require('express');
const AlchemyLanguage = require('watson-developer-cloud/alchemy-language/v1');
const alchemyApiKey = {api_key: process.env.ALCHEMY_API_KEY || 'e159c11d8dda60a89823f4871028767ebecfe68b'}
const alchemy_language = new AlchemyLanguage(alchemyApiKey)

// cfenv provides access to your xCloud Foundry environment
const cfenv = require('cfenv');



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
const appEnv = cfenv.getAppEnv();

app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'bower_components')))
app.use(bodyParser());


// seed.seedDatabase();
// sentiment.getSentiment("58ba2b1195244e589eedcefb");
// sentiment.getSentiment("58ba2b1195244e589eedcefc");
// sentiment.getSentiment("58ba2b1195244e589eedcefd");


// sentiment.resetSentiment("58ba2b1195244e589eedcefb");
// sentiment.resetSentiment("58ba2b1195244e589eedcefc");
// sentiment.resetSentiment("58ba2b1195244e589eedcefd");


const urls = [
    "http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=IBM",
    "http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=AAPL",
    "http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=MSFT"
];  

Promise.all([
    feedparser.getFeed("http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=IBM"),
    feedparser.getFeed("http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=AAPL"),
    feedparser.getFeed("http://articlefeeds.nasdaq.com/nasdaq/symbols?symbol=MSFT")
]).then((feeds) => {
    console.log(feeds.length);
    // feeds.forEach(function(feed) {
    //     console.log(feed);
    //     console.log("---------------");
    //     console.log("\n\n\n\n\n\n\n\n\n\n");
    //     console.log("---------------");
    // });
})

// let feed = feedparser.getFeed();

// let articles = feed.then((content)=> {
//     return new Promise((resolve, reject) => {
//         let contentArray = []
//         console.log("got the feed");
//         content.forEach(function(article) {
//             contentArray.push(article.link);
//         });
//         resolve(contentArray);
//     });
// });

// let articlesAsObject = articles.then((links) => {
//     return new Promise((resolve, reject) => {
//         let objectArray = []
//         links.forEach(function(l) {
//             objectArray.push({
//                 url: l
//             });
//         });
//         resolve(objectArray);
//     });
// });


// let sentimentAnalysis = articlesAsObject.then((linkObjects) => {
//     let aSlice = linkObjects.slice(1,4);
//     sentiment.multipleSentiments(aSlice);
// })




app.get('/', (req, response) =>{ 

});

app.listen(3000, () => {
    console.log("listening on port 3000");
});