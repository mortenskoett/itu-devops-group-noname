## 3.01 Repository and Branch Strategy

<!-- 
NOTES FROM SESSION 2:
Describe Distributed Workflow
* Which repository setup will we use? x
* Which branching model will we use? x
* Which distributed development workflow will we use? x måske uddybe?
* How do we expect contributions to look like? x
* Who is responsible for integrating/reviewing contributions?
Write this in a 'Contribution.md' file
___________ -->

### Repository model
We made use of the mono repository model - a public repository for all our code. We decided on this repository model since we though that a single repository would be fine for this project. We did not see a need to have distributed repositories. Having a single repository worked fine for the project as we divided our subsystems into separate folders and followed the branching strategy below.

We did also have a private repository for storing and sharing credentials that can not be stored in the public repository. 

### Distirbuted workflow
As described in section 3.00 we all had the same role. We therefore decided to make use of a centralized workflow where we were all working on our shared repository. We did, however, make use of code reviews so that we could not push changes directly to all branches. This is described in the following section.

### Branching strategy
We follow a branching policy where each feature or separete part of the code base is developed in its own feature branch (topic branch) before finally being pull requested into the master branch. 

The *master* branch should be as stable as possible but it also works as an intermediary branch so that developers can get the newest changes as fast as possible. The master branch requires that another developer approves the pull request before it can be merged; this is a code review step. All other members of the team are able to approve a pull request. When a pull request is merged, the feature branch should be deleted.

The *release* branch is used only for the stable versions of the code base. The code on this branch is deployed to our production server. Two approved reviews are required to merge. 

```
release		-------->	        (deploys the code to the production server)  
                 /  
master	 	----------->	    (newest stable changes)  
             /      /  
feature		-------------->	    (your work branch)
```

We decided to use this branching strategy as we thought it worked well with the mono repository model - we could separate work on different subsystems to different branches. This worked out well. 

At times we found the obligatory code reviews cumbersome. For instance when two people had worked on a feature which we wanted to deploy, we had to wait for a third person's review. Sometimes we decided to accept the pull request without a second reviewer - using the ... of the owner of the repository. 

On the other hand the code reviews helped in making sure most of the developing team had a fairly good understanding of most parts of the codebase. Doing the reviews we were also able to discover some errors in the code that our tests had not found. So the fairly strict policy of having two other people reviewing the code was here in conflict with other desirable goals of merging the code as fast as possible. More people might find more bugs or have valuable insights or ideas, and it mitigates knowledge silos, enhances the bus/truck factor, and encourages participation. On the other side, the more people that needs to review the code, the slower it gets merged and ends in production. With so few people working on the project, this policy would definitely and prohibit the work from being merged the same day as it was pushed, and would therevy severely decrease the lead time. (We found that for this project, with so few people able to review every day, two people was too much, as we ended up breaking our own policy so avoid longdragging merges? - but finding a good balance is a challenge?)

### Contributions
Pull requests should be made for any change to public branches; master, release and any feature based branch on which more people are working.

The README.md and/or the Github Wiki should be updated with details of changes to the interface or useful information for the other members of the team. This includes new environment variables, exposed ports, useful file locations, container parameters or inclusion of new services or subsystems.

The Kanban board on Gihub Projects should be updated with the status of the task in question. If you encounter bugs or code that it is not immediately possible to fix, then add a task to the Backlog.

You may merge a pull request to master once you have the sign-off of another developer, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

---
[ [prev page](../chapters/300_dev_process_and_tools.md) | [table of content](../table_of_content.md) | [next page](../chapters/302_ci_dc_chain_tools.md) ]
