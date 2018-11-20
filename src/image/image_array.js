"use strict";
/**
 * @module webdnn/image
 */
/** Don't Remove This comment block */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./canvas");
var enums_1 = require("./enums");
var image_data_1 = require("./image_data");
var image_source_1 = require("./image_source");
/**
 * @protected
 */
function flatten(arr) {
    return (arr instanceof Array) ? Array.prototype.concat.apply([], arr.map(function (arr) { return flatten(arr); })) : arr;
}
/**
 * @protected
 */
function normalizeBiasTuple(arr) {
    if (typeof (arr) == "number") {
        return [arr, arr, arr, arr];
    }
    else {
        if (arr.length == 4) {
            return [arr[0], arr[1], arr[2], arr[3]];
        }
        else if (arr.length == 3) {
            return [arr[0], arr[1], arr[2], arr[0]];
        }
        else if (arr.length == 1) {
            return [arr[0], arr[0], arr[0], arr[0]];
        }
        else {
            throw new Error('bias and scale must be scalar number or array of length 1 or 3 or 4.');
        }
    }
}
/**
 * Get image array as `{Float32 or Int32}ArrayBufferView` from ImageData object.
 *
 * @returns {ArrayBufferView} buffer with specified type
 * @protected
 */
function getImageArrayFromImageData(imageData, options) {
    if (options === void 0) { options = {}; }
    var _a = options.type, type = _a === void 0 ? Float32Array : _a, _b = options.color, color = _b === void 0 ? enums_1.Color.RGB : _b, _c = options.order, order = _c === void 0 ? enums_1.Order.HWC : _c, _d = options.bias, bias = _d === void 0 ? [0, 0, 0] : _d, _e = options.scale, scale = _e === void 0 ? [1, 1, 1] : _e;
    var bias_n = normalizeBiasTuple(bias);
    var scale_n = normalizeBiasTuple(scale);
    var width = imageData.width;
    var height = imageData.height;
    var data = imageData.data;
    var array;
    var biasR, biasG, biasB, biasA;
    var scaleR, scaleG, scaleB, scaleA;
    switch (color) {
        case enums_1.Color.RGB:
            array = new type(width * height * 3);
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2];
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2];
            switch (order) {
                case enums_1.Order.HWC:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(h * width + w) * 3 + 0] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                            array[(h * width + w) * 3 + 1] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(h * width + w) * 3 + 2] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(0 * height + h) * width + w] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                            array[(1 * height + h) * width + w] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(2 * height + h) * width + w] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.BGR:
            array = new type(width * height * 3);
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2];
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2];
            switch (order) {
                case enums_1.Order.HWC:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(h * width + w) * 3 + 0] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                            array[(h * width + w) * 3 + 1] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(h * width + w) * 3 + 2] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(0 * height + h) * width + w] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                            array[(1 * height + h) * width + w] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(2 * height + h) * width + w] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.RGBA:
            array = new type(width * height * 4);
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2], scaleA = scale_n[3];
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2], biasA = bias_n[3];
            switch (order) {
                case enums_1.Order.HWC:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(h * width + w) * 4 + 0] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                            array[(h * width + w) * 4 + 1] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(h * width + w) * 4 + 2] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                            array[(h * width + w) * 4 + 3] = (data[(h * width + w) * 4 + 3] - biasA) / scaleA;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(0 * height + h) * width + w] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                            array[(1 * height + h) * width + w] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(2 * height + h) * width + w] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                            array[(3 * height + h) * width + w] = (data[(h * width + w) * 4 + 3] - biasA) / scaleA;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.BGRA:
            array = new type(width * height * 4);
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2], biasA = bias_n[3];
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2], scaleA = scale_n[3];
            switch (order) {
                case enums_1.Order.HWC:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(h * width + w) * 4 + 0] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                            array[(h * width + w) * 4 + 1] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(h * width + w) * 4 + 2] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                            array[(h * width + w) * 4 + 3] = (data[(h * width + w) * 4 + 3] - biasA) / scaleA;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (var h = 0; h < height; h++) {
                        for (var w = 0; w < width; w++) {
                            array[(0 * height + h) * width + w] = (data[(h * width + w) * 4 + 2] - biasB) / scaleB;
                            array[(1 * height + h) * width + w] = (data[(h * width + w) * 4 + 1] - biasG) / scaleG;
                            array[(2 * height + h) * width + w] = (data[(h * width + w) * 4 + 0] - biasR) / scaleR;
                            array[(3 * height + h) * width + w] = (data[(h * width + w) * 4 + 3] - biasA) / scaleA;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.GREY:
            array = new type(width * height);
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2];
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2];
            for (var h = 0; h < height; h++) {
                for (var w = 0; w < width; w++) {
                    var r = data[(h * width + w) * 4 + 0];
                    var g = data[(h * width + w) * 4 + 1];
                    var b = data[(h * width + w) * 4 + 2];
                    array[h * width + w] = 0.2126 * (r - biasR) / scaleR + 0.7162 * (g - biasG) / scaleG + 0.0722 * (b - biasB) / scaleB;
                }
            }
            break;
        default:
            throw Error("Unknown color format: " + color);
    }
    return array;
}
exports.getImageArrayFromImageData = getImageArrayFromImageData;
/**
 * Get image array from canvas element as `{Float32 or Int32}ArrayBufferView`.
 *
 * @returns {ImageData} buffer with specified type
 * @protected
 */
