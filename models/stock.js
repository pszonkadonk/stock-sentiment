const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let stockSchema = new Schema({
    name: String,
    ticker: String,
    sentiment: {type: Number, default: 0}
});

let Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;

