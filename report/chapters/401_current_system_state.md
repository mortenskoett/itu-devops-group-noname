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
All project documentation, credential, source code, test and deployment scripts are consolided on our two github repositories.
One public as we have no need to hide how our general system is written and one private because some (login) credentials and communication is to kept secret.

This means that including new members on our devops teams only reqires to add them to the project repositories. If we as a team is to be replaced all knowledge can be transfered and (commit) history can be reviewed easely.

The chosen languages and tools are all industri standards, meaning that it will all be farely adobteble by others, only custom script like /run.sh might be a challange, but with comments we have tried to make it fairly understandable.


### Technical Debt

### Overall

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