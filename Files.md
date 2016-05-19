
## Project  Structure Description

Folders
app - Folders dividing Server and Public(client) contents.
  server(folder) - Configuration files for server.
    config - Containsiles that manage server configuration including DB and Conenction between client and server.
      accounts.js   - Allows user accounts manipulation. User creation ready. User modification is pending and part of future work.
      connection.js - Defines the actions to be taken by the server depenending on messages received by other clients. It tells clients what to do along with any important information.
      database.js   - Defines the database connection.
      mixer.js      - Receives files from clients and process them.
      passport.js   - Login manager. Verifies that a user is registered to use the system.
    models - Contains files of different schemas that MongoDB uses for storage.
      recordings.js - Schema used for recordings.
      user.js       - Schema used for users.
    views  - Contains all views to be rendered into the web browsers. Each file defines HTML content in JADE format.
      forgotpass.jade - HTML page with form to reset a user's password.
      home.jade       - HTML file of the main video conference view. Most complex of all the pages with all the elements that are seen during conference. Dynamic content can be created/deleted as well.
      layout.jade     - Main layout which contains the Toolbar on top of the web pages.
      login.jade      - Login form HTML web view.
      profile.jade    - Information about the user account can be seen here.
      recordings.jade - Past recordings are available here. Content is created dynamically by the number of files saved in disc.
      reset.jade      - Reset password form.
      signup.jade     - Create new account form.
      users.jade      - Displays all the users registered in the database. Dynamically created.
    router.js - This file defines all the available URLs of the server.
  public(folder) - All public files and resources that can be accessed by the clients.
    css - Contains files to define personal CSS styles. Files are defined if needed but they are not used at the moment.
    img - All the images rendered in the web browsers should be located here.
    js  - All JavaScript files should be in here. This contains client side code.
      controllers - Contains files used in previous project. Little changes made to them.
        lib - Contains WebRTC library adapter.
          adapter.js - WebRTC library used to establish the WebRTC Peer connection. No changes made to this file.
        get_media_functions.js - Establishes the media paramaters for video and audio.
        home_controller.js     - Controls some of the buttons in the video conference mode.
        on_event_functions.js  - Manages actions received by the server through SocketIO.
        Opus.js                - Audio codec script. Not modified.
        remote_media_functions.js - Manages remote content received from other peers.
        webRTC_API_functions.js   - WebRTC API methods.
      views - Contains JavaScript functions that manage all the content viewed in the web browser.
        home.js        - Manages all other buttons in home page. Should be integrated with home_controller.js as a single file in the future.
        player.js      - Controlls audio streaming during broadcast mode.
        profile.js     - Empty file. Should contain methods to update/manage profile information.
        recordAudio.js - Manages Recording Mode and button actions.
        recordings.js  - Fetches and displays recordings available in database.
        users.js       - Creates a table of the existing users in the database.
    uploads - All files (recordings) are kept in disc in this folder. Processing of audio needs the folders described below.
      individual - All individual files are received by the server and saved here.
      mixed      - All mixed recordings after processing are saved here. The DB contains file paths to this folder when Recordings are rendered in the web browser. Files are streamed from this location.
      procs      - Processing in between original and mixed files are stored here.
ssl - Private keys and self signed certificates to be used in HTTPS server.

Files
app.js - Main file that configures and starts the server when run.
package.json - Information about the Author, repository and package dependencies.
README.md - This file!trete
