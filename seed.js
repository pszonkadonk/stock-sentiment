const mongoose = require('mongoose');
const Stock = require('./models/Stock');

function seedDatabase() { 
    let ibm = new Stock({
        name: "International Business Machines",
        ticker: "IBM"
    });

    ibm.save((err)=> {
        if(err) {
            console.log(err);
        }
        else {
            console.log("Stock saved...");
        }
    });

    let apple = new Stock({
        name: "Apple Inc",
        ticker: "AAPL"
    });

    apple.save((err)=> {
        if(err) {
            console.log(err);
        }
        else {
            console.log("Stock saved...");
        }
    })
    let microsoft = new Stock({
        name: "Microsoft",
        ticker: "MSFT"
    });

    microsoft.save((err)=> {
        if(err) {
            console.log(err);
        }
        else {
            console.log("Stock saved...");
        }
    });
}

module.exports = {
    seedDatabase: seedDatabase
}
