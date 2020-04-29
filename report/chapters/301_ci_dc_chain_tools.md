## 3.01 Stages and Tools used for CI/DD chain

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