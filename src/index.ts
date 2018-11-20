// export * from "./image/canvas" // internal API
export * from './image/enums';
export * from './image/image_array';
export * from './image/image_source';
// export * from "./image/image_data" // internal API

import { loadImageByDialog } from './image/image_source';
import { getImageArrayFromDrawable, setImageArrayToCanvas } from './image/image_array';
async function upload() {
  let canvas: HTMLCanvasElement = document.createElement('CANVAS') as HTMLCanvasElement;
  let image = await loadImageByDialog();
  let data = getImageArrayFromDrawable(image);
  setImageArrayToCanvas(data, image.naturalWidth, image.naturalHeight, canvas);
  return canvas;
}

const pica = require('pica')();
async function resize(from, to) {
  await pica.resize(from, to);
  return to;
}

function rgb2gray(array) {
  let num = array.length / 3;
  let newArray = new Float32Array(num);
  for (let i = 0; i < num; i++) {
    let i3 = 3 * i;
    newArray[i] = (array[i3] + array[i3 + 1] + array[i3 + 2]) / 3 / 255;
  }
  return newArray;
}

function gray2rgb(array) {
  let num = array.length * 3;
  let newArray = new Float32Array(num);
  for (let i = 0; i < array.length; i++) {
    let i3 = 3 * i;
    newArray[i3] = array[i] * 255;
    newArray[i3 + 1] = array[i] * 255;
    newArray[i3 + 2] = array[i] * 255;
  }
  return newArray;
}

function splitImageArray(array, n = 2) {
  let newArrays: any = [];

  for (var j = 0; j < n; j++) {
    newArrays.push(new Float32Array(array.length));
  }

  for (var i = 0; i < array.length; i++) {
    var element = array[i];
    var amp = element / n;
    var total = 0;
    for (var j = 0; j < n - 1; j++) {
      let v = Math.floor(Math.random() * 255) - 128;
      newArrays[j][i] = v;
      total += v;
    }
    newArrays[n - 1][i] = element - total;
  }
  return newArrays;
}

function joinImageArray(arrays) {
  let n = arrays.length;
  let imageArray: any = new Float32Array(arrays[0].length);
  for (var i = 0; i < arrays[0].length; i++) {
    for (var j = 0; j < n; j++) {
      imageArray[i] += arrays[j][i];
    }
  }
  return imageArray;
}

export { upload, resize, rgb2gray, gray2rgb, splitImageArray, joinImageArray };
