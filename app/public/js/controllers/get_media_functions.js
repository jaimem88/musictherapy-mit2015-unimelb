/**************************************************************************************************/
	/****Setting the  the video and audio constraints and getting user media accordingly****/
/**************************************************************************************************/

//Declaring the audio and video constraints

		var constraints  = {
			video: {
				mandatory: {
					maxWidth: 320,
					maxHeight: 240
				}
			},audio:true
		};
//Getting the user media from the sources

		function getMedia(done)
		{
			getUserMedia(	constraints, handleUserMedia, handleUserMediaError);
			console.log('Getting user media with constraints', constraints);
			done();
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
