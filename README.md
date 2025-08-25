*** N.B. This guide is a high-level guide that is not meant to be all inclusive of all standard production settings you will want. ***
*** Carefully review the performance, logging, observability, security, etc. before doing ANYTHING for production. ***
*** Examples of missing production resources: fine-grained access control, load balancers, APM, API gateways, API docs, domain name/SSL on ORDS, etc. ***

# The getting started template to connect to Oracle ORDS using React & NextJS
This demonstration will get you up and running with React as the frontend and Oracle ORDS as your backend. 
The use of the NextJS middleware is optional, and very useful for situations where you cannot expose secrets in your front end package,
however for this basic example, we will bypass the use of middleware and communicate directly with a public ORDS endpoint, and render its 
result to the front end component. 

There are three parts:
1. Launch an Oracle ATP & Deploy Data Model w/ RLS
2. Deploy Stand-alone ORDS
3. Launch your NextJS App w/ Auth0

Pre-requisites:
Running Auth0 server to issue JWT tokens for users.

## Step 1 - Launch and Oracle ATP & Deploy Data Model w/ RLS
1. Deploy ATP Resource
2. Deploy Data Model
3. Deploy RLS Policies
4. Link ATP ORDS to Auth0
5. Configure ORDS for Objects

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