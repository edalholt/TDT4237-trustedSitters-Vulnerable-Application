# TrustedSitters

Vulnerable Application for TDT4237 Spring 2022

## Prerequisites

The following must be installed before running this application

- [Python >= 3.7](https://www.python.org/)
- [Node >= 12](https://nodejs.org/en/)

## Setup

First one must retrieve the source code:

- `git clone https://gitlab.stud.idi.ntnu.no/tdt4237/trustedsitters.git`
- `cd trustedsitters`

All commands from here on out are within the trustedsitters directory.

### Development

The following sections describe how one should run the backend and frontend code for development purposes.

#### Backend

To run the backend server, run the following commands:

- `cd backend`
- `pip install -r requirements.txt`
- `python manage.py migrate`
- `python manage.py runserver`

After installing once, you only need to run the `python manage.py runserver` command to start the django server

#### Frontend

To run the frontend server, run the following commands:

- `cd frontend`
- `npm ci`
- `npm start`

After installing once, you only need to run the `npm start` command to start the react server

### Deployment

The following sections describe how to run the application with Docker and Gitlab Runner. We are using Docker to prevent issues with different versions and platforms, effectively "it runs on my computer" (but only there), should not be an issue. Your application will always be evaluated when being deployed by Docker. 

#### Docker

- Install Docker Desktop: https://docs.docker.com/engine/install/
- `docker-compose up --build`

#### Gitlab Runner

The repository is configured such that changes pushed to the "production" branch will automatically be deployed on molde.idi.ntnu.no:21XXX (XXX = GroupID). This can be used for testing the deployed application and should be used for pushing code after fixing vulnerabilities. Typical workflow after finishing development on the master branch would be:

- `git checkout production`
- `git merge master`
- `git push origin production`
- Go to "CI/CD" and "pipelines" within this Gitlab repository to monitor deployment.

## Assumptions

- The .env file is assumed to be an external file, and would not be part of this repository for a real project. Having passwords in a file on the hosted repository is considered a security risk.
