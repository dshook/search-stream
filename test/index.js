var searchStream = require('../');
var test = require('tape');
var arrayToStream = require('stream-array');
var streamToArray = require('stream-to-array');
var movies = require('./movie-data.js');
var messages = require('./message-data.js');

test('Basic Search', function (t) {
    t.plan(3);

    var movie = movies[0];
    var search = searchStream();

    t.equal(search('Shawshank', movie), true, 'Found Shawshank');
    t.equal(search('obbins', movie), true, 'Found partial Tim Robbins');
    t.equal(search('bobo', movie), false, 'Did not find something not there');

});

test('Array Search', function(t){
  t.plan(3);

  var search = searchStream();

  var godfathers = search('Godfather', movies);

  t.ok(Array.isArray(godfathers), 'Result is Array');
  t.equal(godfathers.length, 2, 'Expected 2 Godfathers');

  var brandos = search('Brando', movies);

  t.equal(brandos.length, 4, 'Expected 4 Brandos');
});

test('Case Sensitivity', function(t){
  t.plan(4);

  var sensitiveSearch = searchStream({caseSensitive: true});
  var insensitiveSearch = searchStream({caseSensitive: false});

  var movie = movies[0];

  t.equal(sensitiveSearch('Frank', movie), true, 'Found sensitive match');
  t.equal(sensitiveSearch('frank', movie), false, 'Did not find sensitive match');

  t.equal(insensitiveSearch('Frank', movie), true, 'Found insensitive match');
  t.equal(insensitiveSearch('frank', movie), true, 'Found insensitive true match');

});

test('Stream', function(t){
  t.plan(2);

  var search = searchStream();
  var dataStream = arrayToStream(messages);

  var destStream = dataStream.pipe(search('female'));

  streamToArray(destStream, function(err, arr){
    t.ok(Array.isArray(arr), 'Result Stream is Array');
    t.equal(arr.length, 2, 'Two results for female');
  });
});

test('Stream nested object', function(t){
  t.plan(2);

  var search = searchStream({caseSensitive: true});
  var dataStream = arrayToStream(messages);

  var destStream = dataStream.pipe(search('Buck'));

  streamToArray(destStream, function(err, arr){
    t.ok(Array.isArray(arr), 'Result Stream is Array');
    t.equal(arr.length, 1, 'One young buck');
  });
});
