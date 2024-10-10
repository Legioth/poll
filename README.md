# Full-stack signals poll demo

This project is an example of building a real-time poll application using full-stack signals using Vaadin Hilla.

## Running the application

The project is a standard Maven project. To run it from the command line,
type `mvnw` (Windows), or `./mvnw` (Mac & Linux), then open
http://localhost:8080 in your browser.

You can also import the project to your IDE of choice as you would with any
Maven project.

## Deploying to Production

To create a production build, call `mvnw clean package -Pproduction` (Windows),
or `./mvnw clean package -Pproduction` (Mac & Linux).
This will build a JAR file with all the dependencies and front-end resources,
ready to be deployed. The file can be found in the `target` folder after the build completes.

Once the JAR file is built, you can run it using
`java -jar target/myapp-1.0-SNAPSHOT.jar` (NOTE, replace
`myapp-1.0-SNAPSHOT.jar` with the name of your jar).

## Useful links

- Read the documentation at [hilla.dev/docs](https://hilla.dev/docs/).
- Ask questions on [the Vaadin forum](https://vaadin.com/forum/c/hilla/18).
- Report issues, create pull requests in [GitHub](https://github.com/vaadin/hilla).


## Deploying using Docker

To build the Dockerized version of the project, run

```
docker build . -t poll:latest
```

Once the Docker image is correctly built, you can test it locally using

```
docker run -p 8080:8080 poll:latest
```
