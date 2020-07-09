## FloodRunner - Web

---

This is the web front-end for the FloodRunner ecosystem. The front-end allows users to interactively schedule and monitor tests run through the FloodRunner ecosystem

### Building docker image

The image can be built using the Dockerfile with `docker build -f Dockerfile -t jellydock/floodrunner-web .`

### Pushing docker image

The image can be pushed to DockerHub using the command `docker push jellydock/floodrunner-web`

### Running the project locally

Configure the application settings in the `public/config.js` file and then run using `npm run start` this will start up the project.
