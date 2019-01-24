chrome.runtime.onInstalled.addListener(function() {
  let matchers = {};
  chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
      // var bkg = chrome.extension.getBackgroundPage();
      // bkg.console.log(msg);
      const { type, key, payload } = msg;

      switch (type) {
        case 'removeMatcher': {
          delete matchers[key];
          return;
        }
        case 'fetchMatchers': {
          port.postMessage(JSON.stringify(matchers));
          return;
        }
        case 'addMatcher': {
          matchers[key] = {
            statusCode: 422,
          };
          return;
        }
        case 'updateStatusCode': {
          matchers[key].statusCode = payload;
          return;
        }
        default:
          return;
      }
    });
  })
  chrome.webRequest.onBeforeRequest.addListener(function (details) {
    let path;
    const { url } = details;
    if (matchers.length) {
      var bkg = chrome.extension.getBackgroundPage();
      bkg.console.log(path, details);
      if (new RegExp(matchers.join("|")).test(url)) {
        // At least one match
        path = url.split('chick-fil-a.com/')[1];
      }
    }
    if (path && details.method !== 'OPTIONS') {
      return {
        redirectUrl: `http://localhost:5000/${path}` /*Redirection URL*/
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
