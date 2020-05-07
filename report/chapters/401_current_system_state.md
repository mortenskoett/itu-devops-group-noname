## 4.01 Current System State

The system is currently not running on any servers but it can be easily deployed using our run.sh script (skal forklares tidligere). Because all subsystems run in docker containers, the only requirement for the machine to deploy the system on is that ... (Ubuntu?, docker installeret)

When deploying the system in production mode the system will connect to an external database. The system can also be deployed in developer mode which will use a local database instead. The change between production and developer mode is done by changing an environment variable - this is variable is changed by the run.sh script.

To start the application in production mode run the following command: ./run.sh setup_run_app
To start the application in developer mode run the following command: ./run.sh setup_local_app

When deploying the system it can be decided whether or not to deploy the individual subsystems used for monitoring and logging. To run the monitoring and logging subsystems respectively, run the commands: 
./run.sh monitor -d
./run.sh logging -d

The tests for the system can be run using the following command: ./run.sh setup_run_test

**What do we write in this section? Is there more to say? The future of the system?**

---
[ [prev page](../chapters/400_lessons_learned_perspective.md) | [table of content](../table_of_content.md) | [next page](../chapters/402_conclusion.md) ]