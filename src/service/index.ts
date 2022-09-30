chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.sendMessage(
    { command: "toggleIndicator", tab: tab },
    (response) => {
      console.log(response);
    }
  );
});
