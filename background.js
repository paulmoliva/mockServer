let matchers = {};
chrome.runtime.onInstalled.addListener(function() {
  chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
      // var bkg = chrome.extension.getBackgroundPage();
      // bkg.console.log(msg);
      msg = JSON.parse(msg)
      const { type, key, payload } = msg;
      console.log(msg)
      console.log(matchers)
      switch (type) {
        case 'removeMatcher': {
          delete matchers[key];
          break;
        }
        case 'fetchMatchers': {
          port.postMessage(JSON.stringify(matchers));
          break;
        }
        case 'addMatcher': {
          matchers[key] = {
            statusCode: 422,
            responseKVPairs: [],
          };
          console.log(matchers)
          break;
        }
        case 'updateStatusCode': {
          matchers[key].statusCode = payload;
          console.log(matchers)
          break;
        }
        case 'addResponseKVPair': {
          matchers[key].responseKVPairs.push(payload)
          console.log(matchers)
          break;
        }
        default:
          console.log('default')
          return;
      }
    });
  })
  chrome.webRequest.onBeforeRequest.addListener(function (details) {
    let path, key;
    const { url } = details;
    if (Object.keys(matchers).length) {
      var bkg = chrome.extension.getBackgroundPage();
      bkg.console.log(path, details);
      Object.keys(matchers).forEach(matcher => {
        console.log(matcher)
        if (new RegExp(matcher).test(url)) {
          // At least one match
          path = url.split('chick-fil-a.com/')[1];
          key = matcher;
        }
      })
    }
    console.log(path, key)
    if (path && details.method !== 'OPTIONS') {
      return {
        redirectUrl: `http://localhost:5000/${path}?props=${JSON.stringify(matchers[key])}` /*Redirection URL*/
      };
    }
  }, { urls: ['<all_urls>'] }, ["blocking"]);
  // chrome.webRequest.onHeadersReceived.addListener(function (details) {
  //   if (_redirectURL == "") {
  //     var secondaryURL = extractSecondaryURL(details);
  //     _redirectUrl = secondaryURL;
  //     chrome.tabs.reload();
  //   }
  // }, {
  //   urls: ["http://*/*", "https://*/*"]
  // }, ["blocking", "responseHeaders"]);
});
