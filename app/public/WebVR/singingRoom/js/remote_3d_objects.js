function addRemoteVRVideo(remoteId){
  //console.log("addRemoteVRVideo1 ",remoteId);
  var x;
  var tmp = objects.length-1;
  x = objects[tmp].position.x +4;
  console.log('addRemote ',x);
  console.log('addRemote ',remoteId);
 var remVid =  newVideo3DObject(remoteId,remoteId+'VideoImage',x,0,-5,remoteId);
  // console.log("addRemoteVRVideo2 ",remVid);
   remote = true;
 scene.add(remVid);
}


function removeEntity(obj) {
    console.log("REMOVE_ENT",obj.name)
    var i = objects.indexOf(obj);
    if (i > -1) {
      objects.splice(i, 1);
    }
    console.log("REMOVE_ENT1",scene.length);
    scene.remove( obj );
    console.log("REMOVE_ENT2",scene.length);
    animate();
}
