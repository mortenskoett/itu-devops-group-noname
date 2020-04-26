#!/usr/bin/env bash
# Script to deploy to Docker Swarm.

set -eo pipefail

# Settings
MANAGER="node-0"
APPNAME="minitwit"
DEPLOY_FILE="docker-stack-deploy.yml"

echo "Building docker images..."
docker-compose -f "$DEPLOY_FILE" build

echo "Pushing docker images to Dockerhub..."
docker-compose -f "$DEPLOY_FILE" push

echo "Sending stack to manager node..."
docker-machine scp "$DEPLOY_FILE" "$MANAGER":~/

echo "Setting up applications..."
docker-machine ssh "$MANAGER" docker stack deploy -c "$DEPLOY_FILE" "$APPNAME"

echo -e ${GREEN}"Applications started successfully on Docker Swarm."${WHITE}