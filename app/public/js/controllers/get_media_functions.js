/**************************************************************************************************/
	/****Setting the  the video and audio constraints and getting user media accordingly****/
/**************************************************************************************************/

//Declaring the audio and video constraints

		var qvgaConstraints  = {
			video: {
				mandatory: {
					maxWidth: 320,
					maxHeight: 180
				}
			},audio:true
		};
		var audioConstraints  = {
			video: false,audio:true
		};

//Getting the user media from the sources

		function getMedia()
		{
			console.log(qvgaConstraints);
			getUserMedia(	qvgaConstraints, handleUserMedia, handleUserMediaError);
			console.log('Getting user media with constraints', qvgaConstraints);
		}
//Returning true if video element is present in the media stream

		function hasVideo(stream){
			if(stream.getVideoTracks().length)
				return true;
			else
				return false;
		}

//Displaying the local user's video/audio onto the screen

		function handleUserMedia(stream) {
			console.log('Adding local stream.');
			// checking video presence
			localStream = stream;
			if(hasVideo(localStream)){
				console.log(" video present");
				$localVideo.src = window.URL.createObjectURL(localStream);
				$localAudio.src="";
				$localAudio.style.display =" none";
			}
			else{
				$localVideo.src ="";
				console.log("no video present");
				$localAudio.src = window.URL.createObjectURL(localStream);
				$localAudio.style.display = "block";
			}

		}
		function stopVideo(){
			console.log("in stopVideo()");
			$localVideo.src ="";
			localStream.stop();
			console.log("Stopping stream");
		}
		function recordAudio(){

		}

//Displaying error message in case of getUserMedia failure

		function handleUserMediaError(error){
			console.log('getUserMedia error: ', error);
		}

		function getLocalStream(){
			return localStream;
		}
