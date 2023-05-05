//////////////////////Requirements
-Node js
-NPM
-Theme Kit

////////////////Initialize theme in local development
-Create a new theme on your store with theme kit
-Delete the default files
-Clone the git repo
-open terminal and run (npm install)
-In the config file 
    Replace the configration with your store

///////////////// Configuration
-npm start
    -creates a webpack build in development
    -Webpack begins watching for file changes
    -Theme Kit begins watching for file changes in dist/
    -Theme Kit opens your development theme in your default browser

-npm run build
    -Completes a Webpack build in production mode

-npm run deploy
    -completes a webpack build in production mode
    -Deploys dist folder to the development theme in config.yml

/////////////////////Settins up product page
-Add blocks in sopify customiser to display product info
-How product slider displays images based on the option selection
    -In the product images add alt text with the corresponding option value
