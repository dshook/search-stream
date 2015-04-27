var searchStream = require('../');
var arrayToStream = require('stream-array');
var streamToArray = require('stream-to-array');
var movies = require('./movie-data.js');
var messages = require('./message-data.js');

var medMovies = [];
for(var i = 0; i < 1000; i++){
  medMovies = medMovies.concat(movies);
}

var youveGotMail = [];
for(var i = 0; i < 1000; i++){
  youveGotMail = youveGotMail.concat(messages);
}

var benchmark = function(name, countSearched, func){
  var tStart = new Date();
  var cb = function(){
    var tEnd = new Date();
    var ms = (tEnd.getTime() - tStart.getTime());
    var objsPerMs = (countSearched / ms).toFixed(4);

    console.log(name);
    console.log('\t' + ms + 'ms \t' + countSearched + ' searched\tObjs/ms: ' + objsPerMs);
  };
  func(cb);
}


benchmark('Array', movies.length, function(cb){
  var search = searchStream();
  var godfathers = search('Godfather', movies);
  cb();
});

benchmark('Long Array', medMovies.length, function(cb){
  var search = searchStream();
  var godfathers = search('men', medMovies);
  cb();
});

benchmark('Regex', youveGotMail.length, function(cb){
  var search = searchStream();
  var results = search(/(.+,){3}/g, youveGotMail);
  cb();
});
