var stream = require('stream');

module.exports = function(options){
  var defaultOptions = {
    caseSensitive: false,
    searchColumns: []
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
      //given no object to search assume stream mode
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
  switch(typeof obj){
    case 'boolean':
    case 'number':
    case 'string':
      if(!options.caseSensitive){
        return (obj + '').toLowerCase().indexOf(filter.toLowerCase()) > -1;
      }
      return (obj + '').indexOf(filter) > -1;
    case 'object':
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
          if(search(options, filter, obj[key])){
            return true;
          }
        }
        return false;
      }
      break;
    default:
      return false;
  }
};

