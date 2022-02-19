# Ratchat

Ratchat is an anonymous messaging service allowing collegians to chat to RAs.

When making changes, ensure you push them using both `git push heroku master` and `git push origin`.

## Running backend
These command should be run from within root folder
### `yarn install`

Install project dependencies

### `yarn start`

Begin a development server on port 5000.

### `yarn dev`

Begin a development server on port 5000 using nodemon, which restarts the server when changes in source files are detected.

## Running frontend
These should be run from in the `client` folder.
### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

## Deployment

### Deploying frontend
Run these all from within the `client` folder

1. `yarn build`
2. `netlify deploy`
3. Check the draft url from netlify to ensure it is working correctly
4. `netlify deploy --prod`

### Deploying backend
Deploying backend only takes one command. Ensure that it is functioning correctly before pushing. 
`git push heroku master`