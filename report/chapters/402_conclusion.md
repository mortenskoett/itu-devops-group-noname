## 4.02 Conclusion

The journey of filling the role as the devops team for the MiniTwit system has been interesting and a great learning experience. We have learned first hand what the challenges of developing a maintainable and scalable system are. Starting with the outdated legacy system we had to quickly understand and adopt the essence of the system, from the graphical user interface to the backend functions, into a new modern system. A new system based on technologies, development tools and with an operational strategy chosen by us.

For the most part we think, as documented in this report, that we made some considered decisions. Choosing *Node.js* for the application, *Postgres* as database, and a containerized environment supported by *Docker*, lifted by a virtual infrastructure at the cloud provider *Digital Ocean*, and continuous delivery with *CircleCI*.

Side-by-side, but still as an integrated part of our system, we have containerized monitoring and logging based on *Prometheus* and *Logstash* with *ElasticSearch* topped up with *Grafana* for a graphical overview of the data.

To be able to quickly deliver system changes of high quality and with seamless continuous integrations we have used a development process supported by widely acknowledged tools. As a centerpiece we use *Github*, for keeping all project relevant information collected in one place, getting version control and issue tracking. We integrate Guthub releases with automatic testing, integration and deployment service *CircleCI*, and lastly we handle our virtual setup with *Vagrant*, *Docker (swarm)* and *Ubuntu* on our cloud provider.

Today we can easily boot up the development environment or a working application on any device with a single command, without having to install any dependencies or worry about differences in the environment on the different devices. Comparing this to the amount of work that had to be done in the beginning of the course, in order to get the initial Minitwit application running on our own devices, as well as all the 'it works on my machine' struggles that any developer has experienced, we find this super awesome.

Supported by a few bash scripts for automation, we are able to develop and deploy new releases in orderly manner according to our integration and delivery chain specification.

In case of a catastrophic failure demanding a complete system restoration, our planned process and backup makes us able to redeploy the entire server, containers and system safely.

Code analysis, monitoring and visualization of the data, enables us to be much more efficient in figuring out where the code or system needs to be changed. The benefits of the tools that we have learned to use, for containerization, CI and CD, code analysis and monitoring are inevitable, and we believe they will be very beneficial to us in the future when developing scalable and maintainable solutions.

While these tools have greatly improved the scalability, maintainability and robustness of the initial Minitwit application, it has also introduced a lot of complexity: We started with a well functioning Minitwit application, consisting of about 4 files all together, which has now evolved into a rather complex system of artifacts and services. This complexity should not be neglected, as it makes the code harder to understand and maintain for external developers. Even though everything is well documented, adding more tools also adds more documentation to read, understand and maintain as the system evolves. Therefore, the benefits and added complexity should be compared and considered before adding these tools to a project. Some tools, like automatic linting or code review when pushing to branches on Github, requires very little setup and adds much value to almost any project. However, if your application does not need three replicated running applications, then implementing Docker swarm may not be the initial place to add this complexity.

It does however help to understand these tools, in order to build your initial application structure in a manner that can be scaled, if needs be. For example we had to migrate our database twice, which turned our to be a complicated and time consuming task. We now know that choosing the right database technology and having the database separate of the application from the beginning, makes a better initial design with possibility for scaling the application in the future.

All in all we believe we have learned a lot from this course, providing us wih building blocks that provides for a better development experience, improved software quality and enables us to build better software systems.

---
[ [prev page](../chapters/401_current_system_state.md) | [table of content](../table_of_content.md) | [next page](../chapters/500_appendices.md) ]