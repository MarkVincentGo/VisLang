# VLANG

This is my project called VLANG. It uses React to create a visual interface to do calculations and can perform simple programming constructs such as variable storage and loops.

## Demo

Click image for a short demo.
[![IMAGE ALT TEXT HERE](https://markgowebsite.s3-us-west-1.amazonaws.com/markgome/VLANGImage.png)](https://markgowebsite.s3-us-west-1.amazonaws.com/markgome/VLANGDemo.mp4)

## Available Scripts

To simply the React application:
#### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


#### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Running Backend

Running the backend allows you to store user-saved programs to your local mongodb database.
This Requires you have Go installed in your local machine.

To Run Backend:
#### `cd visual-language-bff && go run *.go`

This should run the Go server and respond to requests from the React App to save or load user programs based on name.