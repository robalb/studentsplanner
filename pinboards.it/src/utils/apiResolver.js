
//received from the webpack-neutrino configuration
let envBasePath = __ENV_BASE_PATH__;
const API_PATH = (envBasePath || '') + '/apis/';

//get the csrf token
let CSRF = 'no_csrf_found';
if(PHP_CSRF){
  CSRF = PHP_CSRF;
}

export async function apiRequest(api, data, method){
  data.CSRF = CSRF;
  let response = false;
  let path = API_PATH + api + '.php';
  try{
    response = await fetch(path, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: method,
      body: JSON.stringify(data),
    });
  }catch(e){
    return {
      error: 'network_error',
      details: e
    }
  }
  let decoded = {error: 'internal_error'};
  try{
    decoded = await response.json();
    //the user got logged, probably from another tab. refresh the page
    if(decoded.error && decoded.error == 'session_error_refresh'){
      location.reload();
      await sleep(5000);
    }
  }catch(e){
  }
  return decoded;
}

////for debugging purposes
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