function getImageArrayFromCanvas(canvas, options) {
    if (options === void 0) { options = {}; }
    var _a = options.type, type = _a === void 0 ? Float32Array : _a, _b = options.color, color = _b === void 0 ? enums_1.Color.RGB : _b, _c = options.order, order = _c === void 0 ? enums_1.Order.HWC : _c, _d = options.srcX, srcX = _d === void 0 ? 0 : _d, _e = options.srcY, srcY = _e === void 0 ? 0 : _e, _f = options.srcW, srcW = _f === void 0 ? canvas.width : _f, _g = options.srcH, srcH = _g === void 0 ? canvas.height : _g, _h = options.dstX, dstX = _h === void 0 ? 0 : _h, _j = options.dstY, dstY = _j === void 0 ? 0 : _j, _k = options.bias, bias = _k === void 0 ? [0, 0, 0] : _k, _l = options.scale, scale = _l === void 0 ? [1, 1, 1] : _l;
    var _m = options.dstW, dstW = _m === void 0 ? srcW : _m, _o = options.dstH, dstH = _o === void 0 ? srcH : _o;
    var imageData = image_data_1.getImageData(canvas, { srcX: srcX, srcY: srcY, srcW: srcW, srcH: srcH, dstX: dstX, dstY: dstY, dstW: dstW, dstH: dstH });
    return getImageArrayFromImageData(imageData, { type: type, color: color, order: order, bias: bias, scale: scale });
}
exports.getImageArrayFromCanvas = getImageArrayFromCanvas;
/**
 * Get image array from image element as `{Float32 or Int32}ArrayBufferView`.
 *
 * @returns {ImageData} buffer with specified type
 * @protected
 */
