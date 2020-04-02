#!/usr/bin/env bash
# Functionality to backup and restore postgres database

set -eo pipefail

# Colors
RED='\033[0;31m'
WHITE='\033[0m'

# Locations/variables
HOST_LOCATION="/db-backup"
BACKUP_NAME="db_backup.tar"
NO_OF_BACKUPS="3"

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

# Make a cycle of 3 redundant backups based on current date assuming a backup is made every 24h
generate_folder_id() {
    local DAY_OF_MONTH=$(date +%d)
    echo $(( $DAY_OF_MONTH % $NO_OF_BACKUPS ))
}

# Will transfer the locally stored data to an external server
# arg1: Optional prefix path to the database dump to be transferred
transfer_to_external() {
    echo "Transferring database dump to backup server..."
	local IP="home.oleandersen.net"
	local PORT="3322"
	local USER="devops"
    local ID=$(generate_folder_id)

    local ROOT="minitwit-backup"
	local PATH_ON_EXTERNAL="$ROOT/$ID"
	local PATH_ON_LOCAL="$1$HOST_LOCATION/"

    # ssh -i /vagrant/ssh_keys/id_rsa_frank -p 3322 devops@home.oleandersen.net

    TEST_KEY="/home/mortenskoett/MEGAsync/ITU/MSc1/2_semester/repositories/devops/itu-group-noname-private/private/ssh_keys/ssh-key"

    # Transfer data from local to remote
	# rsync -az -P -e --delete "ssh -i /vagrant/ssh_keys/id_rsa_frank -p $PORT" "$PATH_ON_LOCAL" "$USER"@"$IP":"$PATH_ON_EXTERNAL/"

    ssh -p "$PORT" -i "$TEST_KEY" "$USER"@"$IP" "mkdir -p $PATH_ON_EXTERNAL && echo $ID > $ROOT/newest"
	rsync -a -zz -P -e "ssh -i $TEST_KEY -p $PORT" "$PATH_ON_LOCAL" "$USER"@"$IP":"$PATH_ON_EXTERNAL"
}

case $1 in
    backup)
        backup $2 ;;
    restore)
        restore $2 ;;
    transfer)
        transfer_to_external $2;;
    *)
        echo -e ${RED}"WARNING: If in doubt when calling these commands: read the script file. Otherwise could be fatal."${WHITE}
        echo -e "Usage:\n"
        echo "arg1              arg2            action"
        echo "backup            <opt path>      create .tar dump of database and place it default '$HOST_LOCATION/$BACKUP_NAME' or optional at '<path>/db-backup'."
        echo "transfer          <opt path>      transfer db dump to backup server from default location '$HOST_LOCATION/$BACKUP_NAME' or optional from '<path>/$HOST_LOCATION/$BACKUP_NAME/'."
        echo "restore           <path>          restore database from .tar dump found at <path>."
        exit 1
        ;;
esac

exit 0
