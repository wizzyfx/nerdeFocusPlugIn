(function createChannel() {
    //Create a port with background page for continous message communication
    var port = chrome.extension.connect({
        name: "nerdeFocusChromeExtension"
    });

    // Listen to messages from the background page
    port.onMessage.addListener(function (message) {
        console.log(message);
        if (message.sender.tab.id == chrome.devtools.inspectedWindow.tabId) {
            if (message.content.action === 'list') {
                $('#history').append("<li>[" + message.content.itemTag + "] " + message.content.itemPath + "</li>").scrollTop(999999999999);
            }
        }
        //port.postMessage(message);
    });
}());

function sendObjectToInspectedPage(message) {
    message.tabId = chrome.devtools.inspectedWindow.tabId;
    chrome.extension.sendMessage(message);
}

$('#captureButton').click(function () {
    if ($(this).hasClass('pause')) {
        $(this).removeClass('pause').html('Record');
        sendObjectToInspectedPage({action: "command", content: "stopTrack"});
    } else {
        $(this).addClass('pause').html('Pause');
        sendObjectToInspectedPage({action: "command", content: "startTrack"});
    }
});

$('#clearButton').click(function () {
    $('#history').empty();
});

$('#highlightButton').click(function () {
    sendObjectToInspectedPage({action: "code", content: "NerdeFocus.getFocus();"});
});


