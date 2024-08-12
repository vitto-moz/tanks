![A82832F5-3E1C-447A-B398-921497F3528A](https://github.com/user-attachments/assets/0f0ba3a7-1af0-4f9b-afa2-83d03936083a)


# Running Server and Client locally
## Prerequisites

First, ensure you have the following installed:

1. NodeJS - Download and Install latest version of Node: [NodeJS](http://http://nodejs.org)
2. Git - Download and Install [Git](http://git-scm.com)

After that, use `Git bash` to run all commands if you are on Windows platform.

## Clone repository

In order to start the project use:

```bash
$ git clone https://github.com/vitto-moz/tanks.git
$ cd tanks
```

## Run Server

To run server locally, just install dependencies and run `gulp` task to create a build:

```bash
$ cd server
$ npm install -g gulp-cli
$ npm install
$ gulp build
$ npm start
```

## Run Server For Develpment

To build and restart server file on every changes of ts files - run:

```bash
$ npm run dev
```

The `socket.io` server will be running on port `8080`

## Run React Client

Open other command line window and run following commands:

```bash
$ cd client
$ yarn install
$ yarn start
```

Now open your browser in following URL: [http://localhost:4300/](http://localhost:4300/)

## License

MIT
