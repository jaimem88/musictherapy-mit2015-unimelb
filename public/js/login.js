//This is the javascript to accept and validate the username
		
		console.log(window.location.host);
		var socket = io.connect("http://" + window.location.host);
		
		var user;
			
//Request the username at the start of the session
		
		window.onload = requestName("Please enter your username");
		
		function requestName(message){
			user = window.prompt(message);
			if(user){
				sendName(user);
			}
		}
		

//This function send the user name to the server for validation
		
		function sendName(user){
			
			console.log("sending username to server");
			console.log("Validating username");
			socket.emit('new user',user,validatedNick);
						
		}
				
//This function displays a welcome message to a valid user or prompts to enter a valid username 

		function validatedNick(data){
			if(data)
			{
				var $startConference = document.getElementById('startConference');
				console.log("username valid");
				$startConference.style.display="block";
				var userHeading = document.getElementById("userHeading");
				userHeading.innerHTML = "Welcome "+	user;
				console.log("displaying media page");
				document.getElementById("mediaPage").style.display = "block";
				
			}
			else
			{
				console.log("invalid user");
				requestName("Invalid username,Try again!");
			}
		}