// require express
var express = require('express');
var path    = require('path');
var request = require('request');
var async   = require('async');
var MyGlobals = require('./globals.js');


// create our router object
var router = express.Router();

// export our router
module.exports = router;

// route for our homepage
router.get('/', function(req, res) {
  async.parallel([
    function(next) {
      request('http://localhost:3001/api/devices', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Devices request: 200");
            next(null, body);
        }
      });
    }, function(next) {
      request('http://localhost:3001/api/users', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Users request: 200");
            next(null, body);
        }
      });
    }], function(err, results) {
      if(results.length > 1){ 
        MyGlobals.saveDevices(JSON.parse(results[0]));
        MyGlobals.saveUsers(JSON.parse(results[1]));
        console.log("Attempting to render page");
        res.render('pages/home', {devices: MyGlobals.Devices, users: MyGlobals.Users});
      }
  });
});

// route for our about page
router.get('/users', function(req, res) {
  request('http://localhost:3001/api/users', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
        res.render('pages/users', {items: JSON.parse(body)});
    }
  });
});

router.get('/contact', function(req, res) {
  res.render('pages/contact');
});

router.post('/contact', function(req, res) {
  res.send('Thanks for contacting us, ' + req.body.name + '! We will respond shortly!');
});