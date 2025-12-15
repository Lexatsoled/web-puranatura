'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var imageUtils_1 = require('../src/utils/imageUtils');
console.log('Testing /optimized/GABA.webp');
console.log((0, imageUtils_1.generateSrcSet)('/optimized/GABA.webp'));
console.log('Testing /optimized/GABA Anverso.webp (with spaces)');
console.log((0, imageUtils_1.generateSrcSet)('/optimized/GABA Anverso.webp'));
