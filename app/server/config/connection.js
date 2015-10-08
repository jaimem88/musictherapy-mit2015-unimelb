
fs = require("fs");
var mixer = require("./mixer.js");
var Accounts = require("./accounts.js");
var Recordings = require('../models/recordings');
//var recordRTC = require('recordrtc');
var rooms={};
var clients={};
var clientsNameArray =[];
var clientCount = 0;
module.exports = function(socket) {
/*************************************************************************************/
/****On event functions****/

		socket.on('message', function (message) {
			console.log('Got message: ', message);
			if (message === 'goodbye'){
				onGoodbye();
			}
			else
				if(message === 'leave'){
					onLeave();
				}
				else
					if(message === 'endConference'){
						onEndConference();
					}
					else{
						sendMessageToClient(message);
					}
		});
		socket.on('delete',function(data){
			console.log("Delete from db "+data)
			Accounts.deleteAccount(data);
		})

		socket.on('new_peer',function(newUser){
			console.log('SERVER', 'Receieved new PeerConnection',newUser);
			socket.broadcast.emit('new_peer',newUser)
			//sendMessageToRoom('new_peer',newUser);
		});

	//Validating the new user and storing the user details in the server

		socket.on('new user',function(newUser,callback){
		//	Users.findOne({fname:newUser},{contacts:1}).exec( function(err,jsonContacts){
			//	if(jsonContacts){
		  //	console.log("username",newUser);
					socket.username = newUser;

					//store the new user details in server
					clientsNameArray.push(socket.username);
					createClientObject(newUser,socket);
					sendOnlineContacts(clientsNameArray,newUser);
					//callback(true);
				//}
				//else{
				//	console.log('user not in db');
				//	callback(false);
				//}
			//});
		});

	//Send a connect request or add to conference request to the callee according to callee's room status

		socket.on('connectToUser', function(contactSelected){
			console.log('connect request from : '+socket.username+' to '+contactSelected);
			if(clients[contactSelected].room === ''){
				console.log("sending connect request to  "+ contactSelected);
				io.sockets.in(clients[contactSelected].socketID).emit('connectRequest', socket.username);
			}
			else{
				console.log("sending add to conference request to  "+ contactSelected);
				io.sockets.in(clients[contactSelected].socketID).emit('addToConferenceRequest', socket.username);
			}
		});

	//Triggered when the client accepts a call from the initiator,
	//When the initiator starts a call the first time,Create a room for the initiator
	//and then add callee to the room.
	//When the initiator tries to add more users into the conference,
	//join the callee to initiator's existing room

		socket.on('accept',function(callerName){
			console.log('client accepted the call');
			console.log('allocating rooms');

			var room;
			if(clients[callerName].room ==''){
				room = 'room1';
				createRoomForInitiator(callerName,room);
			}
			else{
				room = clients[callerName].room;
			}
			joinExistingRoom(socket,room);
			console.log('callee joined existing room: '+room);
			socket.emit('joined',room);
			sendMessageToRoom('user joined',socket.username);

		});

	//When the initiator accepts a user into the conference,
	//join the user to an existing room

		socket.on('acceptIntoConference',function(callerName){
			var room = clients[socket.username].room ;
			console.log('initiator accepted the call');
			console.log('joining'+callerName+'into the room: '+room);
			joinExistingRoom(clients[callerName].socket,room);
			//clients[callerName].socket.join(room);
			//clients[callerName].room = room;
			sendMessageToRoom('user joined',callerName);
			io.sockets.in(clients[callerName].socketID).emit('addedToConference',clients[callerName].room );
		});


	//On getting reject message from callee, send the message to the caller

		socket.on('reject',function(name){
			console.log('got reject message from callee,sending it to caller');
			io.sockets.in(clients[name].socketID).emit('reject',socket.username);
		});

	//On hangup event send hangup message to the hangupUser

		socket.on('hangup',function(hangupUser){
			console.log('send hangup message to client:'+hangupUser);
			io.sockets.in(clients[hangupUser].socketID).emit('hangup',socket.username);
		});

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
				io.sockets.in(clients[contactsOnline[i]].socketID).emit('addContact',newUser);
				console.log("CLIENTS SENT");
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
//Creating a room for the initiator of the conference
function createRoomForInitiator(name,room){
	//room = 'room1';
	clients[name].socket.join(room);
	clients[name].room = 'room1';
	console.log('caller created room: '+ room);
	io.sockets.in(clients[name].socketID).emit('created',room);
}
//Client joining an existing room and updating the room details in the client array
function joinExistingRoom(socket,room){
	socket.join(room);
	clients[socket.username].room = room;
}
//On receiving goodbye message from client,
//inform the other room members to update their connected users array
//and  also delete the client from clients array in the server
function onGoodbye(){
	console.log('got message goodbye from client');
	informRoomMembers(socket.username);
	deleteClient(socket.username);
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
	}
}

function onEndConference(){
	console.log('ending the conference,closing room');
	sendMessageToRoom('message','endOfConference');
}
//Sending a message to the whole room
function sendMessageToRoom(messageTag,message){
	console.log('sending message to room:'+ messageTag);
	//socket.broadcast.to(clients[socket.username].room).emit(messageTag,message);
	io.sockets.in(clients[socket.username].room).emit(messageTag,message);
}
//Sending a message to the client specified
function sendMessageToClient(message){
	var sendToClient = message.connectTo;
	message.connectTo = socket.username;
	console.log('sending message to client '+ sendToClient);
	io.sockets.in(clients[sendToClient].socketID).emit('message',message);
}
	/*************************************************************************************/
	/****Managing the Client Array****/

	//This function stores the information about the clients

	function createClientObject(newUser,socket){
		var clientObj = {};

		clientObj.socket= socket;
		clientObj.socketID= socket.id;
		clientObj.room = '';

		clients[newUser] = clientObj;
	}

	//This function forms a list of client names connected to the server

	function formClientsNameArray(){
		clientsNameArray = Object.keys(clients);
	}
};
