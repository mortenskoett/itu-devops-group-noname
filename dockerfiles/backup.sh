#!/usr/bin/env bash
# Functionality to backup and restore postgres database

set -eo pipefail

# Will create create local backup inside container
create_local_backup(){
    echo "Backing up data inside docker volume..."
    docker exec minitwit-db bash -c "pg_dump -U embu -F t minitwit-db > /db-backup/db_backup.tar"
}

# Copy data from docker backup to host
# arg1: Optional where to save the database dump if not at default location
copy_to_host() {
    local LOCATION="/db-backup"

    if [ ! -z "$1" ]; 
    then
        LOCATION="$1"$LOCATION""
    fi

    echo "Copying to host..."
    mkdir -p "$LOCATION"
    docker cp minitwit-db:/db-backup/db_backup.tar "$LOCATION"/db_backup_$(date +%Y-%d-%m_kl_%H.%M.%S).tar
}

# Will delete currently loaded database completely
# WARNING! Very desctructive.
delete_database() {
    echo "Deleting old database..."
    docker exec minitwit-db bash -c "dropdb -U embu minitwit-db"
    docker exec minitwit-db bash -c "createdb -U embu minitwit-db"
}

# Backup and make database dump (.tar) to given location
backup() {
    create_local_backup
    copy_to_host $1
    echo "Backup done."
}

# Restore from .tar database dump
# arg1: location of the database dump to restore from (.tar)
restore() {
    if [ ! -f "$1" ]; 
    then
        echo "No arg given or file does not exist"
        exit 1
    fi
    create_local_backup
    delete_database

    echo "Restoring data..."
    docker cp $1 minitwit-db:/db-backup/restore_backup.tar      # copying data to container
    docker exec -i minitwit-db pg_restore -U embu -d minitwit-db /db-backup/restore_backup.tar      # restoring from copied data
    echo "Restore done."
}

case $1 in
    backup)
        backup $2 ;;
    restore)
        restore $2 ;;
    *)
        echo -e "Usage:\n"
        echo "arg1      arg2            action"
        echo "backup    <optional path> will create .tar dump of database and place it default at /db-backup or optional at <path>/db-backup."
        echo "restore   <path>          will restore database from .tar dump found at <path>."
        exit 1
        ;;
esac

exit 0