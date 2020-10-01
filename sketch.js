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
let button;

function preload(){
  bodypix = ml5.bodyPix({
    architecture: 'MobileNetV1',
    outputStride: 16,
    quantBytes: 4
  },ready);
}
function ready(){
  console.log("Model is ready!!!");
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
  input_bg = createFileInput(handlebg);
  input_bg.parent('upbg')
  input_person = createFileInput(handleFile);
  input_person.parent('upselfie')
  button = createButton('Download your Picture');
  button.style('height','60px');
  button.mousePressed(download_img);
  button.class('btn btn-primary');
  button.parent('download')
  bg_can = createCanvas(windowWidth*0.8,480)
  // .style('padding','20px 20px 20px 40px');
  bg_can.parent('mycanvas')
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
      if (width>height) {
        image(bg, 0, 0, width, bg.height*width/bg.width);
      }else{
        image(bg, 0, 0, bg.width*height/bg.height,height);
      }
    }else{
      background(0);
    }
    // segmentation.backgroundMask.resize(segmentation.backgroundMask.height*scale,0);
    image(segmentation.backgroundMask,posx , posy, segmentation.backgroundMask.width*height/segmentation.backgroundMask.height,height)
  }else{
    if (bg) {
      if (width>height) {
        image(bg, 0, 0, width, bg.height*width/bg.width);
      }else{
        image(bg, 0, 0, bg.width*height/bg.height,height);
      }

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
