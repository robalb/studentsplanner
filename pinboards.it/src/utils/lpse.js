//the Localized Password Strength Estimator
import zxcvbn from 'zxcvbn';
import { sha1 } from './crypto.js';

const apiUrl = 'https://api.pwnedpasswords.com/range/';

const mergeConfig = [
  {
    min: 0,
    scoreCap: 1,
    guessesCap: false,
    forceWarning: false,
    warning: matches => "This password has previously appeared in a data breach and should never be used",
  },
  {
    min: 10,
    scoreCap: 1,
    guessesCap: matches => 23000000 - matches,
    forceWarning: false,
    warning: matches => `this password has previously appeared over ${matches} times in several data breaches and should never be used`,
  },
  {
    min: 1000,
    scoreCap: 0,
    guessesCap: matches => 100,
    crackTimesDisplay: {
      offline_fast_hashing_1e10_per_second: "less than a second",
      offline_slow_hashing_1e4_per_second: "less than a second",
      online_no_throttling_10_per_second: "2 minutes",
      online_throttling_100_per_hour: "10 hours",
    },
    crackTimesSeconds: {
      offline_fast_hashing_1e10_per_second: 1.001e-7,
      offline_slow_hashing_1e4_per_second: 0.1001,
      online_no_throttling_10_per_second: 100.1,
      online_throttling_100_per_hour: 36036,
    },
    forceWarning: false,
    warning: matches => `this password has previously appeared over ${matches} times in several data breaches and should never be used`,
  }
];

//this function recalculate the attributes
//score, guesses, guesses_log10, feedback.warning, feedback.suggestions
//based on the password matches on online breaches
function recalculateScore(audit, matches){
  //find the best config for the current matches value
  let i = 0, config = {};
  while(i < mergeConfig.length && mergeConfig[i].min < matches){
    config = mergeConfig[i];
    i++;
  }
  //apply the caps defined in the config
  if(config.scoreCap !== undefined && audit.score > config.scoreCap){
    audit.score = config.scoreCap;
  }
  if(config.guessesCap && audit.guesses > config.guessesCap(matches)){
    let capped = config.guessesCap(matches);
    audit.guesses = capped;
    audit.guesses_log10 = Math.log10(capped);
  }
  //change the feedback.warning if the current one is more important
  if(!audit.feedback.warning || config.forceWarning){
    audit.feedback.warning = config.warning(matches);
  }
  //change the time representations
  if(config.crackTimesSeconds){
    audit.crack_times_seconds = config.crackTimesSeconds;
  }
  if(config.crackTimesDisplay){
    audit.crack_times_display = config.crackTimesDisplay;
  }
  return audit;
}

function fetchData(url, timeout = 0) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.timeout = timeout
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

async function checkBreaches(password, options){
  let apiAudit = {};
  let hash = false;
  try{
    hash = await sha1(password);
  }catch(e){
    apiAudit.success = false;
    apiAudit.error = "could not generate the password hash";
  }
  if(hash){
    hash = hash.toUpperCase();
    let hashPrefix = hash.substring(0, 5);
    try{
      let response = await fetchData(apiUrl+hashPrefix, options.timeout);
      //iterate over the response and look for a match with the original hash
      response = response.split('\r\n');
      if(response.length < 2){
        apiAudit.success = false;
        apiAudit.error = "could not read the pwned password api";
      }else{
        let matches = response.reduce( (a,c)=>{
          c = c.split(':');
          if(c.length = 2){
            let [currentHash, count] = c;
            if((String(hashPrefix) + currentHash) == hash) return count;
          }
          return a;
        }, 0);
        apiAudit = {
          success: true,
          matches: matches
        }
      }
    }catch(e){
      apiAudit.success = false;
      apiAudit.error = "could not reach the pwned passwords api";
    }
  }

  return apiAudit;
}

/*
 * parameters:
 * string password - defaults to an empty string
 * object options:
 *   int timeout - the number of milliseconds a request can take before automatically being terminated
 *   bool breaches - when set to false, only the offline analysis of the password is performed
 */
async function lpse(password = "", options={timeout:0, breaches: true}){
  //truncate long passwords to preserve performance, as suggested by the zxcvbn library
  if (password.length > 100) {
    password = password.substring(0, 99);
  }

  //perform the first audit using the zxcvbn library
  let staticAudit = zxcvbn(password);

  //if not disabled in the options, and the password is not too simple
  //perform a second audit using the pwned passwords k-anonimity api
  let apiAudit = false;
  if(options.breaches && staticAudit.score > 1){
    apiAudit = await checkBreaches(password, options);
  }

  //merge the two audits
  let audit = staticAudit;
  if(apiAudit){
    //add apiAudit specific attributes
    audit.feedback.error = "";
    audit.matches_found_oline = 0;
    //merge the two audit attributes
    if(apiAudit.success){
      audit.matches_found_oline = apiAudit.matches;
      //change the data calculated by the previous audit if the password appeared in a breach
      if(apiAudit.matches > 0){
        audit = recalculateScore(audit, apiAudit.matches);
        audit.feedback.suggestions.push("Always use unique passwords. Reusing your passwords introduces you to vulnerabilities that you have no control over");
      }
    }
    else{
      //display the error in the audit
      audit.feedback.error = apiAudit.error;
    }
  }

  return audit;
}



// module.exports = lpse;
export default lpse;
