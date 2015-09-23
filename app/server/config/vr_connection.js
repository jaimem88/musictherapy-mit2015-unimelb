
fs = require("fs");
var mixer = require("./mixer.js");
var Accounts = require("./accounts.js");
var Recordings = require('../models/recordings');
//var recordRTC = require('recordrtc');
var rooms={};
var clients={};
var clientsNameArray =[];
var clientCount = 0;
var vrRoom= 'vr_room_1';
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

module.exports = function(socket,namespace) {
/*************************************************************************************/
/****On event functions****/

	socket.on('vr_message', function (message) {
		console.log('Got vr_message: ', message);
		if (message === 'goodbye'){
			onGoodbye();
		}else if(message === 'leave'){
			onLeave();
		}else if(message === 'endConference'){
			onEndConference();
		}else{
			sendMessageToClient(message);
		}
	});

	socket.on('vr_new_user',function(newUser){
		socket.username = newUser;
		socket.join(vrRoom);
		console.log('vr_new_user', newUser);
		//store the new user details in server
		clientsNameArray.push(newUser);
		createClientObject(newUser,socket,vrRoom);
		sendOnlineContacts(clientsNameArray,newUser);
		// send message to room
		//vr_connections.in(vrRoom).emit('vr_joined',newUser);
		sendMessageToRoom('vr_joined',newUser);
	});

	socket.on('vr_webrtc_connection',function(user){
			console.log('attempt webrtc connection here with', user);


	});
  socket.on('vr_remote_added',function(remoteId){
    sendMessageToRoom('vr_remote_added',remoteId);
  })
	//On receiving remove request from initiator,
	//remove the user from the room and inform others to remove the user as well
		socket.on('remove from room',function(hangupUser){
			sendMessageToRoom('remove',hangupUser);
		});
	//Tell all users to start recording local stream
	socket.on('start recording',function(){
		sendMessageToRoom('start recording','start recording');
	});
	//Stop audio recording
	socket.on('stop recording',function(data){
		sendMessageToRoom('stop recording','stop recording');
	});
	//Receive all recordings
	socket.on('myrecording',function(file){
		clientCount +=1;
		console.log(clientCount+" recieved audio file "+file.audio.count);
		var d = new Date()
		var fileName = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
		writeToDisk(file.audio.dataURL, fileName+'_'+file.audio.email+'.wav');
		if(clientCount == file.audio.count){
			clientCount = 0;
			sendMessageToRoom('ready to mix', 'ready to mix');
		}
	});
	//on mix
	socket.on('mix recordings',function(data){
		//console.log(data);
		//mixer.preproc(data);
		mixer.printFiles(data);
	});
	socket.on('broadcast',function(){
		Recordings.find({},'-_id -__v' , function(err, recs) {
			jsonRecs = JSON.stringify(recs);
			console.log(jsonRecs);
			sendMessageToRoom('broadcast',recs);
		}).sort('recDate');
	});
	socket.on('file to play',function(file){
		sendMessageToRoom('file to play',file);
	});
	socket.on('stop broadcast',function(){
		sendMessageToRoom('stop broadcast','stop broadcast');
	});
	socket.on('play',function(){
		sendMessageToRoom('play','play');
	});
	socket.on('pause',function(){
		sendMessageToRoom('pause','pause');
	});
	socket.on('seek',function(time){
		sendMessageToRoom('seek',time);
	});
//};
	/************************************************************************************************/
									/****helper functions****/

//write recording to disk
function writeToDisk(dataURL, fileName) {
    var fileExtension = fileName.split('.').pop(),
        fileRootNameWithBase = './app/public/uploads/individual/' + fileName,
        filePath = fileRootNameWithBase,
        fileID = 2,
        fileBuffer;

    // @todo return the new filename to client
    while (fs.existsSync(filePath)) {
        filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
        fileID += 1;
    }

    dataURL = dataURL.split(',').pop();
    fileBuffer = new Buffer(dataURL, 'base64');
    fs.writeFileSync(filePath, fileBuffer);

    console.log('filePath', filePath);
}

//Sending the list of online contacts to the client

function sendOnlineContacts(contactsArray,newUser){
	var contactsOnline =[];
	formClientsNameArray();
	console.log('client array:' +clientsNameArray);
	console.log('contact array:' +contactsArray);
	for (i=0; i<clientsNameArray.length; i++){
		if (clientsNameArray[i] != newUser)
			contactsOnline.push(clientsNameArray[i]);
	}
	console.log(contactsOnline);
	//contactsOnline = clientsNameArray.filter(isItMe(newUser));
	//emit contacts who are online to the new user
	io.sockets.in(socket.id).emit('contacts',contactsOnline);
	console.log('sent online contacts to client:'+contactsOnline);
	//update new user online status to existing online users
	updateStatus(contactsOnline,newUser);

};
//Updating the list of online contacts in all clients
function updateStatus(contactsOnline,newUser){
	console.log('entered update users fucntion');
	for(i=0;i<contactsOnline.length;i++){
		console.log('entered for loop');
		var updated = false;
		var j=0;
		while(updated==false){
			if(contactsOnline[i] in clients){
				console.log('client found, updating contact list in client:'+contactsOnline[i]);
				console.log("the new user is:"+newUser);
				io.sockets.in(vrRoom).emit('addContact',newUser);
			//	io.sockets.in(clients[contactsOnline[i]].socketID).emit('addContact',newUser);
				updated= true;
			}else{
				console.log('checking next contact');
				j++;
			}
		}
		console.log('finished updating');
		formClientsNameArray();
		console.log('client array:' +clientsNameArray);
	}
}

//On receiving goodbye message from client,
//inform the other room members to update their connected users array
//and  also delete the client from clients array in the server
function onGoodbye(){
	console.log('got message goodbye from client');
	informRoomMembers(socket.username);
	deleteClient(socket.username);
	//delete from client array
	console.log("clientsNameArray before: ",clientsNameArray)
	clientsNameArray.remove(socket.username);
	console.log("clientsNameArray after: ",clientsNameArray)
	console.log('informing deletion to others');
	socket.broadcast.emit('deleteContact',socket.username);
}
//If the client was part of a web conference,
//then inform the room members to remove the client from their connected users list
function informRoomMembers(){
	if(socket.username in clients){
		if(clients[socket.username].room != ''){
			sendMessageToRoom('remove',socket.username);
		}
	}
}
//Deleting the client information from the clients array
function deleteClient(name){
	console.log('deleting client from client array');
	delete clients[name];
	console.log('the client array now is: ');
	formClientsNameArray();
	console.log(clientsNameArray);
}

//Removing the user from the room and informing other members in the room about the removal
function onLeave(){
	console.log('got message leaving from client '+socket.username);
	console.log('removing '+socket.username+' from the room');
	if(clients.length>0){
		socket.leave(clients[socket.username].room);
		sendMessageToRoom('message',socket.username+' left the room');
		clients[socket.username].room='';
		clientsNameArray =[];
	}
}

function onEndConference(){
	console.log('ending the conference,closing room');
	sendMessageToRoom('message','endOfConference');
}
//Sending a message to the whole room
function sendMessageToRoom(messageTag,message){
	console.log('sending message to room: '+ messageTag);
	namespace.in(vrRoom).emit(messageTag, message);
}
//Sending a message to the client specified
function sendMessageToClient(message){
	var sendToClient = message.connectTo;
	message.connectTo = socket.username;
	console.log('sending message to client '+ sendToClient,clients[sendToClient].socketID);
  clients[sendToClient].socket.emit('vr_message',message);
}
	/*************************************************************************************/
	/****Managing the Client Array****/

	//This function stores the information about the clients

	function createClientObject(newUser,socket,room){
		var clientObj = {};

		clientObj.socket= socket;
		clientObj.socketID= socket.id;
		clientObj.room = room;

		clients[newUser] = clientObj;
	}

	//This function forms a list of client names connected to the server

	function formClientsNameArray(){
		clientsNameArray = Object.keys(clients);
		console.log('formClients() ',clientsNameArray);
	}
};
