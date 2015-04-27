var stream = require('stream');

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

module.exports = function(options){
  var defaultOptions = {
    caseSensitive: false,
    searchKeys: []
  };

  options = options || {};
  for (var opt in defaultOptions){
    if (defaultOptions.hasOwnProperty(opt) && !options.hasOwnProperty(opt)){
      options[opt] = defaultOptions[opt];
    }
  }

  return function(filter, obj){
    if(typeof obj === 'object'){
      if(Array.isArray(obj)){
        var res = [];
        for(var i = 0; i < obj.length; i++){
          if(search(options, filter, obj[i])) res.push(obj[i]);
        }
        return res;
      }else{
        return search(options, filter, obj);
      }
    }else if(obj === undefined){
      //given no object to search assume stream Mode
      var searchTransform = new stream.Transform( { objectMode: true } );

      searchTransform._transform = function (chunk, encoding, done) {
        if(search(options, filter, chunk)) this.push(chunk);
        done();
      };

      searchTransform._flush = function (done) {
        done();
      };

      return searchTransform;
    }

    throw new Error('First argument must be an array or object to search');
  };
};

var search = function(options, filter, obj){
  if(isTestableType(obj)){
    //if searching by keys a value alone should never match
    //only as a key value pair below
    if(options.searchKeys.length > 0){
      return false;
    }
    return testValue(options, filter, obj);
  } else if(typeof obj === 'object'){
    if(Array.isArray(obj)){
      if(obj.length === 0) return false;

      //return true for any array value that matches
      for(var i = 0; i < obj.length; i++){
        if(search(options, filter, obj[i])){
          return true;
        }
      }
    }else{
      //search every k/v pair
      for(var key in obj){
        var value = obj[key];

        //test value here if applicable to prevent an extra layer of recursion
        if(isTestableType(value)){

          //check to see if the search keys has this key to check
          //but only if the value is a testable type to allow for nested keys
          if(options.searchKeys.length > 0 ){
            if(!arrayContains(key, options.searchKeys)){
              continue;
            }
          }

          if(testValue(options, filter, value)){
            return true;
          }
        }else if(
          //recurse for other kinds of objects 
          search(options, filter, value)
        ){
          return true;
        }
      }
      return false;
    }
  }else{
    return false;
  }
};

var isTestableType = function(value){
  switch(typeof value){
    case 'boolean':
    case 'number':
    case 'string':
      return true;
    default:
      return false;
  }
};

var testValue = function(options, filter, obj){
  if(filter instanceof RegExp){
    return filter.test(obj + '');
  }else{
    if(!options.caseSensitive){
      return (obj + '').toLowerCase().indexOf(filter.toLowerCase()) > -1;
    }
    return (obj + '').indexOf(filter) > -1;
  }
};

var arrayContains = function(needle, haystack){
  for(var sk = 0; sk < haystack.length; sk++){
    if(haystack[sk] === needle){
      return true;
    }
  }
  return false;
}
