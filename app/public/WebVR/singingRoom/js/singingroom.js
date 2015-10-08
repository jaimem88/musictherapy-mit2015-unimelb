//VR Space for Singing Lessons
var localStream;
var container, stats;
var camera, scene, raycaster, renderer;
var vrEffect;
var vrControls;
var INTERSECTED;
var radius = 100, theta = 0;
var crosshair;var container, stats;
//
var mouseControls;
var headControls;
var controls;
var vrMode = false;
//Buttons
var mouseLook;
var mouseLookButton, fullScreenButton;
var mouse = new THREE.Vector2();
//clickable
var objects = [];
var objectNames = {};
var videoObjects = [];

// HTML ELEMENTS
var $localVideo;

//webRTC
var pc=[];
var userID=0;
var room = 'room1';
var connectedUsers={};
var numberOfOnlineContacts;
var sdpConstraints = {'mandatory': {
	'OfferToReceiveAudio':true,
	'OfferToReceiveVideo':true }};
	var socket;
function connectToVrRoom(){
	console.log('connectToVrRoom1');
	socket = io('/vr_connections');
		if(admin==='true'){
			username = username +" - Clinician";
		}
}
function init() {
  //Load scripts
  $localVideo = document.getElementById( 'localVideo' );
  $.getScript("js/views/recordAudio.js");
  $.getScript("js/views/player.js");
  $.getScript("js/controllers/remote_media_functions.js");
  $.getScript("js/controllers/webRTC_API_functions.js");
	$.getScript("WebVR/singingRoom/js/vr_socketio_messages.js");
	$.getScript("WebVR/singingRoom/js/on_vr_events.js",
		$.getScript("WebVR/singingRoom/js/remote_3d_objects.js",
			getMedia(connectToVrRoom)));

  //$.getScript("js/controllers/on_event_functions.js")
  //Load webcam


  container = document.createElement( 'div' );
  container.style.position = 'relative';
  document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 10000 );

	scene = new THREE.Scene();
	//amera.lookAt(scene.position);
	crosshair = new THREE.Mesh(
		new THREE.RingGeometry( 0.5, 1, 32 ),
		new THREE.MeshBasicMaterial( {
			color: 0x00bb00,
			transparent: true,
			opacity: 0.5
		} )
	);
	scene.add( crosshair );
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 1, 1, 1 ).normalize();
	scene.add( light );

var floorTexture = new THREE.ImageUtils.loadTexture( '/img/wooden_floor.jpg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -100;
floor.rotation.x = Math.PI/2;
scene.add(floor);

var geometryLateral = new THREE.BoxGeometry(1, 500, 200);
var westWall = new THREE.Mesh(geometryLateral, floorMaterial);
scene.add(westWall);
westWall.position.set(-200,0,-80);
westWall.rotation.set(Math.PI/2,0,Math.PI);
var eastWall = new THREE.Mesh(geometryLateral, floorMaterial);
scene.add(eastWall);
eastWall.position.set(200,0,-80);
eastWall.rotation.set(Math.PI/2,0,-Math.PI);
var backGeo = new THREE.BoxGeometry(250, 500, 1);
var northtWall = new THREE.Mesh(backGeo, floorMaterial);
scene.add(northtWall);
northtWall.position.set(0,0,-400)
//northtWall.rotation.x = Math.PI/2;
//northtWall.rotation.y = Math.PI/2;
northtWall.rotation.z = Math.PI/2;

// SKYBOX/FOG
var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
 scene.add(skyBox);


  //New gemoetry for the cube
  var geometry = new THREE.BoxGeometry(2 , 2, 1 );
  //Material to fill the cube, in this case a color.
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff0f } );
  // fill the geo with material so that it renders a cube
  var cube = new THREE.Mesh( geometry, material );
	console.log(cube.uuid);
	objectNames[cube.uuid] = 'cube';
