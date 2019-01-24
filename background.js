chrome.runtime.onInstalled.addListener(function() {
  let matcher = null;
  chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
      matcher = msg;
    });
  })
  chrome.webRequest.onBeforeRequest.addListener(function (details) {
    let path;
    if (matcher && (matcher !== ''))
      path = details.url.indexOf(matcher) >= 0 ? details.url.split('chick-fil-a.com/')[1] : null;
    var bkg = chrome.extension.getBackgroundPage();
    if (path) bkg.console.log(path, details);
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
