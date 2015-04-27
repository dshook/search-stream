# Search Stream

This project aims to create an easy and fast way to search an array or stream of objects given some text to search for or a regular expression.

## Spec

`var searchStream = require('search-stream');`

Returns a function to create an instance of search stream.

<pre>
  var options = {
    caseSensitive: false,
    searchKeys: ['key1','key2']
  };
  var search = searchStream(options);
</pre>  
Creates a search function with specified options. Case sensitivity is off by default.  Search keys allows you to specify which keys of the object should be searched including nested keys.  Default is none which allows all keys to be searched.


Perform the search on an array of objects:

`var result = search(filter, objectArray);`

Or on an object stream:

`var resultStream = readableStream().pipe(search(filter));`

The `filter` parameter is either a string to search for or a regular expression.

## Examples
Given an array of objects like this:
<pre>
  var objs = [{
    "name": "Twelve Monkeys",
    "outline": "In a future world devastated by disease, a convict is sent back in time to gather information about the man-made virus that wiped out most of the human population on the planet.",
    "rating": 8.1,
    "director": "Terry Gilliam",
    "year": 1995,
    "stars": [
      "Bruce Willis",
      "Madeleine Stowe",
      "Brad Pitt"
    ],
    "runtime": 129,
    "genre": [
      "Mystery",
      "Sci-Fi",
      "Thriller"
    ],
    "certificate": "R",
    "date": "1979-02-25T10:29:29+05:30",
    "actor": "Bruce Willis",
    "id": 200
  }]
</pre>

Here's how you search them and get back an array of objects with just the ones that match:

<pre>
  var searchStream = require('search-stream');
  var search = searchStream();

  var searchedObjs = search('Monkeys', objs);
</pre>

The search will also look in nested objects and arrays:
<pre>
  var searchedObjs = search('Sci-Fi', objs);
</pre>

Search will also function as a transform stream only allowing objects that match the search through:
<pre>
  var search = searchStream();
  var readableStream = getReadableStream();
  var destStream = readableStream.pipe(search('Bruce Willis'));
</pre>

The filter parameter can also be a regular expression:
<pre>
  var destStream = dataStream.pipe( search(/(.+,){5}/g) );
</pre>
