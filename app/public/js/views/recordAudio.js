

var recordAudio, recordVideo;
var userCount = 0;
$startRecording.onclick = function() {

	console.log('click on start recording '+username)
	$endConference.disabled =true;
	$startRecording.disabled = true
	$stopRecordingAudio.disabled = false;
	$mixRecordings.disabled = true;
	socket.emit('start recording');
	$startRecording.style.display='none';
	$stopRecordingAudio.style.display='block';
	$broadcastMode.disabled = true;
};


$stopRecordingAudio.onclick = function() {

	$startRecording.disabled = false;
	$startRecording.style.display='none';
	$stopRecordingAudio.disabled = true;
	$endConference.disabled =false;
	socket.emit('stop recording');
	$stopRecordingAudio.style.display='none';
	$broadcastMode.disabled = false;

};
$mixRecordings.onclick = function() {
	$startRecording.disabled = false;
	$mixRecordings.style.display='none';
	$startRecording.style.display='block';
	$stopRecordingAudio.disabled = true;
	$mixRecordings.disabled = true;
	var d = new Date()
  var fileName = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+"_"+"SessionX"+"_RecordingY";
  var mixedFileName = prompt("File name: ", fileName);
	socket.emit('mix recordings',mixedFileName);
};

//when start recording is received, then record local stream
socket.on('start recording',function (){
	$CurrentMode.innerHTML = "Recording mode";
	console.log("recording local audio")
	toggleRemoteAudio();
	mediaStream = stream = getLocalStream();
	recordAudio = RecordRTC(stream);
	recordAudio.startRecording();
});

socket.on('stop recording',function (){
	$CurrentMode.innerHTML = "Call mode";
	console.log("stop recording local audio")
	toggleRemoteAudio();
	recordAudio.stopRecording(function() {
		// get audio data-URL
		myCount = $("#media > div").length
		console.log("TESTE::::" +myCount)
		recordAudio.getDataURL(function(audioDataURL) {
			var file = {
				audio: {
					type: recordAudio.getBlob().type || 'audio/wav',
					dataURL: audioDataURL,
					user : username,
					email : email,
					count: myCount
				}
			};

			socket.emit('myrecording',file )
		});
	});
});
socket.on('ready to mix',function(){
	userCount = 0;
	$mixRecordings.disabled = false;
	$mixRecordings.style.display='block';
});
