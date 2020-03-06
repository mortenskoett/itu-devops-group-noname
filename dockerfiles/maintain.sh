#!/usr/bin/env bash
# Various functionality to make our life easier

set -eo pipefail

# Simple check if arg is empty
check_arg() {
    if [ -z "$1" ]; 
    then
        echo "No arg given"
        exit 1
    fi
}

# Enter a docker volume to inspect the data
# arg1: name of existing docker volume
open_volume() {
    check_arg $1

    local VOLUME_EXISTS="$(docker volume ls | grep "$1" | wc -l)"

    if [ "$VOLUME_EXISTS" -eq 0 ];
    then
        echo "Volume doesn't exist. Check volume name:"
        docker volume ls
        exit 1
    fi

    echo "Starting container..."
    echo "Volume mounted in /"$1""
    docker run -it --rm -v $1:/$1 alpine
}

case $1 in
    open_volume)
        open_volume $2 ;;
    *)
        echo -e "Usage:\n"
        echo "arg1          arg2        action"
        echo "open_volume   <name>      opens a temporary container where the volume is mounted in /<name>."
        exit 1
        ;;
esac

exit 0