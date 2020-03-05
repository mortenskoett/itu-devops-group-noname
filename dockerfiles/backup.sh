#!/usr/bin/env sh
# Extremely dangerous, hardcoded and barebone backup script

set -eo pipefail

# Backup from host
backup() {
    echo "Backing up data..."
    docker exec minitwit-db pg_dump -U embu minitwit-db > backup.sql
}

# Restore from host
restore() {
    echo "Restoring data..."
    docker exec -i minitwit-db psql -U embu -d minitwit-db -c \
        "DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;" &&
    docker exec -i minitwit-db psql -U embu -d minitwit-db < backup.sql
}

case $1 in
    backup)
        backup
        ;;
    restore)
        restore
        ;;
    *)
        echo "Command not found." >&2
        exit 1
        ;;
esac

exit 0