#!/bin/bash

# Check if user had all application neeeded
hash npm 2>/dev/null || { echo >&2 "This test require 'npm' but it's not installed."; exit 1; }
hash phantomjs 2>/dev/null || { echo >&2 "This test require 'npm' 'phantomjs' but it's not installed."; exit 1; }
hash casperjs 2>/dev/null || { echo >&2 "This test require 'npm' 'casperjs' but it's not installed."; exit 1; }

cd ~/Programming/StaticWebContent/test/
clear

# Find or ask for username
if [[ $USER != *"."* ]]; then
    read -p "Enter your LDAP username: " user
else
    user="$USER"
    echo "Your LDAP username is $user"
fi

# Ask for password
read -s -p "Enter your LDAP password: " pass

# Test st.cauca.ca
echo ""
echo ""
echo "TEST ST.CAUCA.CA"
casperjs test ../cause/test.js

# Test voisins secours
if [ -d "../../VoisinsSecours/" ]; then
	echo ""
	echo ""
	echo "TEST VOISINS SECOURS"
	casperjs test ../../VoisinsSecours/static/test.js
fi

# Test console survi-mobile
if [ -d "../../FireQ/" ]; then
	echo ""
	echo ""
	echo "TEST console SURVI-Mobile Administration"
	casperjs test ../../FireQ/FireQPHP/SMconsoleAdmin/static/test.js --user=$user --pass=$pass

	echo ""
	echo ""
	echo "TEST console SURVI-Mobile"
	casperjs test ../../FireQ/FireQPHP/SMconsole/static/test.js
fi

# Test messagerie web incendie
if [ -d "../../WebIncendie/" ]; then
    echo ""
    echo ""
    echo "TEST messagerie du site web incendie"
    casperjs test ../../WebIncendie/survi-messagerie/static/test.js
fi

# Test horaire-garde-steadele web incendie
if [ -d "../../WebIncendie/" ]; then
    echo ""
    echo ""
    echo "TEST horaire-garde-steadele du site web incendie"
    casperjs test ../../WebIncendie/horaire-garde-steadele/static/test.js
fi

# Test gestion DAA
if [ -d "../../ReponseAppel911/Web/" ]; then
    echo ""
    echo ""
    echo "TEST gestion du DAA"
    casperjs test ../../ReponseAppel911/Web/gestiondaa/gestiondaa/static/test.js --user=$user --pass=$pass
fi

# Videotron 9-1-1 Nomade
if [ -d "../../videotron-portail/" ]; then
    echo ""
    echo ""
    echo "TEST Vidéotron 9-1-1 Nomade"
    casperjs test ../../videotron-portail/videotron-portail/static/test.js
fi