#! /bin/bash

set -e 
set -o pipefail

# Path to environment file w. key=value pairs
ENV=.env

if [ -f "$ENV" ]; then
    echo "Loading environment..."
    set -a
    source "$ENV"
    set +a
fi

# arg1: message
# arg2: time to wait
wait_for() {
    echo "$2"
    for (( i = 0; i < "$1"; i++ ))
    do 
        echo "$i"
        sleep 1
    done
}

run_app() {
    echo "Running app..."
    cd app/
    docker-compose up
}

run_test() {
    echo "Running test"
    cd test/python
    docker-compose up 
}

run_db() {
    echo "Running db..."
    cd db/
    docker-compose up
}

build() {
    echo "Running build..."
    docker-compose -f ./app/docker-compose.yml build
    docker-compose -f ./test/python/docker-compose.yml build
    docker-compose -f ./db/docker-compose.yml pull
}

down() {
    echo "Take all down..."
    docker network disconnect minitwit-net minitwit-db
    docker-compose -f ./app/docker-compose.yml down
    docker-compose -f ./test/python/docker-compose.yml down
    docker-compose -f ./db/docker-compose.yml down
}

clean() {
    echo "Running cleaning..."
    docker container prune
}

setup_and_run_test() {
    echo "Setting up and running python test..."
    run_db &
    wait_for 10 "Waiting for database..."
    run_app &
    wait_for 10 "Waiting for application..."
    run_test

    if [ $? -eq 0 ]
    then
        echo "The tests passed."
        return 0
    else
        echo "The tests failed." >&2
        return 1
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
    full_test)
        setup_and_run_test
        ;;
    *)
        echo "Command not found." >&2
        exit 1
esac