//console.log(window.location.host);
//

var $startCallButton = document.getElementById('startCallModeButton');
var $stopCallButton = document.getElementById('stopCallModeButton');
var $videoWindow = document.getElementById('localVideo');
var $startRecording = document.getElementById('recordAudio');
var $stopRecordingAudio = document.getElementById('stop-recording-audio');
var callMode = false;
var script = document.createElement('script');
	script.src = 'http://somesite.com/somescript.js';
	script.type = 'text/javascript';
/*
	script(src='/js/controllers/get_media_functions.js')
			script(src='/js/controllers/remote_media_functions.js')
			script(src='/js/controllers/webRTC_API_functions.js')
			script(src='/js/controllers/on_event_functions.js')*/
console.log("This is home.js");
/*******LOGIN LISTEN TO SERVER****************/

console.log(window.location.host);

//Start call mode
function startCallMode(){
	console.log(username);
	console.log("loading script");
	socket = io.connect("https://" + window.location.host);
	 	$.getScript("js/views/recordAudio.js");
		$.getScript("js/controllers/remote_media_functions.js");
		$.getScript("js/controllers/webRTC_API_functions.js");
		$.getScript("js/controllers/on_event_functions.js");
		socket.emit('new user',username);
		displayContent();
		getMedia();
		callMode = true;
}

function stopCallMode(){
	callMode= false;
	endConference();
	stopVideo();
	//stopDisplayContent();
	window.location.reload(true);
}

//Display initial home

function displayContent(){
	console.log("displaying media page");
	document.getElementById("mediaPage").style.display = "block";
	document.getElementById("mediaPage2").style.display = "block";
	console.log(" admin? "+admin)
/*	if (admin=== 'true') {
		$startRecording.style.display = 'block';
		$stopRecordingAudio.style.display = 'block'
	}
	*/
	$startCallButton.style.display = 'none';
	$stopCallButton.style.display = "block";
	$videoWindow.style.display = "block";
}


//cloning video?
var $template = $(".template");
$(".btn-add-panel").on("click", function () {
    var $newPanel = $template.clone();
    $newPanel.find(".panel-title").text("new text "+username);
		$newPanel.find(".panel-body").text("new body text");
    //$newPanel.find(".accordion-toggle").attr("href",  "#" + (++hash))
    //         .text("Dynamic panel #" + hash);
    //$newPanel.find(".panel-collapse").attr("id", hash).addClass("collapse").removeClass("in");
    $("#media").append($newPanel.fadeIn());
});
