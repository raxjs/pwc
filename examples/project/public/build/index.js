
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
    #name = 'pwc'
    onClick() {
      console.log(123);
    }
  }

  return Component;

})();
