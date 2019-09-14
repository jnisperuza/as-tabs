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

 AsTabs.prototype.connectedCallback = function () {
     this.setAttribute(
         `style`, `
                    position: relative;
                    display: block;
                    width: 100%;
                `
     );
 }
 AsTabBar.prototype.connectedCallback = function () {
     this.setAttribute(
         `style`, `
                    display: inline-block;
                    width: 100%;
                    position: relative;
                    overflow-x: auto;
                    transition: visibility opacity 0.3s;
                `
     );
 }
 AsTab.prototype.connectedCallback = function () {
     var div = document.createElement('div');
     div.className = 'active';
     div.setAttribute(
         `style`, `
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: auto;
                    background-color: #00b0ff;
                    transition: width 0.1s;
                `
     );
     this.setAttribute(
         `style`, `
                    position: relative;
                    float: left;
                    display: block;
                    padding: 10px 20px;
                    background-color: #3f51b5;
                    cursor: pointer;
                    text-transform: uppercase;
                    font-family: sans-serif;
                    color: #FFFFFF;
                `
     );
     this.appendChild(div);
     this.addEventListener("click", function (event) {
         var index = Array.from(document.querySelectorAll('as-tab')).indexOf(event.target);
         var panels = document.querySelectorAll('as-tab-panel');
         var panel = Array.from(panels)[index];
         var tab = event.target;
         var tabs = document.querySelectorAll('as-tab');
         var tabChild = Array.prototype.slice.call(event.target.childNodes);

         // hide other active elements
         for (var y in tabs) {
             if (tabs[y] !== tab) {
                 if (tabs[y].children) {
                     var indicator = findElement('active', Array.prototype.slice.call(tabs[y].children));
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
                 if (panels[x].style) {
                     panels[x].style.visibility = 'hidden';
                     panels[x].style.width = '0';
                 }
             } else {
                 panel.style.visibility = 'visible';
                 panels[x].style.width = '100%';
             }
         }

     }, false);
 }
 AsTabPanel.prototype.connectedCallback = function () {
     this.setAttribute(
         `style`, `
                    display: block;
                    float: left;
                    position: relative;
                    visibility: hidden;
                    width: 100%;
                    height: auto;
                    font-family: sans-serif;
                    color: #010b17;
                `
     );
 }

 // disconnectedCallback
 // adoptedCallback

 // Monitor the 'name' attribute for changes.
 Object.defineProperty(AsTab, 'observedAttributes', {
     get: function () {
         return ['selected'];
     }
 });

 // or just use HelloElement.observedAttributes = ['name']
 // if it doesn't need to be dynamic
 // Respond to attribute changes.
 AsTab.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
     if (attr == 'selected') {
         if (newValue === 'true') {
             var that = this;
             setTimeout(function () {
                 var index = Array.from(document.querySelectorAll('as-tab')).indexOf(that);
                 var indicator = findElement('active', Array.prototype.slice.call(that.children));
                 var panels = document.querySelectorAll('as-tab-panel');
                 indicator.style.width = '100%';
                 panels[index].style.visibility = 'visible';
                 panels[index].style.width = '100%';
             }, 10);
         }
     }
 }

 customElements.define('as-tabs', AsTabs);
 customElements.define('as-tab-bar', AsTabBar);
 customElements.define('as-tab', AsTab);
 customElements.define('as-tab-panel', AsTabPanel);

 function findElement(className, data) {
     return data.find(function (element) {
         return element.className === className;
     });
 }