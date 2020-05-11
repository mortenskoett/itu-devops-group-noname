## 3.06 Scaling and Load Balancing
Here our experiences with up-scaling and migrating parts of the application are described.

### Database migration
Early in the course of the project we migrated all data from the Sqlite database to a Postgres database with minimal down-time and minimal loss of data being the primary focus of the migration. This meant that the goal was to automate the process to a degree such that it was a matter of initiating the process with the click of one button and a question of measuring the down-time in clock-cycles not human error.

A script to automate this `backup.sh` was written to copy data from containers to nodes and to transfer the data from x to y with built-in data-redundancy such that should one transfer be corrupted then another copy of the data should still be there.
This script was also used to make backups to an external server. See section [203 - Interactions of Subsystems](../chapters/203_interactions_of_subsystems.md).

Since a backup is not a valid backup without the tested ability of restoring the data back to the source, functionality to restore data was also implemented.

Finally it was a matter of timing the execution of the backup script with bringing down the old application, copying data, bringing up the new application and migrate data to the new database. Due to the docker setup it was possible to test these steps locally and feel assured of their functionality before trying it out on the server.

#### Migrating Postgres database to separate node
In order to make the system more scalable it was decided to have the database deployed externally from the application server with the intention of being able to scale the application horizontally while still using the single database instance.
We therefore chose to migrate our existing database one more time, this time from the node running the application to a separate node on Digital Ocean (DO). 

The operation was executed using the same principles as well as parts of the already written scripts used to migrate from the SQlite database. See above for more details.

In order to run this migration as fast and as seamless as possible a deployment script was used to handle the migration directly from the build server. The script would first migrate the data to the new database and then bring up a modified version of the application pointing to the new database.

In this way our system did not have any downtime but we lost a bit of data as it took around 30 seconds to migrate the database. We lost the data for the requests that we recieved between starting the migration and deploying our code to make use of the new database. We found the migration to be fairly smooth and succesful. A bit of clean-up in the deploy script was necessary afterwards, as we needed to delete the line calling the migrate script.

If considering this as a sub-optimal solution, given that there is any down-time in the migration, an optimal solution would have been to be able to migrate without down-time at all.
This we did not investigate any further.

### Docker Swarm
Late in the course of the project it made sense to begin looking at ways to make our deployment and up-time of the application more robust in terms of horizontal-scaling. Also since the database at this point was separated from the application node this was possible.

Scaling the servers vertically didn't make much sense due to the relatively low user activity we saw, so instead we made an attempt to solidify our up-time and to some extend our ability to handle many request at the same time by setting up a Docker Swarm setup. 

We discussed if it made more sense to spin up a load balancer on DO and setup a one or two more nodes and then setup CircleCI to deploy to all the nodes, however we opted for a Docker Swarm setup due to the obvious reason that everything was already dockerized and that it would be relevant and fun to learn about.

In the end we didn't commit enough time to get the setup implemented a 100% in our pipeline, but we feel confident that the plan and the prototyping we layed out was a good proof-of-concept.
The implementation can be seen in the `morten/docker-swarm` branch on the Github repository.

The following depicts the layed-out plan and how much of it we completed:
- [x] 0. Setup nodes on DO using rewritten versions of the scripts supplied from class.
- [x] 1. Rewrite docker-compose to be usable by docker stack.
- [x] 2. Be able to deploy a redundant setup of application servers all using the same singular database.
- [x] 3. Make CirleCI adopt access to nodes on DO and successfully deploy through CircleCI.
- [ ] 4. Setup shared in-memory database.
- [ ] 5. Making the transition from the old code base to the Docker Swarm setup, i.e. bringing down the old application server and setting the simulator to point at the new.
- [ ] 6. Setting up separate deployment of the database.

#### Virtualization with Docker Swarm and Digital Ocean (DO)
The docker swarm is a cluster of nodes on which docker containers are run with the intention of partitioning a workload amongst the containers. The containers interplay is orchestrated by a subset of the nodes whom are promoted from worker nodes to manager nodes. 
Because of the consenus algorithm used to make the managers come to agreement and work together, it is advised to always use at least 3 managers for any given setup. For our prototype though, only a single manager is being used. We did play around with more managers, but we stumbled upon some problems with docker that were unsolvable at the time of implementation, and we decided to initialize just a small prototypical setup running on DO with 3 nodes of which only a single node was promoted to manager. 

#### Docker stack and deployment
We wrote a deploy script that built images locally and pushed them to DockerHub, before contacting the manager node and asking it to deploy these images as instructed in the docker-compose.yml. This was only possible because the docker-compose.yml had been rewritten to be compatible with docker stack. 

Docker stack is a convenient tool for this setup because both docker swarm and docker stack is integrated into the docker engine making it a relatively trouble-free way of orchestrating the swarm setup using these two in combination. Remember docker-compose must be installed separately.

This rewrite had the positive side effect of simplifying our deploy script because everything relating to deployment was now described in terms of a single docker-compose.yml, Dockerfiles and a simplified deploy script to be used by CircleCI.

The final and working prototype ended up with a manager running logging, monitoring and the application plus two worker nodes just running the application for redundancy.

For the deployment  process (on the branch morten/docker-swarm) we ended up using the Docker Machine tool which enables developers to install Docker Engines on virtual hosts and manage the host through the `docker-machine` command. This tool was easy to learn and easy to work with. We managed to handle updates on existing nodes via CircleCI deploy process by adding SSH to CircleCI.
From here our plan was to use this tool for the deployment process, it is very powerfull in combination with the DO driver, it can both create floating IP and retrieve existing ones from DO. We could use this static IP address to always point to the swarm on the server and be able to connect to one of the Docker node, and thus being able to update the entire swarm.

#### Concurrency issues and general concerns about complexity
Docker swarm is very smart and the process and tooling is in many ways very automated. In fact due to this, it can be a bit un-obivous what is going on and what steps should be taken to either achieve something or fix some obscure problem that might arise. As a developer you are working 100% in terms of the docker swarm API when comitting to the docker swarm implementation which we found to feel a bit restrictive even for this microscopic setup.

One major issue we faced and which stopped us from proceeding due to time constraints, was that our application was not written in a thread-safe (here multi-node-safe) manner. The simulator expects our API to process requests sequentially but with a multi-node setup this would be something we could not guarantee. One way to deal with this would be to use the Postgres database to share a state among the nodes instead of using the memory of each node (specifically the 'latest' data field used by the simulator), another would be to setup an in-memory database such as Redis, shared by the docker swarm containers. We proceeded further with non of these ideas.

---
[ [prev page](../chapters/305_sec_assessment.md) | [table of content](../table_of_content.md) | [next page](../chapters/400_lessons_learned_perspective.md) ]
