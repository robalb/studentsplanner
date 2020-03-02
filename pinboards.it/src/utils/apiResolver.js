
//received from the webpack-neutrino configuration
let envBasePath = __ENV_BASE_PATH__;
const API_PATH = (envBasePath || '') + '/apis/';

export async function getApiData(type)
{
  let response = await fetch(`https://my-json-server.typicode.com/robalb/tempApi/${type}`);
  let data = await response.json()
  await sleep(200)
  return data;
}

export async function updateData(type, data){
  //TODO
}

export async function getBulkApiData(types){
  //TODO
}


export async function login(mail, password, isHash, getData){
  let response = await fetch(`${API_PATH}login.php`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method: 'POST',
    body: JSON.stringify({
      mail: mail,
      password: password,
      isHash: isHash,
      getData: getData
    })
  });
  let data = await response.json();
  return data;
}

//for debugging purposes
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function uriSerialize(obj){
  return Object.keys(obj).map(function(key) {
    return key + '=' + obj[key];
  }).join('&');
}

// getApiData('yourUsernameHere')
//   .then(data => console.log(data));
