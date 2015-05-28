var $usersTable = document.getElementById('usersTable');
displayUsers(jUsers);
console.log(jUsers);

function displayUsers(users){
  //var table = document.getElementById('usersTable')
  for (var i=0; i< users.length;i++){
    var tr = document.createElement('tr');
    var tdFname = document.createElement('td');
    var tdLname = document.createElement('td');
    var tdEmail = document.createElement('td');
    var tdAction = document.createElement('td');
    tr.appendChild(tdFname);
    tr.appendChild(tdLname);
    tr.appendChild(tdEmail);
    var delBtn = document.createElement('input');
    delBtn.type ="button";
    delBtn.value ="Delete";
    delBtn.class = "btn-danger"
    delBtn.id = users[i]['email'];
    delBtn.onclick = function(){
      var r = confirm("Are you sure you want to delete this account? (Cannot be reverted)");
      if (r == true) {
        socket.emit('delete',this.id);
        location.reload(true);
      }
    }
    tdAction.appendChild(delBtn);
    tr.appendChild(tdAction);
    $usersTable.appendChild(tr);
    tdFname.innerHTML = users[i]['fname'];
    tdLname.innerHTML = users[i]['lname'];
    tdEmail.innerHTML = users[i]['email'];
  }
}
//window.onload = displayUsers(jUsers);