function getImageArrayFromDrawable(drawable, options) {
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
    else if (drawable instanceof HTMLCanvasElement) {
        return getImageArrayFromCanvas(drawable, options);
    }
    else if (drawable instanceof ImageData) {
        var canvas_2 = document.createElement('canvas');
        canvas_2.height = drawable.height;
        canvas_2.width = drawable.width;
        var context_1 = canvas_1.getContext2D(canvas_2);
        context_1.putImageData(drawable, 0, 0);
        return getImageArrayFromCanvas(canvas_2, options);
    }
    else
        throw TypeError('Failed to execute "getImageDataFromDrawable(drawable, options)": "drawable" must be an instanceof Drawable');
    var _a = options.type, type = _a === void 0 ? Float32Array : _a, _b = options.color, color = _b === void 0 ? enums_1.Color.RGB : _b, _c = options.order, order = _c === void 0 ? enums_1.Order.HWC : _c, _d = options.srcX, srcX = _d === void 0 ? 0 : _d, _e = options.srcY, srcY = _e === void 0 ? 0 : _e, _f = options.dstX, dstX = _f === void 0 ? 0 : _f, _g = options.dstY, dstY = _g === void 0 ? 0 : _g, _h = options.dstW, dstW = _h === void 0 ? srcW : _h, _j = options.dstH, dstH = _j === void 0 ? srcH : _j, _k = options.bias, bias = _k === void 0 ? [0, 0, 0] : _k, _l = options.scale, scale = _l === void 0 ? [1, 1, 1] : _l;
    var canvas = document.createElement('canvas');
    canvas.width = dstX + dstW;
    canvas.height = dstY + dstH;
    var context = canvas_1.getContext2D(canvas);
    context.drawImage(drawable, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
    return getImageArrayFromCanvas(canvas, { type: type, color: color, order: order, bias: bias, scale: scale });
}
exports.getImageArrayFromDrawable = getImageArrayFromDrawable;
/**
 * Create typed array by packing image data from image source with specified options.
 *
 * First, this method loads specified image resource. The behavior of this method depends on the `image` argument.
 *
 * - If `image` is an instance of `string`, it will be regarded as image url, and this method fetches that url.
 *
 * - If `image` is an instance of `HTMLInputElement`, it will be regarded as file input,
 *   and this method loads the selected image file.
 *
 * - Otherwise, `image` will be regarded as drawable object.
 *
 * Then, loaded images are packed into typed array based on `options` argument.
 *
 * - The image is cropped based on [[SourceRect|`{srcX, srcY, srcW, srcH}`]].
 *   As default, entire image is used.
 *
 * - The image is resized and translated into [[DestinationRect|`{dstX, dstY, dstW, dstH}`]].
 *   As default, no resize and translation is performed.
 *
 * - [[ImageArrayOption.type|`options.type`]] is the type of packed typed array. As default, Float32Array is used.
 *
 * - [[ImageArrayOption.type|`options.color`]] is the color format of packed typed array. As default, [[Color.RGB|`RGB`]] is used.
 *
 * - [[ImageArrayOption.type|`options.order`]] is the data order of packed typed array. As default, [[Order.HWC|`HWC`]] is used.
 *
 * - [[ImageArrayOption.bias|`options.bias`]] is the bias value.
 *   If specified, this method **subtracts** this value from original pixel value.
 *
 * - [[ImageArrayOption.scale|`options.scale`]] is the scale value. If specified, original pixel values are **divided** by this value.
 *   [[ImageArrayOption.scale|`options.scale`]] and [[ImageArrayOption.bias|`options.bias`]] is used for converting pixel value `x` and
 *   packed value `y` as follows:
 *
 *   - `y = (x - bias) / scale`
 *   - `x = y * scale + bias`
 *   - Note that color order is always RGB, not BGR.
 *
 * ### Examples
 *
 * - Load image of specified url
 *
 *   ```ts
 *   let image = await WebDNN.Image.load('./cat.png');
 *   ```
 *
 * - Load image selected in file input and resize it into 224 x 224
 *
 *   ```ts
 *   let input = document.querySelector('input[type=file]');
 *   let image = await WebDNN.Image.load(input, { dstW: 224, dstH: 224 });
 *   ```
 *
 * - Load image data from canvas, normalize it into range `[-1, 1)`. In this case, normalized value `y` can be
 *   calculated from pixel value `x` as follows: `y = (x - 128) / 128`.
 *
 *   ```ts
 *   let canvas = document.getElementsByTagName('canvas')[0];
 *   let image = await WebDNN.Image.load(canvas, { bias: [128, 128, 128], scale: [128, 128, 128] });
 *   ```
 *
 * @param image please see above descriptions
 * @param options please see above descriptions.
 * @returns Created typed array
 */
function getImageArray(image, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(typeof image === 'string')) return [3 /*break*/, 2];
                    _a = getImageArrayFromDrawable;
                    return [4 /*yield*/, image_source_1.loadImageByUrl(image)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_c.sent(), options])];
                case 2:
                    if (!(image instanceof HTMLInputElement)) return [3 /*break*/, 4];
                    _b = getImageArrayFromDrawable;
                    return [4 /*yield*/, image_source_1.loadImageFromFileInput(image)];
                case 3: return [2 /*return*/, _b.apply(void 0, [_c.sent(), options])];
                case 4:
                    if (image instanceof HTMLCanvasElement) {
                        return [2 /*return*/, getImageArrayFromCanvas(image, options)];
                    }
                    else if (image instanceof HTMLImageElement || image instanceof HTMLVideoElement || image instanceof ImageData) {
                        return [2 /*return*/, getImageArrayFromDrawable(image, options)];
                        // FIXME: This feature is not supported for all web browsers.
                        // } else if (image === null) {
                        //     return getImageArrayFromDrawable(await loadImageByDialog(), options);
                    }
                    else
                        throw TypeError('Failed to execute "getImageData(image, options)": "image" must be an instance of string,' +
                            ' HTMLInputElement, HTMLCanvasElement, HTMLImageElement, HTMLVideoElement, or ImageData object');
                    _c.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getImageArray = getImageArray;
