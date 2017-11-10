#!/bin/bash

# Execute sonar-scanner
#/home/michael.jolin/Applications/sonar-scanner-2.8/bin/sonar-scanner -D ./sonar-project.properties

# Compress all javascript file in one

cat ./cause/js/uncompressed/*.js > ./cause/js/cause.js
cat ./cause/js/uncompressed/client/*.js >> ./cause/js/cause.js
cat ./cause/js/uncompressed/devExtreme/*.js >> ./cause/js/cause.js
cat ./cause/js/uncompressed/externalPlugins/*.js >> ./cause/js/cause.js
cat ./cause/js/uncompressed/localization/*.js >> ./cause/js/cause.js
cat ./cause/js/uncompressed/viewer/*.js >> ./cause/js/cause.js

# Uglify the compressed file
cat ./cause/js/cause.js | uglifyjs -o ./cause/js/cause.min.js

# Generate the docs
if [ "$#" -eq 1 ]; then
    rm -rf ./cause/docs/*.html
    jsdoc ./cause/js/cause.js -u ./cause/docs/tutorials -d ./cause/docs -r ./cause/README.md
else
    echo "Pass a argument to compile the docs! (./compress docs)"
fi
