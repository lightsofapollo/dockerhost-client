var setup = require('../lib/setup');
var fs = require('fs');
var fsPath = require('path');
var taskcluster = require('taskcluster-client');
var mkdirp = require('mkdirp');
var mustache = require('mustache');

var Promise = require('promise')

var exec = Promise.denodeify(require('child_process').exec);

var TEMPLATES = {
  activate: fs.readFileSync(__dirname + '/../template/activate.sh', 'utf8'),
  docker: fs.readFileSync(__dirname + '/../template/docker.sh', 'utf8'),
  run: fs.readFileSync(__dirname + '/../template/run.sh', 'utf8')
};

function initializeDockerAlias(dockerCLI, alias, path, taskId) {
  // XXX: Add real authentication here...
  var queue = new taskcluster.Queue();
  var createdClient = queue.getLatestArtifact(taskId, 'public/api.json').then(
    taskcluster.createClient.bind(taskcluster)
  );

  var authenticated = createdClient.then(function(Client) {
    var client = new Client();
    return client.authenticate();
  });

  return authenticated.then(function(res) {
    var host = res.host;
    var cacert = res.cacert;
    var cert = res.cert;
    var key = res.key;

    // template context
    var context = {
      dockerCLI: dockerCLI,
      root: path,
      alias: alias,
      host: host,
      cacert: fsPath.join(path, 'cacert.pem'),
      key: fsPath.join(path, 'key.pem'),
      cert: fsPath.join(path, 'cert.pem'),
      docker: fsPath.join(path, 'docker'),
      activate: fsPath.join(path, 'activate'),
      run: fsPath.join(path, 'run')
    };

    // Write state to disk for later use...
    fs.writeFileSync(context.cacert, cacert);
    fs.writeFileSync(context.key, key);
    fs.writeFileSync(context.cert, cert);

    // Binaries
    fs.writeFileSync(
      context.docker,
      mustache.render(TEMPLATES.docker, context),
      { mode: 0766 }
    );

    fs.writeFileSync(
      context.activate,
      mustache.render(TEMPLATES.activate, context),
      { mode: 0766 }
    );

    fs.writeFileSync(
      context.run,
      mustache.render(TEMPLATES.run, context),
      { mode: 0766 }
    );

    return context;
  });
}

function main(parser, args) {
  var dockerCLI, home;
  return setup()
    .then(function(_home) {
      home = _home;
      return exec('which docker');
    })
    .then(function(stdout) {
      var location = fsPath.join(home, args.alias);
      if (!args.force && fs.existsSync(location)) {
        console.error('Cannot override alias');
        process.exit(1);
      }
      mkdirp.sync(location);
      return initializeDockerAlias(
        stdout.trim(), args.alias, location, args.taskId
      );
    })
    .then(function(context) {
      console.log('Created alias run: source ', context.activate);
    })
    .catch(function(err) {
      console.error('Error setting up docker', err);
    });
}

module.exports = main;
