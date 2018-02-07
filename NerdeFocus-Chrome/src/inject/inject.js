/**
 * Focus testing extension for accessibility testing.
 *
 * @author Ugurcan (Ugi) Kutluoglu <ugurcank@gmail.com>
 */

var NerdeFocus = (function () {
    "use strict";
    var captureFocus = false;
    var showHighlight = false;
    var animateHighlight = true;
    var highlightColor = [255, 0, 0];
    var listeningFocus = false;
    var activeElem = $(document.activeElement);
    var inFrame = window.self !== window.top;

    var sendObjectToDevTools = function (message) {
        chrome.extension.sendMessage(message);
    };

    // https://github.com/yamadapc/jquery-getpath
    var getPath = function (node) {
        var path, allSiblings;

        //Inspired from https://github.com/dequelabs/axe-core/blob/develop/lib/core/utils/get-selector.js
        var commonNames = ['selected', 'active', 'focus', 'hover', 'enable', 'hidden', 'visible', 'valid', 'disable', 'col-'];

        while (node.length) {
            var realNode = node[0], name = realNode.localName;
            if (!name) {
                break;
            }
            name = name.toLowerCase();
            if (realNode.id && /^[A-Za-z][\da-zA-Z_:.-]/.test(realNode.id) && document.querySelectorAll('[id=' + realNode.id + ']').length === 1) {
                name = '#' + realNode.id;
                path = name + (path ? '>' + path : '');
                break;
            }

            var className='';
            var classList = realNode.className.split(/\s+/);
            for (var i = 0; i < classList.length; i++) {
                if (/^[\da-zA-Z_-]/.test(classList[i]) && commonNames.findIndex(function(str){return classList[i].indexOf(str)!==-1})===-1 && document.querySelectorAll('.' + classList[i]).length === 1) {
                    className = '.' + classList[i];
                    break;
                }
            }
            if (className!='') {
                path = className + (path ? '>' + path : '');
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
        try {
            while (node.length) {
                if ((node.outerHeight() <= 8 || node.outerWidth() <= 8) && (node.css('overflow') == 'hidden' || node.css('overflow-x') == 'hidden' || node.css('overflow-y') == 'hidden')) {
                    return true;
                }
                node = node.parent();
            }
        } catch (e) {
            return false;
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
                framed: inFrame
            });
        }

        if (showHighlight) {
            updateHighlight();
        }
    };

    var updateHighlight = function () {
        if (activeElem.prop("tagName") === "BODY" && !inFrame) {
            $('#nerdeFocusOverlay').css('left', '4px').css('top', '4px').css('width', $(window).width() - 8 + 'px').css('height', $(window).height() - 8 + 'px');
        } else {
            var elementTop = activeElem[0].getBoundingClientRect().top;
            var elementLeft = activeElem[0].getBoundingClientRect().left;
            var elementBottom = elementTop + activeElem.outerHeight();
            var elementRight = elementLeft + activeElem.outerWidth();
            var elementHeight = activeElem[0].offsetHeight;
            var elementWidth = activeElem[0].offsetWidth;
            var viewportBottom = $(window).height();
            var viewportRight = $(window).width();

            if (elementHeight < 8) {
                elementTop = elementTop + Math.round(8 - elementHeight / 2);
                elementHeight = 8;
            }

            if (elementWidth < 8) {
                elementLeft = elementLeft + Math.round(8 - elementWidth / 2);
                elementWidth = 8;
            }

            if (elementLeft > viewportRight) {
                elementLeft = viewportRight;
            }

            if (elementTop > viewportBottom) {
                elementTop = viewportBottom;
            }

            if (elementBottom < 0) {
                elementTop = -elementHeight;
            }

            if (elementRight < 0) {
                elementLeft = -elementWidth;
            }

            $('#nerdeFocusOverlay').css('left', elementLeft + 'px').css('top', elementTop + 'px').css('width', elementWidth + 'px').css('height', elementHeight + 'px');
        }
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
                        if (!showHighlight) {
                            showHighlight = true;
                            $('#nerdeFocusOverlay').remove();
                            $('body').append('<div id="nerdeFocusOverlay" style="transition-property:none;transition-duration:0.25s;transition-timing-function:ease-in-out;background:none;position:fixed;top:0;left:0;width:0;height:0;outline:4px solid rgba(' + highlightColor[0] + ',' + highlightColor[1] + ',' + highlightColor[2] + ',0.85);outline-offset:2px;z-index:999999999;pointer-events:none!important;"></div>');
                        }
                        updateHighlight();
                        break;
                    case 'stopHighlight':
                        showHighlight = false;
                        $('#nerdeFocusOverlay').remove();
                        break;
                    case 'updateColor':
                        highlightColor = message.rgb;
                        if (showHighlight) {
                            $('#nerdeFocusOverlay').css('outline', '0.25rem solid rgba(' + highlightColor[0] + ',' + highlightColor[1] + ',' + highlightColor[2] + ',0.85)');
                        }
                        break;
                    case 'startAnimation':
                        animateHighlight = true;
                        $('#nerdeFocusOverlay').css('transition-property', 'all');
                        break;
                    case 'stopAnimation':
                        animateHighlight = false;
                        $('#nerdeFocusOverlay').css('transition-property', 'none');
                        break;
                }

                if (!listeningFocus) {
                    document.addEventListener("focus", updateFocus, true);
                    document.addEventListener("focusout", checkReset, true);
                    document.addEventListener("scroll", updateHighlight, true);
                    setTimeout(function () {
                        updateFocus();
                    }, 200);
                    listeningFocus = true;
                }
            }
        });

        sendObjectToDevTools({
            action: "pageLoaded",
            url: window.location.hostname,
            framed: inFrame
        });
    };

    $(document).ready(function () {
        initialize();
    });

    // return {
    //     getFocus: function () {
    //         console.log(highlightColor);
    //     }
    // };
})();