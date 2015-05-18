var fs = require("fs");
var sys = require("sys");
var exec = require('child_process').exec;
var filesPath = './app/public/uploads/',
  clips = [],
  stream,
  currentfile;
  x = " ";
module.exports = {
  printFiles: function(fileName){
    files = fs.readdirSync(filesPath);
    //console.log(fileName)
    files.forEach(function(file){
      //x+=filesPath+file+" ";
      console.log("Here "+file);
      preProcessFile(file);
    //  fs.unlink(filesPath+file);
      //clips.push(file);
    });
    files = fs.readdirSync(filesPath);
    files.forEach(function(file){
      x+=filesPath+file+" ";
    });
    console.log("XXXXXX: "+x);
    //mix(x,fileName);
    x = " ";
    //save files into db
  }
};
//var i =0;
function preProcessFile(inFile){
  var origin = inFile.substring(inFile.indexOf('_')+1,inFile.indexOf('.wav'));
  console.log(origin);
  //Trim and set volume
  //sox 1431511420333_John\ .wav john_trimmed.wav trim 0.100 vol 0.7
  //Adjust gain and volume and trim
  //sox f1.wav out.wav compand 0.3,1 -90,-90,-70,-70,-60,-20,0,0 -5 0 0.2 trim 0.100
  exec("sox "+filesPath+inFile+" "+filesPath+origin+"_post.wav compand 0.3,1 -90,-90,-70,-70,-60,-20,0,0 -5 0 0.2 trim 0.100", puts);
  //fs.unlinkSync(filesPath+inFile);
}
function puts(error, stdout, stderr) { console.log(stdout) };
function mix(audioFiles,output){
  console.log("sox -m"+x+filesPath+output+"mixed.wav");
  //MIX all files
  exec("sox -m"+x+filesPath+output+"mixed.wav", puts);
  //Compress to MP3
  //sox -t wav -r 88200 -c 1 mixed.wav -t mp3 compMixed.mp3


}
