#! /bin/bash
# Script to help manage various actions using docker. See possible args in bottom.

# set -eo pipefail

# Path to environment file w. key=value pairs
ENV=.env

LOCAL_RUN="false"
CONTEXT=$(pwd)

# Load .env if exists, otherwise use environment variables
if [ -f "$ENV" ]; then
    echo "Loading environment..."
    LOCAL_RUN="true"
    set -a
    source "$ENV"
    set +a
fi

# Helper method to sleep thread
# arg1: message
# arg2: time to wait
wait_for() {
    echo "$2"
    for (( i = 0; i <= "$1"; i++ ))
    do 
        echo -n "$i "
        sleep 1
    done
}

# Run app w/o dependencies
run_app() {
    echo "Running app..."
    cd app/
    docker-compose up
}

# Run python pytest suite w/o dependencies
run_test() {
    echo "Running test..."
    cd test/python/
    docker-compose up \
        --abort-on-container-exit \
        --exit-code-from minitwit-python-test
}

# Start up db
run_db() {
    echo "Running db..."
    cd db/
    docker-compose up
}

# Build all images
build() {
    echo "Running build..."
    docker-compose -f ./app/docker-compose.yml build
    docker-compose -f ./test/python/docker-compose.yml build
    docker-compose -f ./db/docker-compose.yml pull
    echo "Build done."
}

# Try to bring as much down as possible
down() {
    echo "Taking all down..."
    docker network disconnect minitwit-net minitwit-db
    docker-compose -f ./app/docker-compose.yml down
    docker-compose -f ./test/python/docker-compose.yml down
    docker-compose -f ./db/docker-compose.yml down
    echo "Down done."
}

# Try to clean up as much as possible
# Should only be used in testing/locally
clean() {
    cd "$CONTEXT"
    down
    echo "Running clean..."
    sudo sh -c "rm -rf ../db-data/"     # unsafe use of sudo
    docker stop $(docker ps -a -q)
    echo y | docker rm $(docker ps -a -q)
    echo y | docker container prune
    echo y | docker network prune
    echo "Clean done."
}

# Setup and run application and database
setup_run_app() {
    echo "Setting up database and nodejs application."
    run_db &
    wait_for 8 "Waiting for database..."
    run_app &
    wait_for 6 "Waiting for application..."
    echo "\nApplication and database running."
}

# Setup up all dependencies and run python pytest suite
setup_run_test() {
    echo "Setting up env and running python test..."
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
        run_app
        ;;
    test)
        run_test
        ;;
    db)
        run_db
        ;;
    build)
        build
        ;;
    clean)
        clean
        ;;
    down)
        down
        ;;
    setup_run_test)
        setup_run_test
        ;;
    setup_run_app)
        setup_run_app
        ;;
    *)
        echo "Command not found." >&2
        exit 1
esac

exit 0