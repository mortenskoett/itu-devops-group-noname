

# Table of Content
## 1. Preface and Introduction
#### [1.00 Introduction](chapters/100_preface_and_introduction.md)
- Preface
- Introduction
## 2. System's Perspective
#### [2.00 System Considerations](chapters/200_systems_perspective.md)
- System design workflow
- Legacy system
- Choice of language / runtime environment

#### [2.01 Design and Architecture](chapters/201_design_and_architecture.md)
- Deployment overview
- Minitwit application architecture
  - Handling of a http request
  - Choice of database
- The docker setup
  - Controlling docker with a script

#### [2.02 Dependencies](chapters/202_dependencies.md)
- System dependencies
- Node.js dependencies


#### [2.03 Interactions of Subsystems](chapters/203_interactions_of_subsystems.md)
- Monitoring services
- Logging
- Backing up and restoring data

## 3. Process Perspective
#### [3.00 Dev process and tools](chapters/300_dev_process_and_tools.md)
- Organization of the team
- Communication
- Organizing work
- Zoom
- Github Wiki

#### [3.01 Repository and Branching Strategy](chapters/301_repo_and_branch_strategy.md)
- Repository model
- Distributed workflow
- Branching strategy
- Contributions


#### [3.02 Stages and Tools](chapters/302_ci_dc_chain_tools.md)
- Continuous integration / continous delivery (CI/CD)
- Services
- Deployment

#### [3.03 Monitoring and Logging](chapters/303_monitoring_and_logging.md)
- Monitoring
- Logging


#### [3.04 Security Assessment](chapters/304_sec_assessment.md)
- Risk assessment
- Penetration testing
- Detection
- Recover
- Wrap up

#### [3.05 Scaling and Load Balancing](chapters/305_scaling_and_load_balancing.md)
- Database migration
    - Migrating Postgres database to separate node
- Docker Swarm
    - Virtualization with Docker Swarm and Digital Ocean (DO)
    - Docker stack and deployment
    - Concurrency issues and general concerns about complexity

## 4. Lessons Learned Perspective
#### [4.00 Current System State](chapters/400_current_system_state.md)
- Starting the application
    - System re-deployment
- Development & maintainability
    - Code quality
    - Maintainability
    - Technical debt
- Overall

#### [4.01 Lessons Learned](chapters/401_lessons_learned_perspective.md)
- Continuous deployment
- The system went down unnoticed
- Automation as documentation
- Docker compose
- Simple vs complex

#### [4.02 Conclusion](chapters/402_conclusion.md)

## 5. Appendices
#### [5.00 Appendices](chapters/500_appendices.md)
- Appendix A 
- Appendix B