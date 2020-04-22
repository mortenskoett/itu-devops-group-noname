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
We have added a `migrate.sh` script to our currently running server, which creates a backup file of the database, copies it to the expected place on this server, and runs the `restore.sh` script. 
For the migration to happen smoothly, all we need is to do is to 2 thigs: 
1. change the database path in the app to reference this server instead, and 
2. change the `deploy` script to run the .migrate.sh script, before restarting the app.
This will ensure that this new database is started with the newest possible data, before the app starts referencing this new database. This way, we ensure as little downtime as possible. 

**NOTE**: For this migration to work succesfully, it is very important that we run the `clean.sh` script on this server first before deploying! (ensuring that the container is both clean and running before deploying). We have choicen not to add this step as part of the deploy script, as we want to create as little downtime as possible. The more we can do before the deploy the better.

### What we did to set it up:
We went on Digital Ocean and setup a new droplet, with the same ssh key that is available to our team on Digital Ocean. In order to access it, you therefore need the private ssh key. (It would have been better to do this setup with a Vagrant file, to avoid the following manual ssh'ing and installation on the server.)

To setup the server we needed to install `docker` and `docker-compose`. We did this by fetching the private ssh-key and then ssh'ing into the server and installing everything manually, using a random guide on the internet.

Then we uploaded the same Docker-compose file of our current db, and added a `.env` file with the required variables, for setting up a postgress image with the same name, user and port expected by our application.

We then added the `restore.sh` script and `clean.sh` script, which enables to startup the database container with data from a .tar file in `/db_backup/db-backup.tar`. 
