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
    var tabList = Array.from(document.querySelectorAll('as-tab'));
    for (var z in tabList) {
        var selected = tabList[z].getAttribute("selected");
        if (selected == 'true') {
            tabList[z].onload = onLoadTab(tabList[z]);
        }
        tabList[z].onclick = callbackTab(tabList[z]);
    }
}

if (window.customElements) {
    window.customElements.define('as-tabs', AsTabs);
    window.customElements.define('as-tab-bar', AsTabBar);
    window.customElements.define('as-tab', AsTab);
    window.customElements.define('as-tab-panel', AsTabPanel);
}

function onLoadTab(event) {
    setTimeout(function () {
        var index = Array.from(document.querySelectorAll('as-tab')).indexOf(event);
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
    }, 10);
}

function callbackTab(currentTab) {
    var div = document.createElement('div');
    div.className = 'active';
    currentTab.appendChild(div);
    currentTab.addEventListener("click", function (event) {
        var index = Array.from(document.querySelectorAll('as-tab')).indexOf(event.target);
        var panels = document.querySelectorAll('as-tab-panel');
        var panel = Array.from(panels)[index];
        var tab = event.target;
        var tabs = document.querySelectorAll('as-tab');
        var tabChild = Array.from(event.target.childNodes);

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

        for (var x in panels) {
            if (panels[x] !== panel) {
                hidden(panels[x]);
            } else {
                visible(panels[x]);
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