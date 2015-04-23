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
		var vgaConstraints  = {
		  video: {
			mandatory: {
			  maxWidth: 640,
			  maxHeight: 360
			}
		  },audio:true
		};

		var hdConstraints  = {
		  video: {
			mandatory: {
			  minWidth: 1280,
			  minHeight: 720
			}
		  },audio:true
		};
		
		var audioConstraints  = {
			video: false,audio:true
		};
		
//Getting the user media from the sources 

		function getMedia(constraints)
		{
			console.log(constraints);
			getUserMedia(constraints, handleUserMedia, handleUserMediaError);
			console.log('Getting user media with constraints', constraints);
		}
		
//Calling the getMedia function with the user selected constraints
		
		function selectionMade(){	
			
			//Extract the quality selected by the user
			
			var quality = document.getElementById('quality');
			var qualitySelected = quality.options[quality.selectedIndex].value;
			console.log('qulaity selected:' + qualitySelected);
			
			if(qualitySelected==='qvga')
			{
				getMedia(qvgaConstraints);
			}
			else 
				if(qualitySelected==='vga')
				{
					getMedia(vgaConstraints);
				}
				else
					if(qualitySelected==='hd')
					{
						getMedia(hdConstraints);
					}
					else
						getMedia(audioConstraints );
					
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
				
//Displaying error message in case of getUserMedia failure
		
		function handleUserMediaError(error){
			console.log('getUserMedia error: ', error);
		}
