## 3.05 Security Assessment

In session 09, the focus on security became a main focus. To keep being a dependable system provider with a secure product, it's important to have a clear understanding about what is most importent and what steps to take in the case of a security breach or a directly devastating hacker attack.

So to deliver trust a proactive an systematic approch needs to be in place for our complete ITU-MiniTwit system.

So the following route was followed
- Risk assessment
- Penetration testing
- Detection
- Recover

All work and thoughts is describe in the security assessment report, the paragraf below is a compressed conslusion and result of the work.

### Risk assessment
Our system consist of different parts whice is prone to different risks in regards to their existence.
As describe in earlier chapters, our systems relies on virtual machines "pysilicated" located at our provider Digital Ocean's cloud infrastructure, and even if the concpet of clud is used, it's still at some point at risk for natrual causes hitting the datacenter, like flood's, lightning or human interfering. But even if this would be catastrofic for us, it would be a extremly rare as Digital Ocean is expected to have tried to midigate and forsee this kind of events.

What we could do, but do not include is a strategy for moving to an other provider in this case. What we have done is prepare our deployment strategy in a way that let's us redeploy our entire systems within ½ hour.

### Penetration testing
### Detection
### Recover


---
[ [prev page](../chapters/304_monitoring_and_logging.md) | [table of content](../table_of_content.md) | [next page](../chapters/306_scaling_and_load_balancing.md) ]
