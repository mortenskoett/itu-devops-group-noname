#! /usr/bin/env bash
# Script to help manage various actions using docker. See possible args in bottom.
# Dependencies: docker-ce postgres postgres-contrib

set -eo pipefail

# Colors
RED='\033[0;31m'
WHITE='\033[0m'

# Path to environment file w. key=value pairs
ENV=.env

# Env variables
NET_NAME="minitwit-net"
DB_NAME="minitwit-db"

# Load .env if exists, otherwise use environment variables
if [ -f "$ENV" ]; then
    echo "Loading environment..."
    LOCAL_RUN="true"
    set -a
    source "$ENV"
    set +a
fi

# Return exit 1 if root
check_root() {
    if [ $(whoami) = "root" ];
    then 
        echo "Operation denied: this is not be possible as root."
        exit 1
    fi
}

# Sleep thread
# arg1: time to wait, arg2: message
wait_for() {
    printf "$2 "
    for (( i = 0; i <= "$1"; i++ ))
    do 
        echo -n "$i "
        sleep 1
    done
    printf "done\n"
}

# Run app w/o dependencies
# arg1: Optional flags to docker-compose
run_app() {
    echo "Running app..."
    docker-compose -f ./app/docker-compose.yml up $1
}

# Run python pytest suite w/o dependencies
# arg1: Optional flags to docker-compose
run_test() {
    echo "Running test..."
    docker-compose -f ./test/eslint/docker-compose.yml up
    docker-compose -f ./test/python/docker-compose.yml up \
        --abort-on-container-exit \
        --exit-code-from minitwit-python-test
}

# Start up db
# arg1: Optional flags to docker-compose
run_db() {
    echo "Running db..."
    docker-compose -f ./db/docker-compose.yml up $1
}

# Start up monitoring services
# arg1: Optional flags to docker-compose
run_monitor() {
    echo "Running monitoring..."
    docker-compose -f ./monitoring/docker-compose.yml up $1
}

# Build all images
build() {
    echo "Running build..."
    docker-compose -f ./db/docker-compose.yml build
    docker-compose -f ./app/docker-compose.yml build
    docker-compose -f ./monitoring/docker-compose.yml build
    docker-compose -f ./test/python/docker-compose.yml build
    docker-compose -f ./test/eslint/docker-compose.yml build
    echo "Build done."
}

# Push images to Dockerhub
push() {
    echo "Logging in to Dockerhub..."
    docker login --username="$DOCKER_USERNAME" --password="$DOCKER_PASSWORD"

    echo "Pushing images to Dockerhub..."
    docker push $DOCKER_USERNAME/minitwit-app
    docker push $DOCKER_USERNAME/minitwit-eslint
    docker push $DOCKER_USERNAME/minitwit-test
    docker push $DOCKER_USERNAME/minitwit-prometheus
}

pull() {
    echo "Logging in to Dockerhub..."
    docker login --username="$DOCKER_USERNAME" --password="$DOCKER_PASSWORD"

    echo "Pulling latest images from Dockerhub..."
    docker-compose --file ./app/docker-compose.yml pull
    docker-compose --file ./db/docker-compose.yml pull
    docker-compose --file ./monitoring/docker-compose.yml pull
}

# Try to bring as much down as possible
down() {
    check_root
    echo "Taking everything down..."

    if [ $(docker network ls | grep "$NET_NAME" | wc -l) -eq 1 ]; 
    then 
        echo "Stopping containers..."
        CONTAINER_IDS=$(docker ps | awk 'FNR > 1 {print $1}')

        for ID in "$CONTAINER_IDS"
        do
            docker stop $ID
        done
    fi

    echo "Disconnecting networks..."
    docker-compose -f ./monitoring/docker-compose.yml down
    docker-compose -f ./db/docker-compose.yml down
    docker-compose -f ./app/docker-compose.yml down

    echo "Down done."
}

# Try to clean up as much as possible
clean() {
    check_root
    echo "Running clean..."
    docker image prune
    docker container prune
    docker network prune
    docker volume prune
    echo "Clean done."
}

status() {
    docker container ls
    echo
    docker volume ls
    echo
    docker network ls
}

# Setup and run application and database
setup_run_app() {
    echo "Setting up database and nodejs application."
    run_db "-d"
    wait_for 8 "Waiting for database..."
    run_app "-d"
    wait_for 6 "Waiting for application..."
    echo "Application and database is started sucessfully."
}

# Setup up all dependencies and run python pytest suite
setup_run_test() {
    echo "Setting up env and running python test..."
    echo -e "${RED}Did you remember to rebuild docker images?${WHITE}"
    setup_run_app
    run_test

    if [ $? -eq 0 ]
    then
        echo "The tests passed."
        exit 0
    else
        echo "The tests failed." >&2
        exit 1
    fi
}

case "$1" in
    app)
        run_app $2 ;;
    test)
        run_test ;;
    db)
        run_db $2 ;;
    monitor)
        run_monitor $2 ;;
    build)
        build ;;
    push)
        push ;;
    pull)
        pull ;;
    down)
        down ;;
    clean)
        clean ;;
    status)
        status ;;
    setup_run_test)
        setup_run_test ;;
    setup_run_app)
        setup_run_app ;;
    *)
        echo "Usage:"
        echo "cd ./dockerfiles"
        echo -e "./run.sh <arg> <opt>\n"

        echo "<arg>         <opt>       <action>"
        echo "app           -d          run app container"
        echo "test          -d          run python test container"
        echo "db            -d          run postgres database container"
        echo "monitor       -d          run monitor aka prometheus/grafana container"
        echo "build                     rebuild all images"
        echo "push                      push newest docker images to Dockerhub"
        echo "pull                      pull latest docker images from Dockerhub"
        echo "clean                     remove everything to get a clean slate"
        echo "down                      take everything down"
        echo "status                    show status of docker setup"
        echo "setup_run_app             setup a complete running application incl database"
        echo "setup_run_test            setup a complete testing setup and run python tests"
        exit 1
        ;;
esac

exit 0