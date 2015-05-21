var fs = require("fs");
var sys = require("sys");
var exec = require('child_process').execSync;
var async = require('async')
//var filesPath = './app/public/uploads/';
var procs = './app/public/uploads/procs/';
var mixed = './app/public/uploads/mixed/';
var individual ='./app/public/uploads/individual/',
  clips = [],
  stream,
  currentfile;
  x = " ";
module.exports = {
  printFiles: function(fileName){
  x = " ";
  async.waterfall([
    function(callback){
      files = fs.readdirSync(individual);
      console.log("Files: "+files);
      for (var i = 0;i<files.length;i++){
        //x+=filesPath+file+" ";
        console.log("Here "+files[i]);
        var origin = files[i].substring(files[i].indexOf('_')+1,files[i].indexOf('.wav'));
        exec("sox "+individual+files[i]+" "+procs+origin+"_proc.wav compand 0.3,1 -90,-90,-70,-70,-60,-20,0,0 -5 0 0.2 trim 0.100", puts);
        //preProcessFile(files[i]);
      }
      callback(null,fileName);
    },function preproc(fileName,callback){
     var files2 = fs.readdirSync(procs);
     console.log("Files2: "+files2);
     for (var i = 0;i<files2.length;i++){
       console.log(i);
       x+=procs+files2[i]+" ";
     }
     console.log("XXXXXX: "+x);
     //done(x,fileName);
     callback(null,x,fileName);

   },function mix(audioFiles,outFileName,callback){
     console.log("sox -m"+x+mixed+outFileName+"mixed.wav");
     //MIX all files
     exec("sox -m"+x+mixed+outFileName+"mixed.wav", puts);
     //Compress to MP3
     //sox -t wav -r 8000 -c 1 <wavfilename> -t mp3 <mp3filename>
     console.log("sox -t wav -r 88200 -c 1 "+mixed+outFileName+"mixed.wav"+" -t mp3 "+mixed+outFileName+"compMixed.mp3");
     exec("sox -t wav -r 88200 -c 1 "+mixed+outFileName+"mixed.wav"+" -t mp3 "+mixed+outFileName+"compMixed.mp3",puts);
     callback(null,"done mixing");
   }],function(error, c) {
      console.log(c);
    });
    //preproc(fileName,function(){
    //  console.log("Done with preproc")
    //}),
  //  mix(x,fileName,function(){
  //    console.log("Done mixing records");
  //  })


  //])
    //save files into db
  }

};
/*
//var i =0;
 function preproc(fileName,done){
  var files2 = fs.readdirSync(procs);
  console.log("Files2: "+files2);
  for (var i = 0;i<files2.length;i++){
    console.log(i);
    x+=procs+files2[i]+" ";
  }
  console.log("XXXXXX: "+x);
  //done(x,fileName);
  done(null,fileName);
  //x = " ";
}
function preProcessFile(inFile){
  var origin = inFile.substring(inFile.indexOf('_')+1,inFile.indexOf('.wav'));

  //Trim and set volume
  //sox 1431511420333_John\ .wav john_trimmed.wav trim 0.100 vol 0.7
  //Adjust gain and volume and trim
  //sox f1.wav out.wav compand 0.3,1 -90,-90,-70,-70,-60,-20,0,0 -5 0 0.2 trim 0.100
  //save into uploads/procs/ folder
  exec("sox "+individual+inFile+" "+procs+origin+"_proc.wav compand 0.3,1 -90,-90,-70,-70,-60,-20,0,0 -5 0 0.2 trim 0.100", puts);
  //fs.unlinkSync(individual+inFile);
}
function mix(audioFiles,outFileName,done){
  console.log("sox -m"+x+mixed+outFileName+"mixed.wav");
  //MIX all files
  exec("sox -m"+x+mixed+outFileName+"mixed.wav", puts);
  //Compress to MP3
  //sox -t wav -r 8000 -c 1 <wavfilename> -t mp3 <mp3filename>
  console.log("sox -t wav -r 88200 -c 1 "+mixed+outFileName+"mixed.wav"+" -t mp3 "+mixed+outFileName+"compMixed.mp3");
  exec("sox -t wav -r 88200 -c 1 "+mixed+outFileName+"mixed.wav"+" -t mp3 "+mixed+outFileName+"compMixed.mp3",puts);
  done();
}*/
function puts(error, stdout, stderr) { console.log(stdout) };
