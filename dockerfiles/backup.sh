#!/usr/bin/env bash
# Extremely dangerous, hardcoded and barebone backup script

set -eo pipefail

# Backup from host
backup() {
    echo "Backing up data..."
    docker exec minitwit-db pg_dump -U embu minitwit-db > backup.sql
}

# Restore from host
restore() {
    if [ ! -f "$1" ]; 
    then
        echo "No arg given or file does not exist"
        exit 1
    fi

    echo "Restoring data..."
    docker exec -i minitwit-db psql -U embu -d minitwit-db -c \
        "DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;" &&
    docker exec -i minitwit-db psql -U embu -d minitwit-db < $1
}

case $1 in
    backup)
        backup $2 ;;
    restore)
        restore $2 ;;
    *)
        echo -e "Usage:\n"
        echo "arg1      arg2        action"
        echo "backup                will backup minitwit-db to app root as backup.sql"
        echo "restore   <path>      will delete minitwit-db in docker and restore using <path>"
        exit 1
        ;;
esac

exit 0