function createImageData(array, width, height) {
    try {
        return new ImageData(array, width, height);
    }
    catch (e) {
        // FIXME: Removing this warning causes the following error. Maybe bug in webpack?
        // Uncaught (in promise) SyntaxError: Identifier 'n' has already been declared
        console.warn("new ImageData failed: " + e);
        // IE11 does not support ImageData constructor
        var canvas_ = document.createElement('canvas');
        var context = canvas_1.getContext2D(canvas_);
        var data = context.createImageData(width, height);
        data.data.set(array);
        return data;
    }
}
/**
 * Set image array data into canvas.
 *
 * ### Examples
 *
 * - Show DNN model's result
 *
 *   ```ts
 *   let runner = await WebDNN.load('./model');
 *   let output = runner.outputs[0];
 *
 *   await runner.run();
 *
 *   WebDNN.Image.setImageArrayToCanvas(output.toActual(), 256, 256, document.getElementById('canvas'))
 *   ```
 *
 * - Generally image generation model's result contains noise pixel at their edge because of convolution's padding.
 *   In follow example, these noise are cut off.
 *
 *   ```ts
 *   WebDNN.Image.setImageArrayToCanvas(output, 256, 256, canvas, {
 *      srcX: 16, srcY: 16, srcH: 256-16*2, srcW: 256-16*2, // Discard both ends 16px
 *      dstW: 256, dstH: 256  // Resize cropped image into original output size.
 *   });
 *   ```
 *
 * @param array array which contains image data
 * @param imageW width of image
 * @param imageH height of image. The length of `array` must be `imageW * imageH * (# of channels)`
 * @param canvas destination canvas
 * @param options please see above descriptions and descriptions in [[webdnn/image.getImageArray|getImageArray()]].
 *                `srcW` and `srcH` is ignored (overwritten by `imageW` and `imageH`).
 */
