"use strict";
/**
 * @module webdnn/image
 */
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
/** Don't Remove This comment block */
/**
 * Load image of specified url
 *
 * @param {string} url the image url
 * @returns {Promise<HTMLImageElement>} image element
 */
function loadImageByUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var image;
        return __generator(this, function (_a) {
            image = document.createElement('img');
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    image.onload = resolve;
                    image.onerror = reject;
                    image.src = url;
                })
                    .then(function () { return image; })];
        });
    });
}
exports.loadImageByUrl = loadImageByUrl;
/* istanbul ignore next */
/**
 * Load image file selected in `<input type="file">` element.
 *
 * @param {HTMLInputElement} input the `<input type="file">` element
 * @returns {Promise<HTMLImageElement>} image element
 */
function loadImageFromFileInput(input) {
    return __awaiter(this, void 0, void 0, function () {
        var files, url;
        return __generator(this, function (_a) {
            files = input.files;
            if (!files || files.length == 0)
                throw new Error('No file is selected');
            url = URL.createObjectURL(files[0]);
            return [2 /*return*/, loadImageByUrl(url)];
        });
    });
}
exports.loadImageFromFileInput = loadImageFromFileInput;
/* istanbul ignore next */
/**
 * Load image selected in file picker dialog
 *
 * Currently, web specification not supported the case if the dialog is canceled and no file is selected. In this case,
 * the returned promise will never be resolved.
 *
 * @returns {Promise<HTMLImageElement>} image element
 * @protected
 */
function loadImageByDialog() {
    return __awaiter(this, void 0, void 0, function () {
        var input;
        return __generator(this, function (_a) {
            input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            return [2 /*return*/, new Promise(function (resolve) {
                    input.onchange = function () { return resolve(loadImageFromFileInput(input)); };
                    input.click();
                })];
        });
    });
}
exports.loadImageByDialog = loadImageByDialog;
