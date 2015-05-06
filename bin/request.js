var taskcluster = require('taskcluster-client');
var queue = new taskcluster.Queue();
var slugid = require('slugid');

/**
Some templates we reuse...
*/
var created = new Date();
var deadline = new Date(created.valueOf() + 3600 * 1000);
var task = {
  provisionerId: 'aws-provisioner-v1',
  schedulerId: 'task-graph-scheduler',
  taskGroupId: slugid.v4(),
  created: created.toJSON(),
  deadline: deadline.toJSON(),
  payload: {},
  metadata: {
    name: 'Create a docker host',
    description: 'Spawn a docker host',
    owner: 'jlal@mozilla.com',
    source: 'https://github.com/lightsofapollo/dockerhost-client'
  }
};

function main(parser, args) {
  var listener = new taskcluster.WebListener();
  var queueEvents = new taskcluster.QueueEvents();
  var taskId = slugid.v4();

  listener.bind(queueEvents.taskCompleted({
    taskId: taskId
  }));

  task.workerType = args.workerType;

  listener.resume().then(function() {
    return queue.createTask(taskId, task);
  }).catch(function(err) {
    console.error('Error creating task:');
    console.error(err.stack);
  });

  listener.on('message', function() {
    process.stdout.write(taskId);
    process.exit();
  });
}

module.exports = main;
