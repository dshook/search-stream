module.exports = function(options){
  var default_options = {
    caseSensitive: false,
    searchColumns: [],
  };

  options = options || {};
  for (var opt in default_options){
    if (default_options.hasOwnProperty(opt) && !options.hasOwnProperty(opt)){
        options[opt] = default_options[opt];
    }
  }

  return function(filter, obj){
    if(typeof obj === 'object'){
      if(Array.isArray(obj)){
        var res = [];
        for(var i = 0; i < obj.length; i++){
          if(Search(options, filter, obj[i])) res.push(obj[i]);
        }
        return res;
      }else{
        return Search(options, filter, obj);
      }
    }

    throw new Error('First argument must be an array or object to search');
  }
}

var Search = function(options, filter, obj){
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
        if(obj.length == 0) return false;

        //return true for any array value that matches
        for(var i = 0; i < obj.length; i++){
          if(Search(options, filter, obj[i])){
            return true;
          }
        }
      }else{
        //search every k/v pair
        for(var key in obj){
          if(Search(options, filter, obj[key])){
            return true;
          }
        }
        return false;
      }
      break;
    default: 
      return false;
  }
}
