dockerhost-client
=================

This is a prototype things are buggy and may require manual fiddling...
My goal here is to have some people try this and vet the idea of using a
model close to this for loaner machines... If this works then we can
make it nice !

## Requirements

 - node 0.10 or greater
 - TASKCLUSTER_CLIENT_ID must be set and valid
 - TASKCLUSTER_ACCESS_TOKEN must be set and valid
 - docker client (try `which docker`) >= 1.3

## Try me

Create global aliases

```sh
npm link
```

```sh
# tc-docker allows _multiple_ docker hosts specificied by alias (in this
# case the alias is remote) if this alias has not been created yet it
# provisions it on AWS then runs whatever commands you specify.
tc-docker remote ps
```

Things to test:

 - build times (try `tc-docker remote build ...`)
 - using docker-exec (requires docker client 1.3!)
 - -v (remember -v is not mounting from your local machine!)


## Other commands

See `tc-docker-admin` this contains the logic to create/manage the
directories which have the docker ssh keys, etc... The admin is very
incomplete but will allow you to "unstuck" yourself if tc-docker
breaks..

## But what if some other program is using the `docker` executable?

So you want to use your remote docker instance but the `docker` command
is expected to be used? Easy:

```sh
# Make sure your remote exists
tc-docker remote version
source ~/.tc-docker/remote/activate
```

Now when you invoke `docker` it shall use the remote docker instance.
