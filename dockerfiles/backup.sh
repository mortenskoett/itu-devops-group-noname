#!/usr/bin/env bash
# Functionality to backup and restore postgres database

set -eo pipefail

# Validates that given argument is valid
# arg1: path/file
validate_arg() {
    if [ ! -f "$1" ]; 
    then
        echo "No arg given or file does not exist"
        exit 1
    fi
}

# Will create create local backup inside container
create_local_backup(){
    echo "Backing up data inside docker volume..."
    docker exec minitwit-db bash -c "pg_dump -U embu -F t minitwit-db > /db-backup/db_backup.tar"
}

# Copy data from docker backup to host
# arg1: location to save the backup
copy_to_host() {
    echo "Copying to host..."
    docker cp minitwit-db:/db-backup/db_backup.tar "$1"/db_backup_$(date +%Y-%m-%d).tar
}

# Will delete currently loaded database completely
# WARNING! Very desctructive.
delete_database() {
    echo "Deleting old database..."
    docker exec minitwit-db bash -c "dropdb -U embu minitwit-db"
    docker exec minitwit-db bash -c "createdb -U embu minitwit-db"
}

# Backup and make database dump (.tar) to given location
# arg1: location to save the backup
backup() {
    create_local_backup
    copy_to_host $1
    echo "Backup done."
}

# Restore from .tar database dump
# arg1: location of the database dump to restore from (.tar)
restore() {
    validate_arg "$1"
    create_local_backup
    delete_database

    echo "Restoring data..."
    docker cp $1 minitwit-db:/db-backup/restore_backup.tar
    docker exec -i minitwit-db pg_restore -U embu -d minitwit-db /db-backup/restore_backup.tar
    echo "Restore done."
}

case $1 in
    backup)
        backup $2 ;;
    restore)
        restore $2 ;;
    *)
        echo -e "Usage:\n"
        echo "arg1      arg2        action"
        echo "backup    <path>      will create .tar dump of database and place it at <path>."
        echo "restore   <path>      will restore database from .tar dump found at <path>."
        exit 1
        ;;
esac

exit 0