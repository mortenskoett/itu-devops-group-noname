## 3.01 Stages and Tools used for CI/CD chain

For our CI/CD chain, we are using Vagrant and CircleCI.
We use **Vagrant** to start a droplet on DigitalOcean (DO). By installing Vagrant, we can write a Vagrant file specifying what server and installations we want (declaring that we are using DO, where to find our credentials, and what server and images we want it to create), and then make Vagrant set up the desired server on our DO account. Instead of relying on Vagrant, we could just create and configure a droplet manually (using the DO website or the terminal), but it is better to have the exact setup and configuration written down as code, so that we can easily redo it again later: this is what Vagrant help to do.

**Write saomething about why choosing CircleCI over Travis*

When we push new commits to any git branch, CircleCI will fetch our code and run our tests. If the tests fail we will be notified with an e-mail. Further, on Github each branch is marked with a checkmark or a cross indicating whether the code has passed the tests.

We deploy our code by commiting to the release branch (see chapter 3.02).
Stages used for our CI chain:
- Push code to the release branch
- CircleCI fetches the code and runs Eslint and our tests
    - If the tests fail, we are notified and no further actions are made
- CircleCI pushes the docker images to DockerHub
- CircleCI runs our deploy script, which deploys our code to our Digital Ocean server

Our tests consist of an Eslint check and some tests for our API. Eslint is a linter for JavaScript code, which ensures that we keep a code standard. Eslint can be run locally and even integrated into the IDE so that errors can be found before the tests are run on the CircleCI server. 

---
[ [prev page](../chapters/300_process_perspective.md) | [table of content](../table_of_content.md) | [next page](../chapters/302_repo_and_branch_strategy.md) ]
