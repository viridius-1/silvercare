# silvercare

Heroku Link:
https://silvercare.herokuapp.com/caregiver/

Technologies used:
Node
Express
Passport
Mongoose
Bootstrap

Features include:
1) Passport login and authentication
2) User can create/update/delete profile as caregivers or careseekers (jobs creators)
3) Caregivers offer service and accepting jobs by careseekers

Approach:
2 users login approach to store as separate collection in DB, using 1 passport to authenticate.

Potential problem:
If a caregiver delete the account, the transacted jobs info will be gone
