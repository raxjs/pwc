
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
  'use strict';

  class Component extends HTMLElement {
    constructor() {
      const box = document.createElement('div');
      box.className = 'content';
      box.innerText = 'hahaha';
      this.appendChild(box);
    }

    #name = 'pwc';

    onClick() {
      console.log(123);
    }

    get template() {
      return ["\n  <!--?pwc_p--><div class=\"content\">\n    Hello World!\n    123\n    <!--?pwc_t-->\n    <!--?pwc_p--><img>\n    <hr>\n  </div>\n", [{
        name: this["name"],
        onclick: {
          handler: this["onClick456"],
          type: "capture"
        }
      }, this["title"], {
        src: this["source"]
      }]];
    }

  }

  return Component;

})();
