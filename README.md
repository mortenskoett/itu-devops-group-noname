# current: sesion3

Course git page: https://github.com/itu-devops/2020-spring

Session page: https://github.com/itu-devops/2020-spring/blob/master/sessions/session_03

Report page: [insert link to overleaf]

### Minitwit functional Requirements
- [x] Be able to log in
- [x] See all tweets
- [x] Be able to follow/unfollow another user
- [x] See only tweets from followed users
- [x] Put up tweets
- [x] See tweets from a particular user (?)
- [ ] Have nasty words flagged

### Thoughts on current Node.js architecture
- Sqlite db works locally right now.
- EFS is a template framework that resembles what was used in the Python app to wire up the UI. 
	The EFS stuff which is sort of javascript written directly in the DOM I find a little bit annoying and we 
	will probably have to read som documentation. In the end I used bootstrap to quickly simulate a UI. 
	(see views/partial/head.efs)
- Setting up end points is happening in `server.js` where there are already examples.
- See minitwit_nodejs/readme for how to run the server etc.
- See CONTRIBUTING.md on how to follow conventions.

## Goals before next lecture
0) - [ ] Conform our API to the simulator API
1) - [ ] Implement database abstraction layer (ORM)
2) - [ ] Release and deploy (the application should run on a server and be accessible to the WWW)
3) - [ ] Write down dependencies of our version of the Minitwit application.
