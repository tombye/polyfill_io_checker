const fs = require('fs');

const polyfillLibrary = require('polyfill-library');
const outputFileRaw = './bundle.raw.js';
const outputFileMinified = './bundle.min.js';
const languageFeatures = {
  'Array.prototype.concat': {},
  'Array.prototype.filter': {},
  'Array.prototype.includes': {},
  'Array.prototype.join': {},
  'Array.prototype.map': {},
  'Array.prototype.slice': {},
  'Array.prototype.sort': {},
  'Array.prototype.splice': {},
  'Function.name': {},
  'JSON.Stringify': {},
  'NodeList.prototype.forEach': {},
  'Object.entries': {},
  'Object.keys': {},
  'Object.prototype.toString': {},
  'RegExp.prototype.constructor': {},
  'RegExp.prototype.exec': {},
  'RegExp.prototype.sticky': {},
  'RegExp.prototype.toString': {},
  'String.prototype.match': {},
  'String.prototype.replace': {},
  'String.prototype.split': {},
  'String.prototype.startsWith': {},
  'String.prototype.trim': {}
}

const polyfillBundleRaw = polyfillLibrary.getPolyfillString({
  uaString: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
  minify: false,
  features: languageFeatures
}).then(function(bundleString) {
  fs.writeFile(outputFileRaw, bundleString, error => {
    if (error) {
      console.log(error);
      return;
    }
  });
});

const polyfillBundleMinified = polyfillLibrary.getPolyfillString({
  uaString: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
  minify: true,
  features: languageFeatures
}).then(function(bundleString) {
  fs.writeFile(outputFileMinified, bundleString, error => {
    if (error) {
      console.log(error);
      return;
    }
  });
});
