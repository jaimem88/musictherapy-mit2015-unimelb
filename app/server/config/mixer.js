var fs = require("fs");
var filesPath = './app/public/uploads/',
  clips = [],
  stream,
  currentfile;

module.exports = {
  printFiles: function(){
    files = fs.readdirSync(filesPath);
    files.forEach(function(file){
      console.log("File: "+file);
      clips.push(file);
    });
    dhh=fs.createWriteStream(filesPath+'mixed.wav');
  mix();
  }
};
var i =0;
function mix(){

    console.log(i + ' '+clips);
    if (!clips.length) {

        dhh.end("Done");
        return;
    }
    currentfile = filesPath+ clips.shift();
    stream = fs.createReadStream(currentfile);
    stream.pipe(dhh, {end: false});
    stream.on("end", function() {
        console.log(currentfile + ' appended');
        console.log(i + ' '+currentfile);
      //  fs.unlink(currentfile);
        mix();
    });
    i+=1;
}
