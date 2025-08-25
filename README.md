*** N.B. This guide is a high-level guide that is not meant to be all inclusive of all standard production settings you will want. ***
*** Carefully review the performance, logging, observability, security, etc. before doing ANYTHING for production. ***
*** Examples of missing production resources: fine-grained access control, load balancers, APM, API gateways, API docs, domain name/SSL on ORDS, use PoLP on all accounts and access, protect your pre-hook functions, etc. ***

# The getting started template to connect to Oracle ORDS using React & NextJS
This demonstration will get you up and running with React as the frontend and Oracle ORDS as your backend. 
The use of the NextJS middleware is optional, and very useful for situations where you cannot expose secrets in your front end package,
however for this basic example, we will bypass the use of middleware and communicate directly with a public ORDS endpoint, and render its 
result to the front end component. 

There are three parts:
1. Launch an Oracle ATP & Deploy Data Model w/ RLS & Configure ORDS in database
2. Deploy Stand-alone ORDS
3. Launch your NextJS App w/ Auth0

Pre-requisites:
Running Auth0 server to issue JWT tokens for users.

## Step 1 - Launch and Oracle ATP & Deploy Data Model w/ RLS & Configure ORDS in database
1. Deploy ATP Resource
2. Deploy Data Model
3. Deploy RLS Policies & Configure Context
4. Link ATP ORDS to Auth0
5. Configure ORDS for Objects

### 1.1 Deploy ATP Resource
1. Login to OCI
2. Go to Oracle Databse -> Autonomous database
3. Create new ATP Instance
4. Name the Instance & Select Compartment
5. Designate Workload type as Transaction Processing 
- This can be optionally set to other types, just use this for this guide.
6. Select Licensing 
- We use Developer Tier
7. Set Database Version, we tested this with 23ai
8. Set your admin password, remember this!
9. Set network access to "Secure Access from Anywhere"
- N.B. This is an insecure setting
10. Create the instance and wait for it to deploy before moving to step 2


### 1.2 Deploy the Data Model
1. Create the HR Schema
- e.g. CREATE USER hr IDENTIFIED BY "<Password>"
               DEFAULT TABLESPACE hr
               QUOTA UNLIMITED ON hr;
2. Copy the DDL from our sample file db/scripts/install.sql and execute in console as Admin
- This is based on: https://github.com/oracle-samples/db-sample-schemas/releases/tag/v23.3
3. Copy the DDL from our sample file db/scripts/create_content.sql and execute in console as Admin
- This is based on the ibid.


### 1.3 Deploy RLS Policies
N.B. This will simply create a read RLS policy for this example that checks to see if the user is logged in with an Auth0 user ID. 
You can follow this same pattern for building out more detailed permissions.

1. As ADMIN, Create a Context, e.g. db/scripts/create_context.sql
2. As ADMIN, Create Access Predicate, e.g. db/scripts/db_access_predicate.sql
N.B. This is just validating that a valid context exists that is > 10 characters. Ideally, you are validating this against the specific user's in the DB and verifying they are explicitly allowed. This is out of scope for this getting started guide.
- You would define whatever access policies you need according to your application requirements
3. As ADMIN, Deploy an RLS Policy to Employees table, e.g. db/scripts/rls_policy.sql
- N.B. This example only has a select RLS policy to the employees table. You will need to do more than this for any production instance, build to your requirements.
4. As ADMIN, Validate that the Admin user can see data, it should still since ADMIN has the bypass access control privilege by default.
- You can just open the employees table.
5. As ADMIN, Now go to the hamburger-> Database Users and REST enable HR & Grant Connection privilege
- URL: https://{server-url}/ords/admin/_sdw/?nav=admin&admin=user-management
6. Open an incognito window and login to HR via: https://{your_db_url}/ords/hr/_sdw/?nav=worksheet
7. As HR, Validate that you can see the tables you added and content in the tables EXCEPT for in employees
- e.g. Countries table should have Data and employees should NOT show any
8. As HR, Now, test the Access Predicate by granting yourself a context as HR, to do this execute the following and check the employees table for data - sample validation code.
/* Begin */
SELECT * FROM employees;
BEGIN
 set_security_proc('google-oauth2|103699938906');
