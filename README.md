# current: sesion5

Master branch status:

[![CircleCI](https://circleci.com/gh/mortenskoett/itu-devops-group-noname/tree/master.svg?style=svg)](https://app.circleci.com/github/mortenskoett/itu-devops-group-noname/pipelines)

Course git page: https://github.com/itu-devops/2020-spring

Session page: https://github.com/itu-devops/2020-spring/blob/master/sessions/session_05

Report page: [insert link to overleaf]

Private git repository: https://github.com/mortenskoett/itu-group-noname-private

Google Drive: https://drive.google.com/drive/folders/1x5t2ECkLjpLyFRgGsoD_xyAtNWOB8ZKq

### Minitwit functional Requirements
- [x] Be able to log in
- [x] See all tweets
- [x] Be able to follow/unfollow another user
- [x] See only tweets from followed users
- [x] Put up tweets
- [x] See tweets from a particular user (?)
- [ ] Have nasty words flagged

### Thoughts on current Node.js architecture
- Uses sequelize as ORM - currently with a postgres database that needs to be run separately eg. using docker.
- EFS is a template framework that resembles what was used in the Python app to wire up the UI. 
	The EFS stuff which is sort of javascript written directly in the DOM I find a little bit annoying and we 
	will probably have to read som documentation. In the end I used bootstrap to quickly simulate a UI. 
	(see views/partial/head.efs)
- The code base is split into separate modules that slices the logic into layers.
- The UI and the API are split up into two separate HTTP listening entities.
    - The UI listens on port 5000 and has its own controller where all logic is handled, sort of like an MVC pattern.
    - The API listens on port 5001

Seen going from outside to inside of the application:

`server.js -> routing -> controllers -> repositories -> persistence`

- routing: routes the requests to a meaningful place.
- controllers unwraps the request and also handles returning appropirate responds.
- repository layer handles all primary business logic and doesn't care about the API.
- persistence is separated from everything to make it possible to implement a DB abstraction asap.


- See minitwit_nodejs/readme for how to run the server etc.
- See CONTRIBUTING.md on how to follow conventions.

## Goals before next lecture
...?

## Possible commands using npm (from package.json)
- `npm start` to run server in production environment
- `npm run dev` to run server in dev environment (maybe soon deprecated)
- ...?

## Run application using docker
```
cd ./dockerfiles
./run.sh <arg>

<arg>:
app 		run app container
test 		run python test container
db 		run postgres database container
build 		rebuild all images
clean 		remove everything to get a clean slate
down 		take everything down
setup_run_test 	setup a complete testing setup and run python tests
```

## Testing
- Test queries can be made e.g. using Postman (probably `apt install postman`)
- Visit localhost:5000 to see UI server in action
