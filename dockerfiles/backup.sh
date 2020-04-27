#!/usr/bin/env bash
# Functionality to backup and restore postgres database in minitwit project. 
# Currently it is necessary to have an already established SSH connection to the backup sever if
# using the transfer functionality. The daemon backs up in a cycle starting from 1..$NO_OF_BACKUPS 
# meaning that there will at most be stored $NO_OF_BACKUPS redundant backups on the server.

set -eo pipefail

# Colors
RED='\033[0;31m'
WHITE='\033[0m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'

# Db configuration
BACKUP_LOCATION="/db-backup"        # Default location of where database backups archives are stored
BACKUP_NAME="db_backup.tar"         # Name of database backup archive
NO_OF_BACKUPS="3"                   # Maximum number of redundant backups kept on the backup server
LOG_LOCATION="backup_daemon.log"    # Daemon log
PID_LOCATION="backup_daemon.pid"    # Used to hold PID of daemon

# Backup server confiuration
IP="home.oleandersen.net"
PORT="3322"
USER="devops"
BASE_DIR="minitwit-backup"
SSH_KEY="/vagrant/ssh_keys/id_rsa_backup"

# Returns a timestamp
create_timestamp() {
    echo "$(date +%Y-%d-%m_kl_%H.%M.%S)"
}

# Will create create local backup inside container
create_local_backup(){
    echo "Backing up data inside docker volume..."
    docker exec minitwit-db bash -c "pg_dump -U embu -F t minitwit-db > $BACKUP_LOCATION/$BACKUP_NAME"
}

# Copy data from docker backup to host
# arg1: Optional where to save the database dump if not at default location
copy_to_host() {
    echo "Copying to host..."

    HOST_LOCATION="$1$BACKUP_LOCATION"
    TIMESTAMP="$(create_timestamp)"
    echo "Using host location: '$HOST_LOCATION/$BACKUP_NAME'"

    mkdir -p "$HOST_LOCATION"
    docker cp minitwit-db:"$BACKUP_LOCATION"/"$BACKUP_NAME" "$HOST_LOCATION"/"$BACKUP_NAME"

    echo "Writing timestamp..."
    echo "$TIMESTAMP" > "$HOST_LOCATION/timestamp"
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
    echo "backup: $1"
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
    docker cp $1 minitwit-db:"$BACKUP_LOCATION"/restore_backup.tar                                          # copying data to container
    docker exec -i minitwit-db pg_restore -U embu -d minitwit-db "$BACKUP_LOCATION"/restore_backup.tar      # restoring from copied data
    echo "Restore done."
}

# Fetches ID of the most recently made backup from the backup server
# If no backup has previously been made then default ID of 0 is returned
fetch_newest_backup_id() {
    local NEWEST=$(ssh -p "$PORT" -i "$SSH_KEY" "$USER"@"$IP" "if [ -f $BASE_DIR/newest ]; then cat $BASE_DIR/newest; fi")
    [ ! -z "$NEWEST" ] && echo "$NEWEST" || echo "0"
}

# Generates next ID based on what the ID of the newest backup is
# This makes it possible to maintain n redundant backups
generate_folder_id() {
    local NEWEST_BACKUP=$(fetch_newest_backup_id)
    echo $(( ($NEWEST_BACKUP % $NO_OF_BACKUPS) + 1 ))    # From 1 to $NO_OF_BACKUPS
}

# Will transfer the locally stored data to an external server
# arg1: Optional prefix path to the database dump to be transferred
transfer_to_external() {
    echo "Transferring database dump to backup server..."
    local ID=$(generate_folder_id)
    local EXTERNAL_PATH="$BASE_DIR/$ID"
    local LOCAL_PATH="$1$BACKUP_LOCATION/"

    # Make sure directories exist
    ssh -p "$PORT" -i "$SSH_KEY" "$USER"@"$IP" "mkdir -p $EXTERNAL_PATH && echo $ID > $BASE_DIR/newest"

    # Transfer data from local to remote
	rsync -a -zz -P -e "ssh -i $SSH_KEY -p $PORT" "$LOCAL_PATH" "$USER"@"$IP":"$EXTERNAL_PATH"

    echo "Transfer completed. Newest backup: $ID/$NO_OF_BACKUPS."
}

