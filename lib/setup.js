/**
Handles setting up the dockerhost client environment on the users machine.
*/

var Promise = require('promise');
var mkdirp = Promise.denodeify(require('mkdirp'));
var fsPath = require('path');

/**
Setting up essentially just means ensuring $HOME/.tc-dockerhost/ is available.
*/
function setup() {
  var home = process.env['DOCKERHOST_HOME'] ||
             fsPath.join(process.env['HOME'], '.tc-dockerhost');
  return mkdirp(home).then(function() {
    return home;
  });
}

module.exports = setup;
