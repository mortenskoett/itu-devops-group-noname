## 4.01 Current System State
<!-- **What do we write in this section? Is there more to say? The future of the system?** -->

<!-- // TOOD: Skriv Technical debt afsnit
    run.sh
    swarm
    db deployment
    -->

<!-- // TODO: Rewrite the following: -->
The system is currently not running on any servers but it can be easily deployed using our run.sh script. Because all subsystems run in docker containers, the only requirement is a docker installation on the machine that the system shall be deployed on. But this aside the current system state as we see it.

### Development & Maintainability
All project documentation, credential, source code, test and deployment scripts are consolidated on our two github repositories.
One public as we have no need to hide how our general system is written and one private because some (login) credentials and communication is to kept secret.

This means that including new members on our devops teams only requires to add them to the project repositories. If we as a team is to be replaced all knowledge can be transferred and (commit) history can be reviewed easely.

The chosen languages and tools are all industry standards, meaning that it will all be fairly adoptable by others, only custom script like /run.sh might be a challenge, but with comments we have tried to make it fairly understandable.

### Technical Debt
As our system is newly developed it should not introduce much technical debt, but technical debt is forming fast, when using a things like nodejs, where a lot dependencies are automatically acquired. We have also chosen to view the tools used for continuous integration and continuous deployment as technical dept. This is because even if it simplifies and structures the overall process it also makes us depend on external companies to be present for our system to be work on as intended.

### Overall
For the most part, we feel our system is acceptable, we have a working deployment strategy, an reasonable structure in our code repository and the files. Monitoring an logging in place and a fairly success in serving our (ghost api) users with only few hiccups.

So on most fronts we have a complete system that in the eyes of continuous integration are able to be extended with less to no downtime.

If more development should take place, the pipeline would include:
- Deploy system with docker swarm for load balancing
- Revise vagrant and docker for complete system deployment
- Refactor nodejs code
 
### System (re)deployment
When deploying the system in production mode the system will connect to an external database. The system can also be deployed in developer mode which will use a local database instead. The change between production and developer mode is done by changing an environment variable - this is variable is changed by the `run.sh` script.

To start the application in production mode run the following command: ./run.sh setup_run_app
To start the application in developer mode run the following command: ./run.sh setup_local_app

When deploying the system it can be decided whether or not to deploy the individual subsystems used for monitoring and logging. To run the monitoring and logging subsystems respectively, run the commands: 
```
./run.sh monitor -d
./run.sh logging -d
```

The tests for the system can be run using the following command: `./run.sh setup_run_test`

---
[ [prev page](../chapters/400_lessons_learned_perspective.md) | [table of content](../table_of_content.md) | [next page](../chapters/402_conclusion.md) ]