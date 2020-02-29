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

app() {
    echo "Running app..."
    cd app/
    docker-compose up
}

test() {
    echo "Running test"
    cd test/python
    docker-compose up 
}

db() {
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
    docker-compose -f ./app/docker-compose.yml down
    docker-compose -f ./test/python/docker-compose.yml down
    docker-compose -f ./db/docker-compose.yml down
}

clean() {
    echo "Running cleaning..."
    docker container prune
}

case "$1" in
    app)
        app
        ;;
    test)
        test
        ;;
    db)
        db
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
    *)
        echo "Command not found." >&2
        exit 1
esac

exit 0