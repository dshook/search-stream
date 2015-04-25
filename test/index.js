var searchStream = require('../');
var test = require('tape');
var movies = require('./movie-data.js');

test('Basic Search', function (t) {
    t.plan(3);

    var movie = movies[0];
    var search = searchStream();

    t.equal(search(movie, 'Shawshank'), true, 'Found Shawshank');
    t.equal(search(movie, 'obbins'), true, 'Found partial Tim Robbins');
    t.equal(search(movie, 'bobo'), false, 'Did not find something not there');

});

test('Array Search', function(t){
  t.plan(3);

  var search = searchStream();

  var godfathers = search(movies, 'Godfather');

  t.ok(Array.isArray(godfathers), 'Result is Array');
  t.equal(godfathers.length, 2, 'Expected 2 Godfathers');

  var brandos = search(movies, 'Brando');

  t.equal(brandos.length, 4, 'Expected 4 Brandos');
});

test('Case Sensitivity', function(t){
  t.plan(4);

  var sensitiveSearch = searchStream({caseSensitive: true});
  var insensitiveSearch = searchStream({caseSensitive: false});

  var movie = movies[0];

  t.equal(sensitiveSearch(movie, 'Frank'), true, 'Found sensitive match');
  t.equal(sensitiveSearch(movie, 'frank'), false, 'Did not find sensitive match');

  t.equal(insensitiveSearch(movie, 'Frank'), true, 'Found insensitive match');
  t.equal(insensitiveSearch(movie, 'frank'), true, 'Found insensitive true match');

});
