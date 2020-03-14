

//replace string templates that use the {{key}} format with the value in data.key
function useTemplate(string, data){
  let returnString = string;
  for (let key in data) {
    let regex = new RegExp('{{' + key + '}}', 'ig');
    returnString = returnString.replace(regex, data[key]);
  }
  return returnString;
}

//get laguage string from the global language variable
function getKeyMatch(key){
  if(!LANGUAGE) return false;
  return LANGUAGE[key];
}

//act similarly to the t function in the react i18n library
function t(key, params){
  let match = getKeyMatch(key);
  //fallback for missing key
  if(!match){
    console.error("missing key ", key);
    return key;
  }
  //use templating if needed
  if(params){
    return useTemplate(match, params)
  }
  return match;
}

export default t;
