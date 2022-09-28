chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.sendMessage({ greeting: "toggle", tab: tab }, (response) => {
    console.log(response);
  });
});
