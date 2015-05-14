var fs = require("fs");
var sys = require("sys");
var exec = require('child_process').exec;
var filesPath = './app/public/uploads/',
  clips = [],
  stream,
  currentfile;
  x = " ";
module.exports = {
  printFiles: function(){
    files = fs.readdirSync(filesPath);

    files.forEach(function(file){
      x+=filesPath+file+" ";
      //console.log(x);
      //clips.push(file);
    });

  mix(x);
  x = " ";
  }
};
//var i =0;
function puts(error, stdout, stderr) { sys.puts(stdout) };
function mix(audioFiles){

  console.log("sox -m"+x+filesPath+"mixed_1.wav");
  //MIX all files
  exec("sox -m"+x+filesPath+"mixed_1.wav", puts);
  //Compress to MP3
  //sox -t wav -r 88200 -c 1 mixed.wav -t mp3 compMixed.mp3


}
