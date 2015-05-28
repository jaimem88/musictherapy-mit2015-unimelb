var $recordingsTable = document.getElementById('recordingsTable');

displayRecordings(jRecordings);
function displayRecordings(recs){
  //var table = document.getElementById('usersTable')
  for (var i=0; i< recs.length;i++){
    var tr = document.createElement('tr');
    var tdDate = document.createElement('td');
    var tdRecording = document.createElement('td');
    var tdControls = document.createElement('td');
    tr.appendChild(tdDate);
    tr.appendChild(tdRecording);
    tr.appendChild(tdControls);
    tdRecording.innerHTML = "RingingSound";
    var audio = document.createElement('audio');
    tdControls.appendChild(audio);
    audio.controls = true;
    audio.src='./uploads/mixed/'+recs[i]['fileName'];
    audio.type = 'audio/mpeg';
    audio.style.display = "block";
    var d = new Date(recs[i]['recDate']);
    tdDate.innerHTML = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();
    tdRecording.innerHTML = recs[i]['fileName'];
    //tr.appendChild(tdAction);
    $recordingsTable.appendChild(tr);
  }
}
