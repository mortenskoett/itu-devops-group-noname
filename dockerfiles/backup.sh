#!/usr/bin/env bash
# Functionality to backup and restore postgres database in minitwit project. 
# Currently it is necessary to have an already established SSH connection to the backup sever if
# using the transfer functionality. The daemon backs up in a cycle starting from 1..$NO_OF_BACKUPS 
# meaning that there will at most be stored $NO_OF_BACKUPS redundant backups on the server.

set -eo pipefail

# Colors
RED='\033[0;31m'
WHITE='\033[0m'

# Db configuration
HOST_LOCATION="/db-backup"
BACKUP_NAME="db_backup.tar"
NO_OF_BACKUPS="3"   # Maximum number of redundant backups kept on the backup server

# Backup server confiuration
IP="home.oleandersen.net"
PORT="3322"
USER="devops"
BASE_DIR="minitwit-backup"

# TODO: Use  correct key - if using this key then it should be copied to backup server
# SSH_KEY="/vagrant/ssh_keys/id_rsa_frank"

# TODO: Remove before produciton. 
SSH_KEY="/home/mortenskoett/MEGAsync/ITU/MSc1/2_semester/repositories/devops/itu-group-noname-private/private/ssh_keys/ssh-key"



# Will create create local backup inside container
create_local_backup(){
    echo "Backing up data inside docker volume..."
    docker exec minitwit-db bash -c "pg_dump -U embu -F t minitwit-db > $HOST_LOCATION/$BACKUP_NAME"
}

# Copy data from docker backup to host
# arg1: Optional where to save the database dump if not at default location
copy_to_host() {
    if [ ! -z "$1" ]; 
    then
        LOCATION="$1$HOST_LOCATION"
    fi

    TIMESTAMP="$(date +%Y-%d-%m_kl_%H.%M.%S)"

    echo "Copying to host..."
    mkdir -p "$LOCATION"
    docker cp minitwit-db:"$HOST_LOCATION"/"$BACKUP_NAME" "$LOCATION"/"$BACKUP_NAME"

    echo "Writing timestamp..."
    echo "$TIMESTAMP" > "$LOCATION/timestamp"
}

# WARNING! VERY DESCTRUCTIVE.
# Will delete currently loaded database completely
delete_database() {
    echo "Deleting old database..."
    docker exec minitwit-db bash -c "dropdb -U embu minitwit-db"
    docker exec minitwit-db bash -c "createdb -U embu minitwit-db"
}

# Backup and make database dump (.tar) to given location
# arg1: optional location to save the backup on the host
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
    docker cp $1 minitwit-db:"$HOST_LOCATION"/restore_backup.tar                                          # copying data to container
    docker exec -i minitwit-db pg_restore -U embu -d minitwit-db "$HOST_LOCATION"/restore_backup.tar      # restoring from copied data
    echo "Restore done."
}

# Fetches ID of the most recently made backup from the backup server
# If no backup has previously been made then default ID of 0 is returned
fetch_newest_backup_id() {
    local NEWEST=$(ssh -p "$PORT" -i "$SSH_KEY" "$USER"@"$IP" "if [ -f $BASE_DIR/newest ]; then cat $BASE_DIR/newest; fi")
    [ ! -z "$NEWEST" ] && echo "$NEWEST" || echo "0"
}

generate_folder_id() {
    local NEWEST_BACKUP=$(fetch_newest_backup_id)
    echo $(( ($NEWEST_BACKUP % $NO_OF_BACKUPS) + 1 ))    # From 1 to $NO_OF_BACKUPS
}

# Start background daemon to backup at intervals
# arg1: Optional path to where the backups should be stored
# arg2: Time interval
# start_backup_daemon() {
# }

# Will transfer the locally stored data to an external server
# arg1: Optional prefix path to the database dump to be transferred
transfer_to_external() {
    echo "Transferring database dump to backup server..."
    local ID=$(generate_folder_id)
    local EXTERNAL_PATH="$BASE_DIR/$ID"
    local LOCAL_PATH="$1$HOST_LOCATION/"

    # Make sure directories exist
    ssh -p "$PORT" -i "$SSH_KEY" "$USER"@"$IP" "mkdir -p $EXTERNAL_PATH && echo $ID > $BASE_DIR/newest"

    # Transfer data from local to remote
	rsync -a -zz -P -e "ssh -i $SSH_KEY -p $PORT" "$LOCAL_PATH" "$USER"@"$IP":"$EXTERNAL_PATH"

    echo "Transfer completed. Newest backup: $ID/$NO_OF_BACKUPS."
}

case $1 in
    backup)
        backup $2 ;;
    restore)
        restore $2 ;;
    transfer)
        transfer_to_external $2;;
    start_daemon)
        start_backup_daemon $2 $3;;
    *)
        echo -e ${RED}"WARNING: If in doubt when calling these commands: read the script file. Otherwise could be fatal."${WHITE}
        echo -e "Usage:\n"
        echo "arg1              arg2            arg3             action"
        echo "backup            <opt path>                       create .tar dump of database and place it default '$HOST_LOCATION/$BACKUP_NAME' or optional at '<path>$HOST_LOCATION'."
        echo "transfer          <opt path>                       transfer db dump to backup server from default location '$HOST_LOCATION/$BACKUP_NAME' or optional from '<path>$HOST_LOCATION/$BACKUP_NAME'."
        echo "restore           <path>                           restore database from .tar dump found at <path>."
        echo "start_daemon      <opt path>      <interval>       starts daemon that will auto-backup every 3 rours."
        exit 1 ;;
esac

exit 0
