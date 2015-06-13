#!/bin/sh
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install curl git sox libsox-fmt-mp3
#sudo apt-get install nodejs
sudo apt-get install npm
#Upgrade to latest nodejs version
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
#clone and change dir
git clone https://jmartinez1@bitbucket.org/jmartinez1/mit2015_jaime_musictherapy.git && cd mit2015_jaime_musictherapy
sudo npm install

#FOR MONGODB follow this tutorial http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
