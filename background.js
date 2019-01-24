chrome.runtime.onInstalled.addListener(function() {
  let matchers = [];
  chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
      // var bkg = chrome.extension.getBackgroundPage();
      // bkg.console.log(msg);
      if (msg.indexOf('$$$') > -1) {
        const value = msg.split(' ')[1];
        matchers = matchers.filter(val => val !== value)
      }
      else if (msg.indexOf('***give-matchers-please***') > -1) {
        port.postMessage(JSON.stringify(matchers));
      }
      else if (msg.length) {
        matchers.push(msg)
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
