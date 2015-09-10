//VR Space for Singing Lessons
var container, stats;
var camera, scene, raycaster, renderer;
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
//  container = document.id='vrMainPage';
  container.style.position = 'relative';
  document.body.appendChild( container );


  camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 10000 );

  scene = new THREE.Scene();

  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );

  var geometry = new THREE.BoxGeometry( 20, 20, 20 );

  for ( var i = 0; i < 2000; i ++ ) {

    var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

    object.position.x = Math.random() * 800 - 400;
    object.position.y = Math.random() * 800 - 400;
    object.position.z = Math.random() * 800 - 400;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.scale.x = Math.random() + 0.5;
    object.scale.y = Math.random() + 0.5;
    object.scale.z = Math.random() + 0.5;

    scene.add( object );

  }

  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  //renderer.setPixelRatio( window.devicePixelRatio );
  //renderer.domElement.style.position='relative';

//  var fullScreenButton = document.querySelector( '.full-screen' );
//  var mouseLookButton = document.querySelector( '.mouse-look' );
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

  renderer.setClearColor( 0xf0f0f0 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;
  container.appendChild( renderer.domElement );

  stats = new Stats();
//  stats.domElement.style.top = '0px';
  //stats.domElement.style.position='absolute';

  var mystats = document.createElement( 'div' );
  mystats.setAttribute('class','mystats');
  mystats.appendChild( stats.domElement );


  //mouseLookButton.style.top = '0px';                               // Append the text to <button>
  container.appendChild(menu);
  container.appendChild(mystats);
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
}


function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function render() {

  theta += 0.1;

  camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
  camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
  camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
  camera.lookAt( scene.position );
  camera.updateMatrixWorld();


  headControls.update();
  vrEffect.render( scene, camera );

}


//helpers

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
