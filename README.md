# current: sesion2

Course git page: https://github.com/itu-devops/2020-spring

Session page: https://github.com/itu-devops/2020-spring/blob/master/sessions/session_02/Session%202_pre.ipynb

### Minitwit functional Requirements
- [x] Be able to log in
- [x] See all tweets
- [x] Be able to follow/unfollow another user
- [x] See only tweets from followed users
- [ ] Put up tweets
- [ ] Have nasty words flagged
- [ ] See tweets from a particular user (?)

### Thoughts on current Node.js architecture
- Sqlite db works locally right now.
- EFS is a template framework that resembles what was used in the Python app to wire up the UI. 
	The EFS stuff which is sort of javascript written directly in the DOM I find a little bit annoying and we 
	will probably have to read som documentation. In the end I used bootstrap to quickly simulate a UI. 
	(see views/partial/head.efs)
- Setting up end points is happening in `server.js` where there are already examples.
- See minitwit_nodejs/readme for how to run the server etc.

## Goals before next lecture
0) - [ ] Send your github.com accounts on Slack to get invited to the new repo.
1) - [x] Choose a programming language and framework to investigate in depth, and try to translate the code.
2) - [ ] Make the old tests pass.
3) - [ ] Refactor language/framework decision: Log and provide good arguments for the choice of programming 
        language and framework. Likely, a feature mapping/comparison or a mini-benchmark is a good choice.
4) - [ ] Start on API for testing (50% done)
5) - [ ] Describe Distributed Workflow
6) - [ ] Install Docker, VirtualBox, and Vagrant on your computer.
