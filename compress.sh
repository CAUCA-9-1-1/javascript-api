#!/bin/bash

# Execute sonar-scanner
#/home/michael.jolin/Applications/sonar-scanner-2.8/bin/sonar-scanner -D ./sonar-project.properties

# Compress all javascript file in one

cat ./js/uncompressed/*.js > ./js/cause.js
cat ./js/uncompressed/client/*.js >> ./js/cause.js
cat ./js/uncompressed/devExtreme/*.js >> ./js/cause.js
cat ./js/uncompressed/externalPlugins/*.js >> ./js/cause.js
cat ./js/uncompressed/localization/*.js >> ./js/cause.js
cat ./js/uncompressed/viewer/*.js >> ./js/cause.js

# Uglify the compressed file
cat ./js/cause.js | uglifyjs -o ./js/cause.min.js

