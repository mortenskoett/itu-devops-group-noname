# current: sesion3

Master branch status:

[![CircleCI](https://circleci.com/gh/mortenskoett/itu-devops-group-noname/tree/master.svg?style=svg)](https://app.circleci.com/github/mortenskoett/itu-devops-group-noname/pipelines)

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
- Uses sequelize as ORM - currently with a local sqlite db
- EFS is a template framework that resembles what was used in the Python app to wire up the UI. 
	The EFS stuff which is sort of javascript written directly in the DOM I find a little bit annoying and we 
	will probably have to read som documentation. In the end I used bootstrap to quickly simulate a UI. 
	(see views/partial/head.efs)
- The code base is split into separate modules that slices the logic into layers.
Seen going from outside to inside of the application:

`server.js -> routing -> controllers -> services -> persistence`

- routing: routes the requests to a meaningful place.
- controllers unwraps the request and also handles returning appropirate responds.
- service layer handles all primary business logic and doesn't care about the API.
- persistence is separated from everything to make it possible to implement a DB abstraction asap.

The UI has its own controller where all logic is handled, sort of like an MVC pattern.

OBS: Not everything is wired up atm.

- See minitwit_nodejs/readme for how to run the server etc.
- See CONTRIBUTING.md on how to follow conventions.

## Goals before next lecture
0) - [ ] Conform our API to the simulator API
1) - [x] Implement database abstraction layer (ORM)
2) - [ ] Release and deploy (the application should run on a server and be accessible to the WWW)
3) - [ ] Write down dependencies of our version of the Minitwit application.


# minitwit-nodejs
An example of a basic structure for the minitwit application using Node.js

## How to setup server: (all from root) (this is only done once)
0. Install the node package manager npm. (probably `apt install npm`)
1. First time run `npm install` to setup dependencies (need package.json from repo)

## How to run server: (from app root)
1. Run server using `npm start`.
2. Test-queries can be made e.g. using Postman (probably `apt install postman`)
3. Visit localhost:5000
