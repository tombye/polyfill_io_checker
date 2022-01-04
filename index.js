const fs = require('fs');

const polyfillLibrary = require('polyfill-library');
const outputFileRaw = './bundle.raw.js';
const outputFileMinified = './bundle.min.js';
const outputDataFile = './bundle.data.json';

const uaStrings = {
  "ie9": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
  "ie11": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko"
};

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

const defaultOptions = {
  uaString: uaStrings.ie9,
  minify: false,
  features: languageFeatures
};

function generateBundle (outputFile, newOptions) {

  let options = Object.assign({}, defaultOptions);

  if (newOptions !== undefined) {
    options = Object.assign(options, newOptions);
  }

  const polyfillBundle = polyfillLibrary.getPolyfillString(options).then(function(bundleString) {
    fs.writeFile(outputFile, bundleString, error => {
      if (error) {
        console.log(error);
        return;
      }
    });
  });

};

// Polyfills data contains Sets which need turning to Arrays to be stored as JSON
function processPolyfillsData (data) {

  Object.entries(data).forEach(entry => {

    const [entryName, entryAttrs] = entry;

    Object.entries(entryAttrs).forEach(attr => {

      const [attrName, attrValue] = attr;

      if (attrValue instanceof Set) {
        data[entryName][attrName] = Array.from(attrValue);
      }

    });

  });

  return data;

};

function reportBundleData (data) {

  const report = {
    notRecognised: [],
    polyfillsIncluded: [],
    dependencies: []
  };

  Object.entries(data).forEach(entry => {

    const [entryName, entryAttrs] = entry;

    if (Object.keys(entryAttrs).length === 0) {

      report.notRecognised.push(entryName);

    } else {

      if (entryAttrs.dependencyOf.length > 0) {

        report.dependencies.push(entryName);

      } else {

        report.polyfillsIncluded.push(entryName);

      }

    }

  });

  return report;

};

function generatePolyfillsData (outputFile, newOptions) {

  let options = Object.assign({}, defaultOptions);

  if (newOptions !== undefined) {
    options = Object.assign(options, newOptions);
  }

  const polyfillBundle = polyfillLibrary.getPolyfills(options).then(function(bundleData) {
    fs.writeFile(outputFile, JSON.stringify(processPolyfillsData(bundleData), null, 4), error => {
      if (error) {
        console.log(error);
        return;
      }
    });

    console.log(reportBundleData(bundleData));
  });

};

generateBundle(outputFileRaw);
generateBundle(outputFileMinified, {"minify": true});
generatePolyfillsData(outputDataFile);