# Checks whether daemon is already running and tries to handle it
# If it is running the script exists. 
# If the PID file exists and the process CAN be found, the PID file is updated w. matching PID and exits
# If the PID file exists but the process CAN'T be found the PID file is deleted and script continues
check_if_daemon_running() {
    if [ -f "$PID_LOCATION" ];                              # PID file exists
    then
        PID=$(cat $PID_LOCATION)
        IS_RUNNING=$(ps -p $PID | sed -n '2p') || echo -n ""   # Is process running otherwise return empty string

        if [ ! -z "$IS_RUNNING" ];
        then 
            echo "Backup daemon is already running... Exiting."
            exit 1
        else
            echo -e ${RED}"'$PID_LOCATION' exists but process $PID not found running."${WHITE}
            echo "Trying to find PID from process name..."
            PID=$(ps aux | egrep "bash ./backup.sh start" | head -1 | awk 'FNR > 0 {print $2}') || echo -n ""

            if [ ! -z $PID ]; 
            then
                echo "Process found. Updating $PID_LOCATION file..."
                echo $PID > $PID_LOCATION
                echo "Exiting."
                exit 1
            else
                echo "Process still not found, deleting $PID_LOCATION file."
                rm $PID_LOCATION
                echo -e ${YELLOW}"You should probably check that there are not 2 different daemons running."${WHITE}
                echo "Continuing..."
            fi
        fi
    fi
}

# Start background daemon to backup at intervals
# arg1: Time interval in MINUTES
# arg2: Optional path to where the backups should be stored
start_backup_daemon() {
    echo "Starting backup daemon..."

    check_if_daemon_running

    if [ -z "$1" ];
    then
        echo "Using default 180 min interval..."
        SLEEP_MINUTES="$(( 180 * 60 ))"
    else
        echo "Using $1 minute intervals..."
        SLEEP_MINUTES="$(( "$1" * 60 ))"
    fi

    # Run in subshell detached from user
    (
        while (true);
        do
            echo -e "\n[$(create_timestamp)] Backup started."
            backup "$2"
            transfer_to_external "$2"
            echo "[$(create_timestamp)] Backup ended. Going to sleep..."
            sleep $SLEEP_MINUTES
        done
    ) &>>"$LOG_LOCATION" &               # Print to log file

    echo "$!" > "$PID_LOCATION"         # Process id of current backup job
    disown

    echo -e ${GREEN}"Backup daemon started sucessfully."${WHITE}
    echo "Do not delete file $PID_LOCATION while daemon is running."
    echo "See log output in file $LOG_LOCATION to verify dameon is running correctly."
}

# Stops the backup daemon by looking into the PID_LOCATION and then try to kill that PID
# Will right now show a warning if the PID is not running. Should be fixed.
stop_backup_daemon() {
    echo "Stopping backup daemon..."

    [ -f "$PID_LOCATION" ] \
        && echo "PID file found..." \
        && (kill $(cat $PID_LOCATION) || exit 0) \
        && echo "Removing '$PID_LOCATION'..." && rm "$PID_LOCATION" \
        && echo -e ${RED}"Daemon sucessfully stopped."${WHITE} \
        || echo "File '$PID_LOCATION' not found in current directory, nothing to stop. Continuing." && exit 0
}

case $1 in
    backup)
        backup $2 ;;
    restore)
        restore $2 ;;
    transfer)
        transfer_to_external $2 ;;
    start)
        start_backup_daemon $2 $3 ;;
    stop)
        stop_backup_daemon ;;
    *)
        echo -e ${RED}"WARNING: If in doubt when calling these commands: read the script file. Otherwise could be fatal."${WHITE}
        echo -e "Usage:\n"
        echo "arg1              arg2                arg3                action"
        echo "backup            <opt path>                              create .tar dump of database and place it default '$BACKUP_LOCATION/$BACKUP_NAME' or optional at '<path>$BACKUP_LOCATION'.*"
        echo "transfer          <opt path>                              transfer db dump to backup server from default location '$BACKUP_LOCATION/$BACKUP_NAME' or optional from '<path>$BACKUP_LOCATION/$BACKUP_NAME'.*"
        echo -e "restore           <path>                                  ${RED}[WARNING]${WHITE} restore database from .tar dump found at <path>."
        echo "start             <opt interval>      <opt path>          starts daemon in background backing up at <internal> minutes. Default is 3 hours. Remember to stop again if run locally.*"
        echo "stop                                                      tries to stop daemon using last known PID and removes $PID_LOCATION file."

        echo -e "\n*Use <opt path> when testing locally, e.g. simply a dot to indicate the directory from which you are calling the script: '.'"

        echo -e "\nExamples: (Warning right now this will overwrite production backups if any!)"
        echo "'$ ./backup.sh start . 20' will start backup daemon w. 20 minutes interval using current directory for local backups before sending to backup server"
        exit 1 ;;
esac

exit 0
