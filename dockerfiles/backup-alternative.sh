#!/usr/bin/env bash
# Extremely dangerous, hardcoded and barebone backup script

set -eo pipefail

# $(date +%Y-%m-%d)

# Backup from host
backup() {
    echo "Backing up data..."
    # docker exec minitwit-db pg_dump -U embu -F t minitwit-db > super_backup.tar
    docker exec minitwit-db bash -c "pg_dump -U embu -F t minitwit-db > /db-backup/db_backup.tar"
    # docker exec minitwit-db bash -c "pg_dump -U embu -F t minitwit-db > /db-backup/db_backup_$(date +%Y-%m-%d).tar"
    docker cp minitwit-db:/db-backup/db_backup.tar /vagrant/db-backup/db_backup_$(date +%Y-%m-%d).tar
    echo "Backup done."
}

# Restore from host
restore() {
    if [ ! -f "$1" ]; 
    then
        echo "No arg given or file does not exist"
        exit 1
    fi

    echo "Backing up db..."
    backup

    echo "Deleting old database..."
    docker exec minitwit-db bash -c "dropdb -U embu minitwit-db"
    docker exec minitwit-db bash -c "createdb -U embu minitwit-db"

    echo "Restoring data..."
    docker cp $1 minitwit-db:/backup.tar
    docker exec -i minitwit-db pg_restore -U embu -d minitwit-db /backup.tar

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
        echo "backup                will backup minitwit-db to app root as backup.sql"
        echo "restore   <path>      will delete minitwit-db in docker and restore using <path>"
        exit 1
        ;;
esac

exit 0