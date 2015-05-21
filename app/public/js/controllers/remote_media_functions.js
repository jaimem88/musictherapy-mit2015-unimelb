/*************************************************************************************/
		/****Creating a separate HTML Division for displaying remote media****/
/*************************************************************************************/

//Creating a HTML division

function createHTMLDivision(divElement,connectToUser){

	divElement.id = connectToUser;
	divElement.className = 'col.sm-3'
	//divElement.className = 'remoteVideoContainer';
	console.log('div element id in html division:'+divElement.id);
}

//Creating a HTML video element and appending it to the division

function createVideoElement(divElement,stream){
	console.log('creating a video element to display peer video');
	console.log('div element id :'+divElement.id);
	var remoteVideo = document.createElement('video');
	remoteVideo.width = 320;
	remoteVideo.height = 240;
	remoteVideo.autoplay = true;
	remoteVideo.src = window.URL.createObjectURL(stream);
	//remoteStream = stream;
	divElement.appendChild(remoteVideo);
}

//Creating and appending a close button for the remote stream displayed on the screen

function createCloseButton(divElement,name,height,width){
//	var closeBtn = document.createElement('button');
//	var funcOnClick = '\' onclick=\'hangupUser(this.value)';
//	closeBtn.innerHTML=closeBtn.innerHTML + funcOnClick;
//	closeBtn.text = "HANGUP";
	var closeButton='<button  class=\'close\' type=\'button\' value=\''
		+name
		+'\' onclick=\'hangupUser(this.value)\'><img src=\'/img/close-button.png\' height='+height+' width='+width+' alt=\'Hangup\'></button>';
	divElement.innerHTML=divElement.innerHTML + closeButton;
	console.log("CLOSE BUTTON "+ divElement);
}

//Displaying a name tag to the remote media displayed on the screen

function addNameTag(divElement,displayName){
	var nameDisplay='<p align=\'center\'><font size=\'4\'>'+displayName+'</p>';
	divElement.innerHTML=divElement.innerHTML + nameDisplay;
}
