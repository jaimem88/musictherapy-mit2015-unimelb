function addRemoteVRVideo(remoteId){
  //console.log("addRemoteVRVideo1 ",remoteId);
  var x;
  var tmp = objects.length-1;
  x = objects[tmp].position.x +4;
  console.log('addRemote ',x);
 var remVid =  newVideo3DObject(remoteId,remoteId+'VideoImage',x,0,-5);
  // console.log("addRemoteVRVideo2 ",remVid);
   remote = true;
 scene.add(remVid);
}


function removeEntity(object) {
    var selectedObject = scene.getObjectByName(object.name);
    scene.remove( selectedObject );
    animate();
}
