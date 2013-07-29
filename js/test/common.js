(function (window) {

    // Set globals for assertion chai assertion tools
    window.assert = chai.assert;
    window.expect = chai.expect;

    mocha.setup({
        ui: 'bdd',
        ignoreLeaks: true
    });

    /*
    window.sinonChai    = require('sinon-chai'); // Buggy as hell right now
    window.jqueryChai   = require('chai-jquery');

    chai.use(sinonChai);
    chai.use(jqueryChai);
    */

})(window);