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

//for debugging purposes
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// getApiData('yourUsernameHere')
//   .then(data => console.log(data));
