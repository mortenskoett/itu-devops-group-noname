#!/usr/bin/env bash
# Script to deploy and update code on Docker Swarm.

set -eo pipefail

# Settings
MANAGER="noname-0"
APPNAME="minitwit"
DEPLOY_FILE="docker-compose.yml"

# Colors
RED='\033[0;31m'
WHITE='\033[0m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'

login_dockerhub() {
    echo "Logging into Dockerhub using known credentials..."
    docker login --username="$DOCKER_USERNAME" --password="$DOCKER_PASSWORD"
}

push_to_dockerhub() {
    echo "Pushing docker images to Dockerhub..."
    docker-compose -f "$DEPLOY_FILE" push
}

build_images() {
    echo "Building docker images..."
    docker-compose -f "$DEPLOY_FILE" build
}

deploy_to_swarm() {
    echo "Deploying '$APPNAME' on '$MANAGER' using '$DEPLOY_FILE'..."
    echo -e ${YELLOW}"Did you remember to rebuild the models?"${WHITE}

    echo "Sending stack to manager node..."
    docker-machine scp "$DEPLOY_FILE" "$MANAGER":~/

    echo "Setting up applications..."
    docker-machine ssh "$MANAGER" docker stack deploy -c "$DEPLOY_FILE" "$APPNAME"

    echo -e ${GREEN}"Applications started successfully on Docker Swarm."${WHITE}
}

build_deploy() {
	build_images
	login_dockerhub
	push_to_dockerhub
	deploy_to_swarm
}

case $1 in
    deploy)
        deploy_to_swarm ;;
    build)
        build_images ;;
    push)
        push_to_dockerhub ;;
    login)
        login_dockerhub ;;
    build_deploy)
        build_deploy;;
    *)
        echo -e "Usage:"
        echo "arg            function"
        echo "deploy:        run or update code and deploy to swarm"
        echo "build:         build all docker images in $DEPLOY_FILE"
        echo "push:          pushes images to Dockerhub"
        echo "login:         login to Dockerhub using =\$DOCKER_USERNAME and \$DOCKER_PASSWORD"
        echo "build_deploy:  build all docker images in $DEPLOY_FILE, push to Dockerhub and deploy to DO"
        exit 1 ;;
esac
exit 0
