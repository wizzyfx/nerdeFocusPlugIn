// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.extension.*

chrome.runtime.onConnect.addListener(function (port) {

    var extensionListener = function (message, sender) {
        if (message.tabId && message.content) {
            if (message.action === 'code') {
                //Evaluate script in inspectedPage
                chrome.tabs.executeScript(message.tabId, {code: message.content});
            } else if (message.action === 'script') {
                //Attach script to inspectedPage
                chrome.tabs.executeScript(message.tabId, {file: message.content});
            } else {
                //Pass message to inspectedPage
                chrome.tabs.sendMessage(message.tabId, message);
            }
        } else {
            // This accepts messages from the inspectedPage and sends them to the panel
            port.postMessage({message: message, sender: sender});
        }
    }

    // Listens to messages sent from the panel
    chrome.extension.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function (port) {
        chrome.extension.onMessage.removeListener(extensionListener);
    });

    // port.onMessage.addListener(function (message) {
    //     port.postMessage(message);
    // });

});

chrome.runtime.onMessage.addListener(function (request, sender) {
    return true;
});