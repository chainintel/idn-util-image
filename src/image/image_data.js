"use strict";
/**
 * @module webdnn/image
 */
/** Don't Remove This comment block */
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./canvas");
/**
 * @protected
 */
function getImageDataFromCanvas(canvas, options) {
    if (options === void 0) { options = {}; }
    var _a = options.srcX, srcX = _a === void 0 ? 0 : _a, _b = options.srcY, srcY = _b === void 0 ? 0 : _b, _c = options.srcW, srcW = _c === void 0 ? canvas.width : _c, _d = options.srcH, srcH = _d === void 0 ? canvas.height : _d, _e = options.dstX, dstX = _e === void 0 ? 0 : _e, _f = options.dstY, dstY = _f === void 0 ? 0 : _f;
    var _g = options.dstW, dstW = _g === void 0 ? srcW : _g, _h = options.dstH, dstH = _h === void 0 ? srcH : _h;
    var imageData = canvas_1.getContext2D(canvas).getImageData(srcX, srcY, srcW, srcH);
    if (dstX !== 0 || dstY !== 0 || srcW !== dstW || srcH !== dstH) {
        imageData = cropAndResizeImageData(imageData, { dstX: dstX, dstY: dstY, dstW: dstW, dstH: dstH });
    }
    return imageData;
}
exports.getImageDataFromCanvas = getImageDataFromCanvas;
/**
 * @protected
 */
function getImageDataFromDrawable(drawable, options) {
    if (options === void 0) { options = {}; }
    var srcW, srcH;
    if (drawable instanceof HTMLVideoElement) {
        srcW = drawable.videoWidth;
        srcH = drawable.videoHeight;
    }
    else if (drawable instanceof HTMLImageElement) {
        srcW = drawable.naturalWidth;
        srcH = drawable.naturalHeight;
    }
    else
        throw TypeError('Failed to execute "getImageDataFromDrawable(drawable, options)": "drawable" must be an instanceof HTMLVideoElement or HTMLImageElement');
    var _a = options.srcX, srcX = _a === void 0 ? 0 : _a, _b = options.srcY, srcY = _b === void 0 ? 0 : _b, _c = options.dstX, dstX = _c === void 0 ? 0 : _c, _d = options.dstY, dstY = _d === void 0 ? 0 : _d, _e = options.dstW, dstW = _e === void 0 ? srcW : _e, _f = options.dstH, dstH = _f === void 0 ? srcH : _f;
    var canvas = document.createElement('canvas');
    canvas.width = dstX + dstW;
    canvas.height = dstY + dstH;
    var context = canvas_1.getContext2D(canvas);
    context.drawImage(drawable, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
    return context.getImageData(0, 0, dstX + dstW, dstY + dstH);
}
exports.getImageDataFromDrawable = getImageDataFromDrawable;
/**
 * Source rectangle of source image is cropped and then copied into destination rectangle of new image data
 *
 * @param {ImageData} src
 * @param {SourceRect & DestinationRect} options
 * @returns {ImageData}
 * @protected
 */
function cropAndResizeImageData(src, options) {
    if (options === void 0) { options = {}; }
    var _a = options.srcX, srcX = _a === void 0 ? 0 : _a, _b = options.srcY, srcY = _b === void 0 ? 0 : _b, _c = options.srcW, srcW = _c === void 0 ? src.width : _c, _d = options.srcH, srcH = _d === void 0 ? src.height : _d, _e = options.dstX, dstX = _e === void 0 ? 0 : _e, _f = options.dstY, dstY = _f === void 0 ? 0 : _f;
    var _g = options.dstW, dstW = _g === void 0 ? srcW : _g, _h = options.dstH, dstH = _h === void 0 ? srcH : _h;
    var canvas1 = document.createElement('canvas');
    canvas1.width = srcW;
    canvas1.height = srcH;
    var context1 = canvas_1.getContext2D(canvas1);
    context1.putImageData(src, -srcX, -srcY);
    var canvas2 = document.createElement('canvas');
    canvas2.width = dstX + dstW;
    canvas2.height = dstY + dstH;
    var context2 = canvas_1.getContext2D(canvas2);
    context2.drawImage(canvas1, 0, 0, srcW, srcH, dstX, dstY, dstW, dstH);
    return context2.getImageData(0, 0, dstX + dstW, dstY + dstH);
}
/**
 * Return canvas `ImageData` object with specified scale.
 *
 * @param {HTMLCanvasElement | HTMLVideoElement | HTMLImageElement} image
 * @param [options] Options
 * @param {number} [options.srcX=0] left position of input clipping rect
 * @param {number} [options.srcY=0] top position of input clipping rect
 * @param {number} [options.srcW=canvas.width] width of input clipping rect
 * @param {number} [options.srcH=canvas.height] height of input clipping rect
 * @param {number} [options.dstW=options.srcW] width of output
 * @param {number} [options.dstH=options.srcH] height of output
 * @returns {ImageData}
 * @protected
 */
function getImageData(image, options) {
    if (options === void 0) { options = {}; }
    if (image instanceof HTMLCanvasElement) {
        return getImageDataFromCanvas(image, options);
    }
    else if (image instanceof HTMLVideoElement || image instanceof HTMLImageElement) {
        return getImageDataFromDrawable(image, options);
    }
    else
        throw TypeError('Failed to execute "getImageData(image, options)": "image" must be an instance of HTMLCanvasElement, HTMLVideoElement, or HTMLImageElement');
}
exports.getImageData = getImageData;
/**
 * @protected
 */
function setImageDataToCanvas(imageData, canvas, options) {
    if (options === void 0) { options = {}; }
    var _a = options.srcX, srcX = _a === void 0 ? 0 : _a, _b = options.srcY, srcY = _b === void 0 ? 0 : _b, _c = options.srcW, srcW = _c === void 0 ? imageData.width : _c, _d = options.srcH, srcH = _d === void 0 ? imageData.height : _d, _e = options.dstX, dstX = _e === void 0 ? 0 : _e, _f = options.dstY, dstY = _f === void 0 ? 0 : _f;
    var _g = options.dstW, dstW = _g === void 0 ? srcW : _g, _h = options.dstH, dstH = _h === void 0 ? srcH : _h;
    if (srcX !== 0 || srcY !== 0 || srcW !== dstW || srcH !== dstH) {
        imageData = cropAndResizeImageData(imageData, { srcX: srcX, srcY: srcY, srcW: srcW, srcH: srcH, dstW: dstW, dstH: dstH });
    }
    canvas_1.getContext2D(canvas).putImageData(imageData, dstX, dstY);
}
exports.setImageDataToCanvas = setImageDataToCanvas;
