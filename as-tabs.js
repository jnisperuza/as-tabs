function AsTabs() {
    return Reflect.construct(HTMLElement, [], AsTabs);
}

function AsTabBar() {
    return Reflect.construct(HTMLElement, [], AsTabBar);
}

function AsTab() {
    return Reflect.construct(HTMLElement, [], AsTab);
}

function AsTabPanel() {
    return Reflect.construct(HTMLElement, [], AsTabPanel);
}

AsTabs.prototype = Object.create(HTMLElement.prototype);
AsTabBar.prototype = Object.create(HTMLElement.prototype);
AsTab.prototype = Object.create(HTMLElement.prototype);
AsTabPanel.prototype = Object.create(HTMLElement.prototype);

if ('registerElement' in document && 'import' in document.createElement('link') && 'content' in document.createElement('template')) {
    AsTabBar.prototype.connectedCallback = function () {
        onLoadTabBar(this);
    }
    AsTab.prototype.connectedCallback = function () {
        callbackTab(this);
    }
    // disconnectedCallback
    // adoptedCallback
    Object.defineProperty(AsTab, 'observedAttributes', {
        get: function () {
            return ['selected'];
        }
    });
    AsTab.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (attr == 'selected') {
            if (newValue === 'true') {
                onLoadTab(this);
            }
        }
    }
} else {
    customConnectedCallback();
}

if (window.customElements) {
    window.customElements.define('as-tabs', AsTabs);
    window.customElements.define('as-tab-bar', AsTabBar);
    window.customElements.define('as-tab', AsTab);
    window.customElements.define('as-tab-panel', AsTabPanel);
}

function customConnectedCallback() {
    var setEventTabBar = function () {
        return new Promise(function (resolve, reject) {
            var tabBarList = Array.from(document.querySelectorAll('as-tab-bar'));
            for (var z in tabBarList) {
                tabBarList[z].onload = onLoadTabBar(tabBarList[z]);
            }
            setTimeout(resolve);
        });
    };
    var setEventTab = function () {
        var tabList = Array.from(document.querySelectorAll('as-tab'));
        for (var z in tabList) {
            var selected = tabList[z].getAttribute("selected");
            if (selected == 'true') {
                tabList[z].onload = onLoadTab(tabList[z]);
            }
            tabList[z].onclick = callbackTab(tabList[z]);
        }
    };
    setEventTabBar().then(setEventTab)
}

function onLoadTabBar(event) {
    setTimeout(dispatch);

    function dispatch() {
        if (event.scrollWidth > event.offsetWidth) {
            var tabs = Array.from(event.children);
            var asScroll = document.createElement('div');
            var buttonLeft = document.createElement('button');
            var buttonRight = document.createElement('button');
            var commonStyle = { position: 'absolute', zIndex: 10, width: '15px', height: '100%', padding: 0, border: 'none' };
            var movement = event.offsetWidth / event.childElementCount;

            asScroll.className = 'as-tab-scroll';
            event.style.boxSizing = 'border-box';
            event.style.padding = '0 15px';
            buttonLeft.style.left = 0;
            buttonLeft.innerHTML = '&#9666;';
            buttonRight.style.right = 0;
            buttonRight.innerHTML = '&#9656;';

            for (var x in tabs) {
                var copy = tabs[x].cloneNode(true);
                asScroll.appendChild(copy);
                event.removeChild(tabs[x]);
            }

            for (var x in commonStyle) {
                buttonLeft.style[x] = commonStyle[x];
                buttonRight.style[x] = commonStyle[x];
            }

            event.appendChild(asScroll);
            event.appendChild(buttonLeft);
            event.appendChild(buttonRight);

            buttonLeft.addEventListener("click", function (e) {
                asScroll.scrollLeft -= movement;
            });
            buttonRight.addEventListener("click", function (e) {
                asScroll.scrollLeft += movement;
            });
        };
    }
}

function onLoadTab(event) {
    setTimeout(dispatch);

    function dispatch() {
        var index = Array.from(document.querySelectorAll('as-tab')).indexOf(event);
        if (index !== -1) {
            var div = document.createElement('div');
            var indicator = findElement('active', Array.from(event.children));
            var panels = document.querySelectorAll('as-tab-panel');

            div.className = 'active';
            event.appendChild(div);
            indicator.style.width = '100%';
            panels[index].style.visibility = 'visible';
            panels[index].style.width = '100%';
            panels[index].style.height = 'auto';
            panels[index].style.padding = '10px';
        }
    }
}

function callbackTab(currentTab) {
    var div = document.createElement('div');
    div.className = 'active';
    currentTab.appendChild(div);
    currentTab.addEventListener("click", function (event) {
        var index = Array.from(document.querySelectorAll('as-tab')).indexOf(event.target);
        var panels = document.querySelectorAll('as-tab-panel');
        var tab = event.target;
        var tabChild = Array.from(event.target.childNodes);
        var tabs = document.querySelectorAll('as-tab');

        // hide other active elements
        for (var y in tabs) {
            if (tabs[y] !== tab) {
                if (tabs[y].children) {
                    var indicator = findElement('active', Array.from(tabs[y].children));
                    indicator.style.width = '0';
                    tabs[y].removeAttribute('selected');
                }
            } else {
                var indicator = findElement('active', tabChild);
                indicator.style.width = '100%';
                tab.setAttribute('selected', true);
            }
        }

        if (index !== -1) {
            var panel = Array.from(panels)[index];
            for (var x in panels) {
                if (panels[x] !== panel) {
                    hidden(panels[x]);
                } else {
                    visible(panels[x]);
                }
            }
        }

    }, false);
}

function visible(panel) {
    panel.style.visibility = 'visible';
    panel.style.width = '100%';
    panel.style.height = 'auto';
    panel.style.padding = '10px';
}

function hidden(panel) {
    if (panel.style) {
        panel.style.visibility = 'hidden';
        panel.style.width = '0';
        panel.style.height = '0';
        panel.style.padding = '0';
    }
}

function findElement(className, data) {
    return data.find(function (element) {
        return element.className === className;
    });
}