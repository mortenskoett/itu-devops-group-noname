BACKUP_LOCATION="/db-backup"        # Default location of where database backups archives are stored
BACKUP_NAME="db_backup.tar"         # Name of database backup archive
SSH_KEY="/vagrant/ssh_keys/ssh-key"
user="root"
address="64.225.111.21"

migrate() {
    docker exec minitwit-db bash -c "pg_dump -U embu -F t minitwit-db > $BACKUP_LOCATION/$BACKUP_NAME"

    docker cp minitwit-db:"$BACKUP_LOCATION"/"$BACKUP_NAME" "$BACKUP_LOCATION"/"$BACKUP_NAME"

    # Make sure directories exist
    ssh -i "$SSH_KEY" "$user"@"$address" "mkdir -p $BACKUP_LOCATION"

    # Transfer data from local to remote
    rsync -a -zz -P -e "ssh -i $SSH_KEY" "$BACKUP_LOCATION/" "$user"@"$address":"$BACKUP_LOCATION"
}

restore() {
    ssh -i "$SSH_KEY" "$user"@"$address" "./restore.sh"
}

migrate
restore
