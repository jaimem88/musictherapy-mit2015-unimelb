//VR Space for Singing Lessons
var container, stats;
var camera, scene, renderer;
var vrEffect;
var vrControls;
var mouseControls;
var headControls;


var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
init();
animate();

function init() {

  container = document.createElement( 'div' );
  container.style.position = 'relative';
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 10000 );
  //camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
//  camera = new THREE.CubeCamera( 1, 100000, 128 );
//  scene.add( cubeCamera )
  scene = new THREE.Scene();
  scene.add(camera);
  camera.position.set(0,150,400);
  camera.lookAt(scene.position);
	videoImage = document.getElementById( 'videoImage' );
  //New gemoetry for the cube
  var geometry = new THREE.BoxGeometry(100 , 100, 20 );
  //Material to fill the cube, in this case a color.
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff0f } );
  // fill the geo with material so that it renders a cube
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  cube.position.set(200,300,0);

  //var light = new THREE.PointLight(0xfff0ff);
  //light.position.set(0,250,0);
  //scene.add(light);

  renderer = new THREE.WebGLRenderer( { antialias: true } );

  buttons();
  renderer.setClearColor( 0xf0f0f0 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;
  //renderer.domElement.style.position = 'inherit'

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );


  ///////////
	// VIDEO //
	///////////
	video = document.getElementById( 'monitor' );

	videoImage = document.getElementById( 'videoImage' );
	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;

	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	// the geometry on which the movie will be displayed;
	// 		movie image will be scaled to fit these dimensions.
	var movieGeometry = new THREE.PlaneBufferGeometry( 100, 100, 20, 1 );
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	movieScreen.position.set(-200,300,0);
	scene.add(movieScreen);
  container.appendChild( renderer.domElement );
	camera.position.set(0,200,200);
	camera.lookAt(movieScreen.position);
}


function animate() {

  requestAnimationFrame( animate );
  render();
  stats.update();

}

function render() {
  //Update local Camera
  if ( video.readyState === video.HAVE_ENOUGH_DATA )
  	{
  		videoImageContext.drawImage( video, 0, 0, videoImage.width, videoImage.height );
  		if ( videoTexture )
  			videoTexture.needsUpdate = true;
  	}
  	renderer.render( scene, camera );
  headControls.update();
  vrEffect.render( scene, camera );

}


//helpers
function buttons(){
  // Buttons
    var menu = document.createElement( 'div' );
    menu.setAttribute('class','menu');
    var mouseLookButton = document.createElement( 'div' );
    mouseLookButton.setAttribute('class','button full-screen');
    mouseLookButton.innerHTML = 'Enable Mouse Look';
    var fullScreenButton = document.createElement( 'div' );
    fullScreenButton.setAttribute('class','button mouse-look');
    fullScreenButton.innerHTML = 'Start VR Mode';

    menu.appendChild(mouseLookButton);
    menu.appendChild(fullScreenButton);


    var mouseLook = false;

    fullScreenButton.onclick = function() {
      vrEffect.setFullScreen( true );
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

    vrEffect = new THREE.VREffect(renderer, VREffectLoaded);
    function VREffectLoaded(error) {
      if (error) {
        fullScreenButton.innerHTML = error;
        fullScreenButton.classList.add('error');
      }
    }
    stats = new Stats();
    var mystats = document.createElement( 'div' );
    mystats.setAttribute('class','mystats');
    mystats.appendChild( stats.domElement );
  //Threejscontainer = document.getElementById( 'ThreeJS' );
    //Threejscontainer.appendChild( renderer.domElement )

    //mouseLookButton.style.top = '0px';                               // Append the text to <button>
    container.appendChild(menu);
    container.appendChild(mystats);
}
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  vrEffect.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
