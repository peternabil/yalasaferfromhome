let input_bg;
let input_person;
let img;
let bodypix;
let lion;
let bg_can;
let segmentation;
let bg;
let posx,posy;
let scale;
let slider;

function preload(){
  bodypix = ml5.bodyPix({
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2
  },ready);
}
function ready(){
  console.log("MobileNetV1 Model is ready!!!");
}
function bgadded(){
  console.log("bg added");
  image(lion,0,0,width,height);
}
function setup() {
  posx=-40 ;
  posy=10;
  scale = 1;
  // createElement("h1", "Resize your Selfie")
  // slider = createSlider(0, 255, 100);
  // slider.position(10, 10);
  // slider.style('width', '100px');
  createElement("h1", "Choose a background")
  input_bg = createFileInput(handlebg);
  createElement("h1", "Select your selfie")
  input_person = createFileInput(handleFile);
  createElement("h1", "Download your Picture")
  button = createButton('Download your Picture');
  button.style('height','30px');
  button.mousePressed(download_img);
  bg_can = createCanvas(640,480);
  background(0);
}

function download_img(){
  saveCanvas(bg_can, 'mytrip', 'jpg');
}

function resulted(error,data){
  if (error) {
    console.log(error);
  }else {
    bg_can.text('Your Pic is ready press and drag to show and position it',0,0);
    console.log("done!!")
    console.log(data);
    segmentation = data;
  }
}
function mouseDragged(){
  if (
    mouseX > 0 &&
    mouseX < width &&
    mouseY > 0 &&
    mouseY < height
  ){
    posx = mouseX-150;
    posy = mouseY-150;
  }

}
function touchMoved(){
  if (
    mouseX > 0 &&
    mouseX < width &&
    mouseY > 0 &&
    mouseY < height
  ){
    posx = mouseX-150;
    posy = mouseY-150;
  }
  return false;
}
function draw(){
  // scale = Math.round(slider.value()/255);
  // console.log(Math.round(slider.value()*100/255));
  if(segmentation){
    if (bg) {
      image(bg, 0, 0, width, height);
    }else{
      background(0);
    }
    // segmentation.backgroundMask.resize(segmentation.backgroundMask.height*scale,0);
    image(segmentation.backgroundMask,posx , posy, segmentation.backgroundMask.width*height/segmentation.backgroundMask.height,height)
  }else{
    if (bg) {
      image(bg, 0, 0, width, height);
    }else{
      background(0);
    }
  }
}

function handlebg(file) {
  print(file);
  if (file.type === 'image') {
    bg = createImg(file.data, '');
    bg.hide();
    // image(bg, 0, 0, width, height);
    console.log("background added");
  } else {
    bg = null;
  }
}
function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide();
    // image(img, 0, 0, width, height);
    bodypix.segment(img,{
    flipHorizontal: false,
    internalResolution: 'high',
    segmentationThreshold: 0.5
  },resulted);

  } else {
    img = null;
  }
}
