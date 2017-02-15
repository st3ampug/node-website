const APISERVERIP     = "52.210.163.110";
//const APISERVERIP     = "localhost";
const APISERVERPORT   = "3001";
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

router.get('/', function(req, res) {
  res.render('pages/login');
});

// route for our home page
router.get('/home', function(req, res) {
  async.parallel([
    function(next) {
      request('http://' + APISERVERIP + ':' + APISERVERPORT + '/api/devices', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Devices request: 200");
            next(null, body);
        }
      });
    }, function(next) {
      request('http://' + APISERVERIP + ':' + APISERVERPORT + '/api/users', function (error, response, body) {
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

// route for our users page
router.get('/users', function(req, res) {
  request('http://' + APISERVERIP + ':' + APISERVERPORT + '/api/users', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
        res.render('pages/users', {items: JSON.parse(body)});
    }
  });
});

// route for our inventory page
router.get('/inventory', function(req, res) {
  request('http://' + APISERVERIP + ':' + APISERVERPORT + '/api/devices', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
        res.render('pages/inventory', {items: JSON.parse(body)});
    }
  });
});

router.get('/admin', function(req, res) {
  // request('http://' + APISERVERIP + ':' + APISERVERPORT + '/api/log/' + currentDate(), function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //       console.log(body);
  //       res.render('pages/admin', {items: JSON.parse(body)});
  //   }
  // });

  res.render('pages/admin', {items: ['Nothing to see here']});
});

router.get('/contact', function(req, res) {
  res.render('pages/contact');
});

router.post('/contact', function(req, res) {
  res.send('Thanks for contacting us, ' + req.body.name + '! We will respond shortly!');
});

// Helper
function currentDate() {
    var dateFormat = require('dateformat');
    var now = new Date();
    //dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    return dateFormat(now, "yyyy-mm-dd");
}