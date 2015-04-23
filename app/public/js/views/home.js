//console.log(window.location.host);
//

var $startCallButton = document.getElementById('startCallModeButton');
var $stopCallButton = document.getElementById('stopCallModeButton');
var $videoWindow = document.getElementById('localVideo');
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
	socket = io.connect("http://" + window.location.host);
	 	$.getScript("js/controllers/get_media_functions.js");
		$.getScript("js/controllers/remote_media_functions.js");
		$.getScript("js/controllers/webRTC_API_functions.js");
		$.getScript("js/controllers/on_event_functions.js");
		socket.emit('new user',username);
		$startCallButton.style.display = 'none';
		$stopCallButton.style.display = "block";
		$videoWindow.style.display = "block";
		displayContent();
}

function stopCallMode(){
	$startCallButton.style.display = 'block';
	$stopCallButton.style.display = "none";
	$videoWindow.style.display = "none";
	stopVideo();
	stopDisplayContent();
	window.location.reload();
}

//Display initial home

function displayContent(){
	console.log("displaying media page");
	document.getElementById("mediaPage").style.display = "block";
}
function stopDisplayContent(){
	console.log("hiding media page");
	document.getElementById("mediaPage").style.display = "none";
	socket.emit('message','goodbye');
}
