import { createCanvas } from "https://deno.land/x/canvas/mod.ts";

// var canvas = document.createElement("canvas");
var canvas = createCanvas(100,100);

var texttodraw = "adsf"
var ctx = canvas.getContext("2d");

ctx.font = '20px Verdana';
// canvas.width = ctx.measureText(texttodraw).width;
// canvas.height = 20;

ctx.font = '20px Verdana';
ctx.textBaseline="top"; 
ctx.fillText(texttodraw, 50,50);

var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// check if image data array contains values other than 0
var data = imageData.data.filter(function(e) {
	return e !== 0;
});
console.log(data);

