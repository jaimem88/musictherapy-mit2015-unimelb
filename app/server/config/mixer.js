var fs = require("fs");
var sys = require("sys");
var exec = require('child_process').exec;
//var filesPath = './app/public/uploads/';
var procs = './app/public/uploads/procs/';
var mixed = './app/public/uploads/mixed/';
var individual ='./app/public/uploads/individual/',
  clips = [],
  stream,
  currentfile;
  x = " ";
module.exports = {
  printFiles: function(fileName,done){
    files = fs.readdirSync(individual);
    console.log("Files: "+files);
    for (var i = 0;i<files.length;i++){
      //x+=filesPath+file+" ";
      console.log("Here "+files[i]);
      preProcessFile(files[i]);
    }
    done(function(){
      preproc(fileName);
    });

    //save files into db
  }

};

//var i =0;
 function preproc(fileName){
  var files2 = fs.readdirSync(procs);
  console.log("Files2: "+files2);
  for (var i = 0;i<files2.length;i++){
    x+=procs+files2[i]+" ";
  }
  console.log("XXXXXX: "+x);
  //done(x,fileName);
  if(x!=" "){
    mix(x,fileName);
  }

  x = " ";
}
function preProcessFile(inFile){
  var origin = inFile.substring(inFile.indexOf('_')+1,inFile.indexOf('.wav'));
  //console.log(origin);
  //Trim and set volume
  //sox 1431511420333_John\ .wav john_trimmed.wav trim 0.100 vol 0.7
  //Adjust gain and volume and trim
  //sox f1.wav out.wav compand 0.3,1 -90,-90,-70,-70,-60,-20,0,0 -5 0 0.2 trim 0.100
  //save into uploads/procs/ folder
  exec("sox "+individual+inFile+" "+procs+origin+"_proc.wav compand 0.3,1 -90,-90,-70,-70,-60,-20,0,0 -5 0 0.2 trim 0.100", puts);
  //fs.unlinkSync(individual+inFile);
}
function mix(audioFiles,outFileName){
  console.log("sox -m"+x+mixed+outFileName+"mixed.wav");
  //MIX all files
  exec("sox -m"+x+mixed+outFileName+"mixed.wav", puts);
  //Compress to MP3
  //sox -t wav -r 8000 -c 1 <wavfilename> -t mp3 <mp3filename>
  console.log("sox -t wav -r 88200 -c 1 "+mixed+outFileName+"mixed.wav"+" -t mp3 "+mixed+output+"compMixed.mp3");
  exec("sox -t wav -r 88200 -c 1 "+mixed+outFileName+"mixed.wav"+" -t mp3 "+mixed+output+"compMixed.mp3",puts);
}
function puts(error, stdout, stderr) { console.log(stdout) };
