# Linkedin Clone API

## Introduction
A RESTful API that implements some functionalities that exist in linkedin app.

## Deployed version
Live demo: [Linkedin Clone Api](https://linkedin-clone-api-lue2.onrender.com/)

## Key features
* A simple jwt based authentication: [ register, login ]
* A role based access control (RBAC): [ super admin, user ]
*  Every user has a single profile.
* Users can add skills, educations and experiences to their profiles.
* The user can make a connection request to another user.
* The user can accept or reject the connection request.
* Every user has a news feed: posts of him and his connections.
* A simple notifications system build with socket.io.
* Api features: filter, search, sort and pagination on getting some resources.
* Users can upload files to the cloud (supabase storage): images, videos.
##  Api docs
Check [Linkedin Clone Api Documentation](https://linkedin-clone-api-lue2.onrender.com/api-docs) for more informations.

## Technologies and libraries used
* Nodejs
* Nestjs
* Postgresql
* Typeorm
* Passportjs
* Class Validator
* Socket.io

## Installation guide

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