END;
/
SELECT * FROM employees;
SELECT SYS_CONTEXT('ords_ctx', 'auth0_id');
/* End */

If you see the rows in employees, success - you have a working RLS policy w/ an access predicate.


### 1.4 Link ATP ORDS to Auth0
1. Get your Auth0 URL, generally in the format of: https://{tenant-name}.{region}.auth0.com/
2. As HR, create your JWT profile for your ORDS instance, e.g. db/scripts/jwt_profile.sql
- Replace the domain with your tenant URL for the issuer and jwk_url values
- Replace the audience w/ the URL of your ATP instance


### 1.5 Configure ORDS for Objects
N.B. We are setting this up to NOT require authentication to make it easy to test, which means the tables w/o RLS are publicly accessible
1. As HR, REST Enable COUNTRIES
- Right click the COUNTRIES table in Orace Database Actions -> SQL
- Select REST enable
- Leave everything default, ensure use authentication is NOT checked
- Browse to: https://{atp-instance-url}/ords/hr/_sdw/?nav=rest-workshop&rest-workshop=auto-rest
- You will now see one module under AutoREST
- Open it w/ the web UI or go to: https://{atp-instance-url}/ords/hr/countries/
- You should see a number of results
2. As HR, REST Enable EMPLOYEES
- Right click the EMPLOYEES table in Orace Database Actions -> SQL
- Select REST enable
- Leave everything default, ensure use authentication is NOT checked
- Browse to: https://{atp-instance-url}/ords/hr/_sdw/?nav=rest-workshop&rest-workshop=auto-rest
- You will now see one module under AutoREST
- Open it w/ the web UI or go to: https://{atp-instance-url}/ords/hr/employees/
- You should see NO results since we have RLS on this table
3. As HR, Now create a helper function that will output the current logged in user
- With this function - if you have an identity with a JWT token it will override the DB user setting
- Create a new module called user w/ a base API path of /user/ - set not protected, or do w/ code: db/scripts/create_module.sql
- Then, create a template for URI template, current_user - or do w/ code: db/scripts/create_template.sql
- Then, create a handler for getting the current user - or do w/ code: db/scripts/create_handler.sql
- Now - open the URL for what you just created: https://{atp-instance-url}/ords/hr/user/current_user
-- If you are logged in via the web and access this URL as HR you will see that you have a value of HR returned
-- If you open this in an unauthenticated window, no results (null) will be returned
-- If you access this w/ a JWT token, you will get the user from the JWT
--- To get a valid JWT token, get one through Auth0 - many ways to get, two easiest are:
---- Option A: Create an API set of Credentials (Applications -> APIs) and then issue a JWT
---- Option B: Login to a web-app connected to Auth0 and get the JWT token



## Step 2 - Deploy Stand-alone ORDS
1. Deploy an Oracle Linux VM
2. Install and Configure ORDS



## Step 3 - Launch your NextJS App w/ Auth0

### 1. Initialize React & NextJS
Run in your console to install the boilerplate code from NextJS https://nextjs.org/ https://nextjs.org/docs

`npx create-next-app@15.3.2`

- This demo uses version 15.3.2, but using @latest is a best practice; make sure you keep your dependencies up to date and free of vulnerabilities. Using a locked version for this code demonstration will ensure it functions out of the box with it's subsequent dependencies, but again, follow the best practices.

### 2. Create your environment file
Create a .env in your project root, containing the ORDS baseline URL. 

- *NEVER commit your .env file to your repository*. You will inevitably risk exposing your application and other secret keys in a repository which violates security practices and does not adhere to scaling and server environments whatsoever. 

For the demonstration, use this definition
`NEXT_PUBLIC_ORDS_ENDPOINT==https://ga9da7877d7b6c5-cephissodev1.adb.us-ashburn-1.oraclecloudapps.com/ords`

For an endpoint of your own, define the value accordingly
`NEXT_PUBLIC_ORDS_ENDPOINT=YOUR_ENDPOINT`

### 3. Run the applicate in development mode

`npm run dev`

Upon success, you will see console output such as
```
   ▲ Next.js 15.3.2
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.98:3000
   - Environments: .env

 ✓ Starting...
 ✓ Ready in 1110ms
 ```

 Use the http://localhost:3000 URL to preview the locally running application