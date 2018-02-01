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
    var highlightColor = [255, 0, 0];
    var listeningFocus = false;
    var activeElem = $(document.activeElement);

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
            if (realNode.id && document.querySelectorAll('[id=' + realNode.id + ']').length === 1) {
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
            /*
            if (($(realNode).outerHeight() <= 8 || $(realNode).outerWidth() <= 8) && ($(realNode).css('overflow') == 'hidden' || $(realNode).css('overflow-x') == 'hidden' || $(realNode).css('overflow-y') == 'hidden')) {
                return true;
            }
            */
            node = node.parent();
        }
        return false;
    };

    var updateFocus = function () {
        activeElem = $(document.activeElement);

        if (captureFocus) {
            sendObjectToDevTools({
                action: "list",
                itemPath: getPath(activeElem),
                itemTag: activeElem.prop("tagName"),
                itemHidden: isVisuallyHidden(activeElem),
                framed: window.self !== window.top
            });
        }

        if (showHighlight) {
            updateHighlight();
        }
    };

    var updateHighlight=function(){
        var elementTop = activeElem[0].getBoundingClientRect().top;
        var elementLeft = activeElem[0].getBoundingClientRect().left;
        var elementBottom = elementTop + activeElem.outerHeight();
        var elementRight = elementLeft + activeElem.outerWidth();
        var viewportBottom = $('body').outerHeight();
        var viewportRight = $('body').outerWidth();

        if (elementLeft > viewportRight) {
            elementLeft = viewportRight;
        }

        if (elementTop > viewportBottom) {
            elementTop = viewportBottom;
        }

        $('#nerdeFocusOverlay').css('left', elementLeft + 'px').css('top', elementTop + 'px').css('width', activeElem.outerWidth() + 'px').css('height', activeElem.outerHeight() + 'px');
    }

    var resetChecker;
    var checkReset = function () {
        clearTimeout(resetChecker);
        if (showHighlight || captureFocus) {
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
                        break;
                    case 'stopTrack':
                        captureFocus = false;
                        break;
                    case 'startHighlight':
                        if(!showHighlight){
                            showHighlight = true;
                            $('#nerdeFocusOverlay').remove();
                            $('body').append('<div id="nerdeFocusOverlay" style="background:none;position:fixed;top:0;left:0;width:0;height:0;outline:0.25rem solid rgba(' + highlightColor[0] + ',' + highlightColor[1] + ',' + highlightColor[2] + ',0.5);outline-offset:0.1rem;z-index:9999997;transition:top 0.25s ease-in-out,left 0.25s ease-in-out,width 0.25s ease-in-out,height 0.25s ease-in-out;pointer-events:none!important;"></div>');
                        }
                        break;
                    case 'stopHighlight':
                        showHighlight = false;
                        $('#nerdeFocusOverlay').remove();
                        break;
                    case 'updateColor':
                        highlightColor = message.rgb;
                        if (showHighlight) {
                            $('#nerdeFocusOverlay').css('outline', '0.25rem solid rgba(' + highlightColor[0] + ',' + highlightColor[1] + ',' + highlightColor[2] + ',0.5)');
                        }
                        break;
                }

                if (showHighlight || captureFocus) {
                    if (!listeningFocus) {
                        document.addEventListener("focus", updateFocus, true);
                        document.addEventListener("focusout", checkReset, true);
                        document.addEventListener("scroll", updateHighlight, true);
                        setTimeout(function () {
                            updateFocus();
                        }, 200);
                        listeningFocus = true;
                    }
                } else {
                    document.removeEventListener("focus", updateFocus, true);
                    document.removeEventListener("focusout", checkReset, true);
                    listeningFocus = false;
                }
            }
        });

        sendObjectToDevTools({
            action: "pageLoaded",
            url: window.location.hostname,
            framed: window.self !== window.top
        });
    };

    $(document).ready(function () {
        initialize();
    });

    return {
        getFocus: function () {
            //console.log(highlightColor);
        }
    };
})();