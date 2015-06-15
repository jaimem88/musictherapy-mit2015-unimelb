#!/bin/sh
sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get -y install curl git sox libsox-fmt-mp3
#sudo apt-get install nodejs
sudo apt-get -y install npm
#Upgrade to latest nodejs version
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
#install mongodb
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start
#clone and change dir
git clone https://jmartinez1@bitbucket.org/jmartinez1/mit2015_jaime_musictherapy.git && cd mit2015_jaime_musictherapy
sudo npm install
sudo npm install -g forever
#sudo forever start app.js
#Manual Configuration
mongorestore mongoBackUp/6-15-2015-BackUp/
#start server
sudo forever start app.js -o output.log -e error.log
