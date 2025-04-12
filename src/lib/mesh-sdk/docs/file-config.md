

## step 1:
open terminal cd /mesh-sdk
"npm install" to install all dependencies

## Step 2:
Input parameters from const.ts

## step 3:
to build transactions i.e deploy validators or create asteria
Go to utils.ts to instantiate wallet with seed phrase and blockfrost api
also in utils.ts input your admin token

## step 4:
Console.log data to see from index.ts (entry file)
uncomment and import the available data

## step 5: 
hit "npm start" on terminal

## TO DO 
complete user transaction building
complete admin transaction to comsume pellet and asteria (not sure of their functionalities for now)
Extra checks might be needed for the admin transactions but for now they are working fine
simplifying codes e.g read json file system of refernce script making it shorter or exporting it.

## NOTE 
The config.ts file is different fron const.ts with is used to apply parameters
The config.ts would make us access every properties easily with the objects
