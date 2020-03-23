
//received from the webpack-neutrino configuration
let envBasePath = __ENV_BASE_PATH__;
const API_PATH = (envBasePath || '') + '/apis/';

//get the csrf token
let CSRF = 'no_csrf_found';
//TODO: decomment this once the csrf token injection has been
//implemented in php
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
  }catch(e){
  }
  return decoded;
}

//export async function getApiData(elementsArray)
//{
//  let data = {
//    elements: elementsArray
//  };
//  return await apiRequest('getData', data, 'GET');
//}

//export async function updatePlannerData(updateData){
//  let data = {
//    action: 'push',
//    data: updateData
//  }
//  return await apiRequest('planner', data, 'GET');
//}

//export async function register(registrationData){
//  return await apiRequest('register', registrationData, 'POST');
//}


//export async function login(mail, password, isHash, getData){
//  return await apiRequest('login', registrationData, 'POST');
//  let response = await fetch(`${API_PATH}login.php`, {
//    headers: { "Content-Type": "application/json; charset=utf-8" },
//    method: 'POST',
//    body: JSON.stringify({
//      mail: mail,
//      password: password,
//      isHash: isHash,
//      getData: getData
//    })
//  });
//  let data = await response.json();
//  return data;
//}

////for debugging purposes
//function sleep(ms) {
//  return new Promise(resolve => setTimeout(resolve, ms));
//}

//// getApiData('yourUsernameHere')
////   .then(data => console.log(data));