function setImageArrayToCanvas(array, imageW, imageH, canvas, options) {
    if (options === void 0) { options = {}; }
    var _a = options.color, color = _a === void 0 ? enums_1.Color.RGB : _a, _b = options.order, order = _b === void 0 ? enums_1.Order.HWC : _b, _c = options.srcX, srcX = _c === void 0 ? 0 : _c, _d = options.srcY, srcY = _d === void 0 ? 0 : _d, _e = options.dstX, dstX = _e === void 0 ? 0 : _e, _f = options.dstY, dstY = _f === void 0 ? 0 : _f, _g = options.dstW, dstW = _g === void 0 ? canvas.width : _g, _h = options.dstH, dstH = _h === void 0 ? canvas.height : _h, _j = options.bias, bias = _j === void 0 ? [0, 0, 0] : _j, _k = options.scale, scale = _k === void 0 ? [1, 1, 1] : _k;
    var bias_n = normalizeBiasTuple(bias);
    var scale_n = normalizeBiasTuple(scale);
    var srcW = imageW, srcH = imageH;
    array = flatten(array);
    var data = new Uint8ClampedArray(srcW * srcH * 4);
    var biasR, biasG, biasB, biasA;
    var scaleR, scaleG, scaleB, scaleA;
    switch (color) {
        case enums_1.Color.RGB:
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2];
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2];
            switch (order) {
                case enums_1.Order.HWC:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(h * imageW + w) * 3 + 0] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(h * imageW + w) * 3 + 1] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(h * imageW + w) * 3 + 2] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(0 * imageH + h) * imageW + w] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(1 * imageH + h) * imageW + w] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(2 * imageH + h) * imageW + w] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.BGR:
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2];
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2];
            switch (order) {
                case enums_1.Order.HWC:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(h * imageW + w) * 3 + 2] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(h * imageW + w) * 3 + 1] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(h * imageW + w) * 3 + 0] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(2 * imageH + h) * imageW + w] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(1 * imageH + h) * imageW + w] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(0 * imageH + h) * imageW + w] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = 255;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.RGBA:
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2], biasA = bias_n[3];
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2], scaleA = scale_n[3];
            switch (order) {
                case enums_1.Order.HWC:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(h * imageW + w) * 3 + 0] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(h * imageW + w) * 3 + 1] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(h * imageW + w) * 3 + 2] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = array[(h * imageW + w) * 3 + 3] * scaleA + biasA;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(0 * imageH + h) * imageW + w] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(1 * imageH + h) * imageW + w] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(2 * imageH + h) * imageW + w] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = array[(3 * imageH + h) * imageW + w] * scaleA + biasA;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.BGRA:
            biasR = bias_n[0], biasG = bias_n[1], biasB = bias_n[2], biasA = bias_n[3];
            scaleR = scale_n[0], scaleG = scale_n[1], scaleB = scale_n[2], scaleA = scale_n[3];
            switch (order) {
                case enums_1.Order.HWC:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(h * imageW + w) * 4 + 2] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(h * imageW + w) * 4 + 1] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(h * imageW + w) * 4 + 0] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = array[(h * imageW + w) * 4 + 3] * scaleA + biasA;
                        }
                    }
                    break;
                case enums_1.Order.CHW:
                    for (var h = srcY; h < srcY + srcH; h++) {
                        for (var w = srcX; w < srcX + srcW; w++) {
                            data[(h * imageW + w) * 4 + 0] = array[(2 * imageH + h) * imageW + w] * scaleR + biasR;
                            data[(h * imageW + w) * 4 + 1] = array[(1 * imageH + h) * imageW + w] * scaleG + biasG;
                            data[(h * imageW + w) * 4 + 2] = array[(0 * imageH + h) * imageW + w] * scaleB + biasB;
                            data[(h * imageW + w) * 4 + 3] = array[(3 * imageH + h) * imageW + w] * scaleA + biasA;
                        }
                    }
                    break;
            }
            break;
        case enums_1.Color.GREY:
            for (var h = srcY; h < srcY + srcH; h++) {
                for (var w = srcX; w < srcX + srcW; w++) {
                    data[(h * imageW + w) * 4 + 0] =
                        data[(h * imageW + w) * 4 + 1] =
                            data[(h * imageW + w) * 4 + 2] = array[h * imageW + w] * scale[0] + bias[0];
                    data[(h * imageW + w) * 4 + 3] = 255;
                }
            }
            break;
    }
    image_data_1.setImageDataToCanvas(createImageData(data, srcW, srcH), canvas, { srcX: srcX, srcY: srcY, srcW: srcW, srcH: srcH, dstX: dstX, dstY: dstY, dstW: dstW, dstH: dstH });
}
exports.setImageArrayToCanvas = setImageArrayToCanvas;
