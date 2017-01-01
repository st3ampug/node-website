// require express
var express = require('express');
var path    = require('path');
var request = require('request');


// create our router object
var router = express.Router();

// export our router
module.exports = router;

// route for our homepage
router.get('/', function(req, res) {
  request('http://localhost:3001/api/devices', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
        res.render('pages/home', {items: JSON.parse(body)});
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