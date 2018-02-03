(function createChannel() {
    //Create a port with background page for continous message communication
    var port = chrome.extension.connect({
        name: "nerdeFocusChromeExtension"
    });

    // Listen to messages from the background page
    port.onMessage.addListener(function (message) {
        if (message.sender.tab.id == chrome.devtools.inspectedWindow.tabId) {
            if (message.content.action === 'list' && !(message.content.itemTag === 'BODY' && message.content.framed)) {
                $('#history').append('<li class="' + (message.content.itemTag === 'BODY' ? 'reset' : '') + '\"><span class="tag">' + message.content.itemTag + '</span>' + (message.content.framed ? '(In Frame) ' : '') + message.content.itemPath + '</li>').scrollTop(999999999999);
            } else if (message.content.action === 'pageLoaded') {

                if (!message.content.framed) {
                    $('#history').append('<li class="url">Page Loaded [' + message.content.url + ']</li>').scrollTop(999999999999);
                }

                if ($('#captureButton').hasClass('pause')) {
                    sendObjectToInspectedPage({action: "command", content: "startTrack"});
                }

                if ($('#highlightButton').hasClass('on')) {
                    sendObjectToInspectedPage({action: "command", content: "startHighlight"});
                    sendObjectToInspectedPage({
                        action: "command",
                        content: "updateColor",
                        rgb: hexToRgb($('#colorPicker').val())
                    });
                }

                if ($('#animationButton').hasClass('on')) {
                    sendObjectToInspectedPage({action: "command", content: "startAnimation"});
                }
            }
        }
        //port.postMessage(message);
    });
}());

function sendObjectToInspectedPage(message) {
    message.tabId = chrome.devtools.inspectedWindow.tabId;
    chrome.extension.sendMessage(message);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [255, 0, 0];
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
    if ($(this).hasClass('on')) {
        $(this).removeClass('on').attr('aria-label', 'Turn On Focus Indicator');
        sendObjectToInspectedPage({action: "command", content: "stopHighlight"});
    } else {
        $(this).addClass('on').attr('aria-label', 'Turn Off Focus Indicator');
        sendObjectToInspectedPage({action: "command", content: "startHighlight"});
        if ($('#animationButton').hasClass('on')) {
            sendObjectToInspectedPage({action: "command", content: "startAnimation"});
        }
    }
});

$('#animationButton').click(function () {
    if ($(this).hasClass('on')) {
        $(this).removeClass('on').attr('aria-label', 'Turn On Animation');
        sendObjectToInspectedPage({action: "command", content: "stopAnimation"});
    } else {
        $(this).addClass('on').attr('aria-label', 'Turn Off Animation');
        sendObjectToInspectedPage({action: "command", content: "startAnimation"});
    }
});

$('#colorPicker').change(function () {
    sendObjectToInspectedPage({action: "command", content: "updateColor", rgb: hexToRgb($(this).val())});
});

