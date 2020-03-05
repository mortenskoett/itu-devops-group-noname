#! /usr/bin/env bash
# Script to help manage various actions using docker. See possible args in bottom.
# Dependencies: docker-ce postgres postgres-contrib

set -eo pipefail

# Colors
RED='\033[0;31m'
WHITE='\033[0m'

# Path to environment file w. key=value pairs
ENV=.env

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

# Build all images
build() {
    echo "Running build..."
    docker-compose -f ./db/docker-compose.yml build
    docker-compose -f ./app/docker-compose.yml build
    docker-compose -f ./test/python/docker-compose.yml build
    echo "Build done."
}

# Try to bring as much down as possible
down() {
    check_root
    echo "Taking all down..."

    NET_NAME="minitwit-net"
    DB_NAME="minitwit-db"
    if [ $(docker network ls | grep "$NET_NAME" | wc -l) -eq 1 ]; 
    then 
        echo "Disconnecting networks..."
        docker network disconnect "$NET_NAME" "$DB_NAME"
    fi

    docker-compose -f ./app/docker-compose.yml down
    docker-compose -f ./db/docker-compose.yml down
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
        run_app $2;;
    test)
        run_test;;
    db)
        run_db $2;;
    build)
        build;;
    down)
        down;;
    clean)
        clean;;
    status)
        status;;
    setup_run_test)
        setup_run_test;;
    setup_run_app)
        setup_run_app;;
    *)
        echo "Command not found." >&2
        exit 1
        ;;
esac

exit 0