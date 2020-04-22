# Database
This database is a basic Postgress Docker container running on its own seperate droplet (server) on Digital Ocean.   
Server is running on IP `46.101.215.40`.  
Container is listening on port `5432`.

### Commands
To acces the server run:  
`ssh -i ssh_keys/ssh-key root@46.101.215.40`  
where `ssk_keys/ssh-key` is the path of the private ssh-key (you know where to find it).

To start the database/container, ssh to the server and, run:  
`Docker-compose up -d`  

To wipe the database clean and fresh, ssh to the server and run:  
`./clean`  
This will stop the container, prune all docker containers and volumes, and start a fresh container.

To restore the database from a .tar file, add the file to the server as `/db_backup/db-backup.tar` and run:  
`./restore`  
*Note*: The container has to be running and clean! (for easy cleaning, see above)

### Migration
The following explains how to migrate the database from our current server to this new server:

We have added a `migrate.sh` script to our currently running server, which creates a backup file of the database, copies it to the expected place on this server, and lastly ssh'es into this server to run the `restore.sh` script. 

For a smooth migration, now all we need to do is the following two 2 things: 
1. change the database path in the app to reference this server instead, and 
2. change the `deploy` script to run the .migrate.sh script, before restarting the app.
This will ensure that this new database is started with the newest possible data, before the app starts referencing this new database. This way, we ensure as little downtime as possible. 

**NOTE**: For this migration to work succesfully, it is very important that we run the `clean.sh` script on this server first before deploying! (ensuring that the container is both clean and running before deploying). We have choicen not to add this step as part of the deploy script, as we want to create as little downtime as possible. The more we can do before the deploy the better.

### What we did to set everything up:
**Adding a new server**  
We went on Digital Ocean and setup a new droplet, with the same ssh key that is available to our team on Digital Ocean. To access the new server, you therefore need this private ssh key. (Sidenote: It would have been use a Vagrant file to create the droplet, to avoid the following manual ssh'ing and installation on the server.)

To setup the server we needed to install `docker` and `docker-compose`. We did this by fetching the private ssh-key and then ssh'ing into the server and installing everything manually, using a random guide on the internet.

**Spinning up the container**  
Then we uploaded the same Docker-compose file of our current db, and added a `.env` file with the required variables, for setting up a postgress image with the same name, user and port expected by our application.

**Enabling migration**  
We added the `restore.sh` script and `clean.sh` script, which enables to startup the database container with data from a .tar file in `/db_backup/db-backup.tar`. 

Lastly we added the `migrate.sh` script to the old server, which will migrate data from the old server to this and run the restore script. Make sure to run `clean.sh` before running the migration. 
