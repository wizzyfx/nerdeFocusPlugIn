/**
 * Focus testing extension for accessibility testing.
 *
 * @author Ugurcan (Ugi) Kutluoglu <ugurcank@gmail.com>
 */

var NerdeFocus = (function () {
    "use strict";
    var captureFocus = false;
    var showHighlight = false;
    var animateHighlight = false;
    var highlightColor = "#C00";

    var sendObjectToDevTools = function (message) {
        chrome.extension.sendMessage(message);
    };

    // https://github.com/yamadapc/jquery-getpath
    var getPath = function (node) {
        var path, allSiblings;
        while (node.length) {
            var realNode = node[0], name = realNode.localName;
            if (!name) {
                break;
            }
            name = name.toLowerCase();
            if (realNode.id && document.querySelectorAll('[id='+realNode.id+']').length === 1) {
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
    };

    var isVisuallyHidden = function (node) {
        while (node.length) {
            var realNode = node[0];
            if (($(realNode).outerHeight() <= 8 || $(realNode).outerWidth() <= 8) && ($(realNode).css('overflow') == 'hidden' || $(realNode).css('overflow-x') == 'hidden' || $(realNode).css('overflow-y') == 'hidden')) {
                return true;
            }
            node = node.parent();
        }
        return false;
    };

    var updateFocus = function () {
        if (captureFocus) {
            var activeElem = $(document.activeElement);
            sendObjectToDevTools({
                action: "list",
                itemPath: getPath(activeElem),
                itemTag: activeElem.prop("tagName"),
                itemHidden: isVisuallyHidden(activeElem)
            });
        }
    };

    var resetChecker;
    var checkReset = function () {
        clearTimeout(resetChecker);
        if (captureFocus) {
            resetChecker = setTimeout(function () {
                if ($(document.activeElement).prop("tagName") === "BODY") {
                    updateFocus();
                }
            }, 200);
        }
    };

    var initialize = function () {
        chrome.runtime.onMessage.addListener(function (message) {
            if (message.action == "command") {
                switch (message.content) {
                    case 'startTrack':
                        captureFocus = true;
                        document.addEventListener("focus", updateFocus, true);
                        document.addEventListener("focusout", checkReset, true);
                        break;
                    case 'stopTrack':
                        captureFocus = false;
                        document.removeEventListener("focus", updateFocus, true);
                        document.removeEventListener("focusout", checkReset, true);
                        break;
                }
            }
        });
    };

    initialize();

    return {
        getFocus: function () {
            console.log(highlightColor);
        }
    };
})();