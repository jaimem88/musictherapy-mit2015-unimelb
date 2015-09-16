function init(){
  // socket = io.connect("https://" + window.location.host);
/*    $.getScript("js/views/recordAudio.js");
    $.getScript("js/views/player.js");
    $.getScript("js/controllers/remote_media_functions.js");
    $.getScript("js/controllers/webRTC_API_functions.js");
    $.getScript("js/controllers/on_event_functions.js");*/

    socket = io('/vr_connections');
    if(admin==='true'){
      username = username +" - Clinician";
    }

  //  displayContent();
    //getMedia();
    socket.on("connect",function (){
      console.log('new connection to server!');
      socket.emit('vr_new_user',username);
    });

    socket.on('vr_joined', function (clients){
    //	$callee.style.display = 'none';
    	if (admin=== 'true') {
    	//	$endConference.style.display = 'block';
        console.log("I'm admin");
    	}
    	console.log('Joined room with clients: ', clients);
    	});

}
init();

function sendMessage(message){
		console.log('Client sending message: ', message);
		socket.emit('vr_message', message);
}
