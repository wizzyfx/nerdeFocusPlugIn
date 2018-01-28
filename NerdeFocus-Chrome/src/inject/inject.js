/**
 * Focus testing extension for accessibility testing.
 *
 * @author Ugurcan (Ugi) Kutluoglu <ugurcank@gmail.com>
 */
var captureFocus = false;

var NerdeFocus = (function () {
    "use strict";


    var showHighlight = false;
    var animateHighlight = false;
    var highlightColor = "#C00";

    var initialize = function () {
        document.addEventListener("focus", function () {
            updateFocus();
        }, true);

        chrome.runtime.onMessage.addListener(function(message) {
            if(message.action=="command"){
                switch(message.content) {
                    case 'startTrack':
                        captureFocus = true;
                        break;
                    case 'stopTrack':
                        captureFocus = false;
                        break;
                }
            }
        });
    };

    var sendObjectToDevTools = function (message) {
        // The callback here can be used to execute something on receipt
        chrome.extension.sendMessage(message, function (message) {
        });
    }

    /**
     * https://github.com/yamadapc/jquery-getpath
     */
    var getPath = function (node) {
        var path, allSiblings;
        while (node.length) {
            var realNode = node[0], name = realNode.localName;
            if (!name) {
                break;
            }
            name = name.toLowerCase();
            if (realNode.id && $('#' + realNode.id).length === 1) {
                name = '#' + realNode.id;
                path = name + (path ? '>' + path : '');
                break;
            }
            var parent = node.parent();
            var sameTagSiblings = parent.children(name);
            if (sameTagSiblings.length > 1) {
                allSiblings = parent.children();
                var index = allSiblings.index(realNode) + 1;
                if (index > 1) {
                    name += ':nth-child(' + index + ')';
                }
            }
            path = name + (path ? '>' + path : '');
            node = parent;
        }
        return path;
    }

    var isVisuallyHidden = function (node) {
        while (node.length) {
            var realNode = node[0];
            if (($(realNode).outerHeight() <= 8 || $(realNode).outerWidth() <= 8) && ($(realNode).css('overflow') == 'hidden' || $(realNode).css('overflow-x') == 'hidden' || $(realNode).css('overflow-y') == 'hidden')) {
                return true;
            }
            node = node.parent();
        }
        return false;
    }

    var updateFocus = function () {
        if (captureFocus){
            sendObjectToDevTools(getPath($(document.activeElement)));
        }
    }

    initialize();
})();