## 3.02 Repository and Branch Strategy

NOTES FROM SESSION 2:
Describe Distributed Workflow
* Which repository setup will we use?
* Which branching model will we use?
* Which distributed development workflow will we use?
* How do we expect contributions to look like?
* Who is responsible for integrating/reviewing contributions?
Write this in a 'Contribution.md' file
___________

We make use of two Git repositories - a public repository for our code and a private repository for credentials. The branching strategy described below is for our public repository. 

### Branching strategy
We follow a branching policy where each feature or separete part of the code base is developed in its own feature branch before finally pull requested into the master branch.

The *master* branch should be as stable as possible but it also works as an intermediary branch so that developers can get the newest changes as fast as possible. The master branch requires that another developer approves the pull request before it can be merged; this is a code review step.

The *release* branch is used only for the stable versions of the code base and should only rarely see pull requests. Two approved reviews are required to merge. When a pull request is merged, the feature branch should be deleted.

release		-------->	 (only used at milestones or when a stable master needs to be captured)  
			/  
master	 	----------->	 (newest stable changes)  
		/     /  
feature		-------------->	 (your work branch)  

### Pull Request Process
Pull requests should be made for any change to public branches; master, release and any feature based branch on which more people are working.

Update the README.md and with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.

Update Gihub Projects with the status of the task in question. If you encounter bugs or code that it is not immediately possible to fix, then add a task on the Backlog.

You may merge a pull request to master once you have the sign-off of another developer, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

---
[ [prev page](../chapters/301_ci_dc_chain_tools.md) | [table of content](../table_of_content.md) | [next page](../chapters/303_dev_process_and_tools.md) ]
