const AlchemyLanguage = require('watson-developer-cloud/alchemy-language/v1');
const alchemyApiKey = {api_key: process.env.ALCHEMY_API_KEY || 'e159c11d8dda60a89823f4871028767ebecfe68b'}
const alchemy_language = new AlchemyLanguage(alchemyApiKey)

const async = require('async');
const Q = require('q');

const Stock = require('./models/Stock');

function multipleSentiments(articles) {
    let alchemyArray = []
    return new Promise((resolve, reject) =>{
        async.forEach(articles, (link, callback) => {
            getSentiment(link);
            callback();
        });
    });
}

function getSentiment(linkObject) {
    return new Promise((resolve, reject) => {
        alchemy_language.sentiment(linkObject, function(err, alchemyResponse) {
            if(err) {
                console.log(err);
            }

            else if(alchemyResponse.docSentiment.type !== 'neutral') {
                Stock.findOneAndUpdate({ticker: 'IBM'},
                { $inc: {sentiment: alchemyResponse.docSentiment.score} }, {new: true}).exec((err,stock) => {
                    if(err) {
                        console.log(err)
                    }
                    else {
                        console.log("Updated stock");
                    }
                });
            }
            console.log(alchemyResponse);
        });
    });
}


function resetSentiment(id) {
    Stock.findByIdAndUpdate(id, { sentiment: 0 }, (err, res) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log("updated sentiment of " + res.name);
        }
    });
}

module.exports = {
    getSentiment: getSentiment,
    resetSentiment: resetSentiment,
    multipleSentiments: multipleSentiments
}