//	objects.push(cube);
//  scene.add( cube );
  cube.position.set(2,0,-5);


	raycaster = new THREE.Raycaster();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	//renderer.setPixelRatio( window.devicePixelRatio );

  buttons();
  vrEffect = new THREE.VREffect(renderer, VREffectLoaded);

  function VREffectLoaded(error) {
    if (error) {
      console.log(error);
      fullScreenButton.innerHTML = error;
      fullScreenButton.classList.add('error');
    }
  }
  vrEffect.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;


  container.appendChild( renderer.domElement );
  //container.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
	container.addEventListener("keydown", onkey, true);

	//VIDEO - Pass HTML video elements, x,y,z pos
	localVideoScreen = newVideo3DObject('localVideo','videoImage',-4,0,-5);
	scene.add(localVideoScreen);



	var name = 'text '+username;
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	    ctx.font="20px Georgia";
	    ctx.fillText(name,10,50);

	var texture = new THREE.Texture(canvas);
	    texture.needsUpdate = true; //just to make sure it's all up to date.

	var label = new THREE.Mesh(new THREE.PlaneGeometry, new THREE.MeshBasicMaterial({map:texture}));
	label.position.set(0,0,-10);
	scene.add(label);
  vrEffect.render(scene, camera);

}
init();
function animate() {
  //Update webcam images
	updateVideoSources();

	for (k in objects){
		objects[k].lookAt(camera.position);
	}
	requestAnimationFrame( animate );
	render();
  stats.update();
}

 animate();

 function render() {

	 // find intersections
	 raycaster.setFromCamera( { x: 0, y: 0 }, camera );
	 var intersects = raycaster.intersectObjects( objects );

	 if ( intersects.length > 0 && mouseLook) {
		 currentInt  = intersects[ 0 ].object ;
		 if ( INTERSECTED !=currentInt  ) {
			 	console.log("interesected: ",objectNames[currentInt.uuid]);
		 }
	 } else {
		 INTERSECTED = null;
	 }
  	headControls.update();

	 crosshair.quaternion.copy( camera.quaternion );
	 crosshair.position.set( 0, 0, 0 );
	 if ( INTERSECTED ) {

		 crosshair.translateZ(
			 -scene.position.distanceTo( INTERSECTED.position ) +
			 INTERSECTED.geometry.boundingSphere.radius + 5
		 );

	 }
	 else {
		 crosshair.translateZ(-40);
	 }
	 vrEffect.render( scene, camera );
 }

//helpers
function buttons(){
  // Buttons
  var menu = document.createElement( 'div' );
  menu.setAttribute('class','menu');
  mouseLookButton = document.createElement( 'div' );
  mouseLookButton.setAttribute('class','button full-screen');
  mouseLookButton.innerHTML = 'Enable Mouse Look';
  fullScreenButton = document.createElement( 'div' );
  fullScreenButton.setAttribute('class','button mouse-look');
  fullScreenButton.innerHTML = 'Start VR Mode';
	if ( navigator.getVRDevices === undefined ) {

		fullScreenButton.innerHTML = 'Your browser doesn\'t support WebVR';
		fullScreenButton.classList.add('error');

	}

  menu.appendChild(mouseLookButton);
  menu.appendChild(fullScreenButton);


	mouseLook = false;

  fullScreenButton.onclick = function() {
    vrEffect.setFullScreen( true );
		vrMode = true;
  };

  vrControls = new THREE.VRControls(camera);

  headControls = vrControls;

  mouseLookButton.onclick = function() {
    mouseLook = !mouseLook;

    if (mouseLook) {
      mouseControls = new THREE.MouseControls(camera);
      headControls = mouseControls;
      mouseLookButton.classList.add('enabled');
    } else {
      headControls = vrControls;
      mouseLookButton.classList.remove('enabled');
    }
  }

  stats = new Stats();
  var mystats = document.createElement( 'div' );
  mystats.setAttribute('class','mystats');
  mystats.appendChild( stats.domElement );

  //mouseLookButton.style.top = '0px';                               // Append the text to <button>
  container.appendChild(menu);
  container.appendChild(mystats);

}
function onDocumentMouseDown(event) {
   	console.log('clicky');
    //event.preventDefault();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    var vector = new THREE.Vector3(mouse.x,
                                   mouse.y, 0.5);
}
function onWindowResize() {
	console.log('window resize');
	checkControls();
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	vrEffect.setSize( window.innerWidth, window.innerHeight );

}
function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onkey(event) {
  event.preventDefault();

  if (event.keyCode == 90) { // z
    headControls.zeroSensor(); //zero rotation
  } else if (event.keyCode == 70 || event.keyCode == 13) { //f or enter
    vrEffect.setFullScreen(true); //fullscreen
		vrMode = true;
  }

};


