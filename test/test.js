try {
    /* Find and include the file for generic test */
    var fs = require('fs');
    if (fs.workingDirectory.indexOf('StaticWebContent/test') === -1) {
        fs.changeWorkingDirectory(fs.workingDirectory.substr(0, fs.workingDirectory.indexOf('/Programming/') + 13) + 'StaticWebContent/test/');
    }

    phantom.injectJs('./generic.js');

    /* Create the test */
    if (typeof(causeTest) === 'function') {
        casper.test.begin('Basic test for cause.js', function (test) {
            /** Basic test to look if the st.cauca.ca is working
             */
            var appTest = new causeTest(casper, test, 4);

            casper.start('http://st.cauca.ca', appTest.server.bind(appTest, /CAUSE - librarie statique/i));
            casper.clear();

            casper.thenOpen('http://st.cauca.ca/cause/html/', appTest.cause.bind(appTest));

            casper.then(appTest.devExtreme.bind(appTest, '#clickRun'));

            casper.run(appTest.finish.bind(appTest));
        });
    } else {
        casper.test.fail('You need to clone the repo "StaticWebContent" to execute this test!');
    }
} catch (e) {
    casper.test.fail('You need to install the "npm" "fs"');
}