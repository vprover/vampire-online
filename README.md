# vampire-online

This is a web interface for [vampire](https://vprover.github.io/).

## Frontend

React application created with create-react-app.

## Backend

NodeJs/Express thin server making calls to a vampire binary.

## Deployment

Both parts are deployed using docker containers.  

### Prerequisites

* Access to a container registry (e.g. [dockerhub](https://hub.docker.com/)) where you can push and/or pull images.  

#### Local

* Docker daemon

#### Remote/Deploy Machine

* Docker daemon
* Docker compose

### Steps
If the images you wish to deploy are already available on a remote repository you may skip steps 1 and 2.

**Assuming both frontend and backend will be deployed on the same machine.**  
1. Build and tag the images
    ```
    docker build -t <image_name>:<release_tag> ./<frontend|backend>
    ```
2. Push the images to the container registry
    ```
    docker push -t <image_name>:<release_tag>
    ```
3. Update _docker-compose_ to use the name and tag from build and transfer it to the remote machine
4. Spin up the containers on the remote machine
    ```
    docker-compose up -d
    ```
    To stop an already running version and remove the images used for that use
    ```
    docker-compose down --rmi all
    ```
The _deploy_ script will take care of all those steps for you. Make sure to update the details of the deployment machine and that you have ssh access to it.

**If they should be deployed separately split the _docker-compose_ in two (one for each service) and transfer them to the desired machines.**