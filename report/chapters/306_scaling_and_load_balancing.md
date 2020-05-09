## 3.06 Scaling and Load Balancing

### Migrating Postgres database to separate node
As previously described the system started out using an Sqlite database, with the data at some point being migrated to a Postgres database for various reasons discussed in <//TODO: insert chapter>. Both of these were deployed alongside the application on the same node on Digital Ocean (DO).

In order to make the system more scalable it was decided to have the database deployed externally from the application server with the intention of being able to scale the application horizontally while still using the single database instance.
We therefore chose to migrate our existing database one more time, this time from the application node to another node on DO. 

The operation was executed using much of the already written scripts used when we migrated from the SQlite database to the Postgres database. 
Once again we were very keen on missing as few as possible requests while the actual physical migration of the database took place. 

To do the migration a script was written that would copy the contents of the database and transfer it to the new database node. When the database dump was succesfully transferred to the node, 
the script would then proceed to copy the data to the docker container running on the node, before migrating the data to the already running instance of the database in the docker container.
Because the database did not contain any data already, the dreaded step of actively deleting everything on the running database could be left out. Since the IPs pointing to the database from the
application server was already set, the database migration at this point was a success and the app could be restarted/re-deployed.

In order to run this migration as fast and as seamless as possible a deployment script handled the execution of the migration script so that when we changed our code to use the external database, we would first migrate the database and then deploy the new code. 
In this way our system did not have any downtime but we lost a bit of data as it took around 30 seconds to migrate the database. We lost the data for the requests that we recieved between starting the migration and deploying our code to make use of the new database. We found the migration to be fairly smooth and succesful.

If considering this as a sub-optimal solution, given that there is any down-time in the migration, an optimal solution would have been to be able to migrate without down-time at all.
This however we didn't spend much time considering how could be done.

### Docker Swarm
In order to make our system scalable and ... resistent we decided to make use of Docker Swarm. We decided on Docker Swarm instead of using a load balancer because ... .

---
[ [prev page](../chapters/305_sec_assessment.md) | [table of content](../table_of_content.md) | [next page](../chapters/400_lessons_learned_perspective.md) ]