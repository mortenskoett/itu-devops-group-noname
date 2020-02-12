# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
slack, or any other method with the work group of this repository before making a change.
Usually the task will already be on the Github projects `Backlog`, however if not, create an issue and 
assign yourself to it.

We have some simple interaction policies, please follow these in all your interactions with the project.

## Branching Policy
We currently follow a branching policy where each feature or separete part of the code base is developed 
in its own `feature` branch before finally pull requested into the `master` branch. 

The master branch should be as stable as possible but it also works as an intermediary branch so that 
developers can get the newest changes as fast as possible. The master branch requires that another developer
approves the pull request before it can be merged.

The `release` branch is used only for the most stable versions of the code base and should only rarely
see pull requests. Two approved reviews are required to merge.

```
release		----->				(only used at milestones or when a stable master needs to be captured)
				/
master	 	----------->		(newest stable changes)
				/     /
feature		-------------->		(your work branch)
```

## Pull Request Process

1. Pull requests should be made for any change to public branches; `master`, `release` and any
feature based branch on which more people are working.

2. Update the README.md and with details of changes to the interface, this includes new environment 
   variables, exposed ports, useful file locations and container parameters.

3. Update Gihub Projects with the status of the task in question. If you encounter bugs or code that
	it is not immediately possible to fix, then add a task on the Backlog.

4. You may merge a pull request to master once you have the sign-off of another developer, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.


## Detailed comments

## Questions

- Q: Which repository setup will we use?
  - Using one repo, https://github.com/mortenskoett/itu-devops-group-noname

- Q: Which branching model will we use?
  - Arguments for branching policy, simple branching model, small project and multiple developers. Pull request 
  to ensure quality and knowledge sharing.

- Q: Which distributed development workflow will we use?
  - We will be working with a main backlog and communicating async w. Slack.
  - We will be using a centralized workflow. This makes sense because of current smaller size of the project.
  - We will try to modularize the code base as much as possible to minimize conflicts when merging/rebasing.
  - We will require code review for all Pull Request to the master branch.
  
- Q: How do we expect contributions to look like?
  - Commits to feature branches do not have to pass tests
  - The code on the master branch should always work (i.e. pull requests to the master branch)
  - Pull request to the release branch should be discussed and worked towards.
  
- Q: Who is responsible for integrating/reviewing contributions?
  - Two persons have to review and accept pull requests to the master branch.

