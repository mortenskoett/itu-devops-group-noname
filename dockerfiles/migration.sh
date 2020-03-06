#! /usr/bin/env bash

# OBS OBS TEMPORARY SCRIPT TO MIGRATE TO NEW DATABASE SETUP ONCE (Session6)

set -eo pipefail

############# does work on OLD code base #############
create_local_backup(){
    echo "Backing up data inside container..."
    docker exec minitwit-database bash -c "pg_dump -U embu -F t minitwit-database > /db-backup/db_backup_migrate.tar"
}

copy_to_host() {
    echo "Copying to host..."
    # docker cp minitwit-database:/db-backup/db_backup.tar /db-backup/db_backup_$(date +%Y-%d-%m_kl_%H.%M.%S).tar
    docker cp minitwit-database:/db-backup/db_backup_migrate.tar /db-backup/
}

backup() {
    create_local_backup
    copy_to_host
    echo "Backup done."
}

wait_for() {
    printf "$2 "
    for (( i = 0; i <= "$1"; i++ ))
    do 
        echo -n "$i "
        sleep 1
    done
    printf "done\n"
}

########## FLOW #############
# Tag app ned
echo "1. Stopping app..."
docker stop minitwit-app
docker stop elated_ramanujan

# backup db
echo "2. Doing backup..."
backup

wait_for 3 "Waiting..."

# tag db ned
echo "3. Taking old db down..."
docker stop minitwit-database

# start ny database
echo "4. Starting new db..."
./run.sh db -d

wait_for 7 "Waiting for db..."

# restore from backup to new db
echo "5. Restoring old data in new database...."
./backup restore /db-backup/db_backup_migrate.tar

wait_for 5 "Waiting for db..."

# setup ny app
echo "6. Running new app..."
./run.sh app -d