//Informing the server about the client ending the session

window.onbeforeunload = function(e){
	sendMessage('goodbye');
}



function checkControls() {

    if (vrMode) {
				vrMode = false;
       console.log('enter vrMode ');
    } else {
         console.log('exit vrMode ');
    }
}
tl = true;
remote = false;
local =true;
function updateVideoSources(){
	//Update local Camera

	/*if ( localVideo.readyState === localVideo.HAVE_ENOUGH_DATA )
  {
    videoImageContext.drawImage( localVideo, 0, 0, videoImage.width, videoImage.height );
    if ( videoTexture )
    videoTexture.needsUpdate = true;
  }*/

	for (currVid of videoObjects){
		if ( currVid.videoDiv.readyState === currVid.videoDiv.HAVE_ENOUGH_DATA )
		{
			if (tl && (remote||local)){
				console.log('updateVideoSources', currVid);
				if(remote)
					tl= false;
				if (local)
					local = false;
			}

			currVid.vidImgCtx.drawImage( currVid.videoDiv, 0, 0, currVid.videoImg.width, currVid.videoImg.height );
			if ( currVid.vidTexture ){
				currVid.vidTexture.needsUpdate = true;
			}
		}
	}
}
function createVideoObject(videoDiv,videoImg,vidImgCtx,vidTexture){
	var videoObj = {};

	videoObj.videoDiv= videoDiv;
	videoObj.videoImg= videoImg;
	videoObj.vidImgCtx= vidImgCtx;
	videoObj.vidTexture = vidTexture;
	//videoObj.ready = true;
	console.log('createVideoObject: ', videoObj);
	videoObjects.push(videoObj);
}
function newVideo3DObject(videoId,videoImageId,posx,posy,posz,name){
	///////////
	// VIDEO //
	///////////
	videoElement = document.getElementById( videoId );
	console.log('newVideo3DObject0 ',videoElement)
	if (videoElement.nodeName ==='DIV'){
		thisVid = videoElement.getElementsByTagName('video');
			 	 console.log('newVideo3DObject111 ',thisVid[0]);
				 videoElement = videoElement.getElementsByTagName('video')[0];
	}
	videoImage = document.getElementById( videoImageId );
	 console.log('newVideo3DObject1: ',videoImage);
	if (videoImage ===null){
	 videoImageArr = $("#videoImage").clone().prop('id', videoImageId );
	 videoImage = videoImageArr[0];
	 console.log('newVideo3DObject2: ',videoImage);
	 document.body.appendChild(videoImage);
	//	videoElement = document.createElement( 'div' );
	}

	videoImageContext = videoImage.getContext( '2d' );
	console.log('newVideo3DObject3: ',videoImageContext);
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;

	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	// the geometry on which the movie will be displayed;
	// 		movie image will be scaled to fit these dimensions.
	var movieGeometry = new THREE.PlaneBufferGeometry( 2, 2, 1, 1 );
	var videoScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	if (name === undefined){
			name = username
	}
	videoScreen.name = name;
//	videoScreen.position.set(-2,0,-5);
	videoScreen.position.set(posx,posy,posz);

	//div, imgDiv,imgctx,vidTexture
	createVideoObject(videoElement,videoImage,videoImageContext,videoTexture);
	//Push into intersectable ovjects
	objects.push(videoScreen);
	objectNames[videoScreen.uuid] = videoId+'Screen';
	console.log("VIDEOSCREEN",videoScreen.name);
	return videoScreen;

}
