var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');



var discovery =  new watson.DiscoveryV1({
  username: '73e61352-0fbf-4c52-bce6-9edacc569e49',
  password: 'wrux32q73Th5',
  version: 'v1',
  version_date: '2016-12-01'
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

var mydb;



/* Endpoint to greet and add a new visitor to database.
* Send a POST request to localhost:3000/api/visitors with body
* {
* 	"name": "Bob"
* }
*/
app.post("/api/visitors", function (request, response) {
  
  var stockSymbol = request.body.stock;
  var sentiment;
  var sentimentSum = 0;
  var params = {
  "environment_id": "ae482d8d-b420-4bfb-bd08-6fa49cb61184",
  "collection_id": "2fbd46a5-863e-4c9b-915e-1db4ca71bc34",
  "query": stockSymbol+"&count=1"
}

  discovery.query((params), function(error, data) {
    if(error) {
      console.log(error)
    }
    console.log(JSON.stringify(data, null, 2));

    for(var i = 0; i < 10; i++) {
       sentimentSum += parseFloat(data.results[i].docSentiment.score)
    }
    if(sentimentSum > 0) {
      sentiment = 'positive'
    }
    else if(sentimentSum < 0) {
      sentiment = 'negative'
    }
    else if(sentimentSum == 0) {
      sentiment = 'neutral';
    }
  response.send("The sentiment of " + stockSymbol + " is " + sentiment);
  return;
  })
});


// load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

if (appEnv.services['cloudantNoSQLDB']) {
  // Load the Cloudant library.
  var Cloudant = require('cloudant');

  // Initialize database with credentials
  var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);

  //database name
  var dbName = 'mydb';

  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if(!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);
  });

  // Specify the database we are going to use (mydb)...
  mydb = cloudant.db.use(dbName);
}

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));



var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});


