
// We are in the browser, run the tests
if (navigator.userAgent.indexOf('PhantomJS') < 0) {
    mocha.run();
}