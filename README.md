# TrustedSitters

Vulnerable Application for TDT4237 Spring 2022.

## Prerequisites

The following must be installed before running this application.

- [VPN](https://i.ntnu.no/wiki/-/wiki/English/Install+VPN) - Access git resources
- [Git](https://git-scm.com/downloads/) - Git remote procedure calls must be used through the campus network or VPN
- [Docker Desktop](https://docs.docker.com/engine/install/) - Deployment
- [Python >= 3.7](https://www.python.org/) - Development
- [Node >= 12](https://nodejs.org/en/) - Development

### Alternative 1: Clone with personal access tokens

New Gitlab security features require generation of personal access tokens. To clone the repository you have to:

- Generate your own token https://gitlab.stud.idi.ntnu.no/-/profile/personal_access_tokens
- `git clone https://oauth2:<YOUR-ACCESS-TOKEN>@gitlab.stud.idi.ntnu.no/tdt4237/trustedsitters.git/`
- `cd trustedsitters`

### Alternative 2: Clone with SSH keys

- Instructions from Gitlab: https://gitlab.stud.iie.ntnu.no/-/profile/keys

All commands from here on out are within the trustedsitters directory unless specified.

## Development

The following sections describe how one should run the backend and frontend code for development purposes.

### Backend

Go to the backend directory:

- `cd backend`

Before running the backend one should use a [virtualenvironment](https://virtualenv.pypa.io/en/latest/index.html):

- `pip install --user virtualenv`
- `virtualenv venv`
- `source venv/bin/activate`

To run the backend server, run the following commands:

- `pip install -r requirements.txt`
- `python manage.py migrate`
- `python manage.py runserver`

After installing once, you only need to run the `python manage.py runserver` command to start the django server.

### Frontend

To run the frontend server, run the following commands:

- `cd frontend`
- `npm ci`
- `npm start`

After installing once, you only need to run the `npm start` command to start the react server

## Deployment

The following sections describe how to run the application with Docker and Gitlab Runner. We are using Docker to prevent issues with different versions and platforms, effectively "it runs on my computer" (but only there), should not be an issue. Your application will always be evaluated when being deployed by Docker. 

### Docker

- `docker-compose up --build`

### Gitlab Runner

The repository is configured such that changes pushed to the "production" branch will automatically be deployed on molde.idi.ntnu.no:21XXX (XXX = GroupID). This can be used for testing the deployed application and should be used for pushing code after fixing vulnerabilities. Typical workflow after finishing development on the master branch would be:

- `git checkout production`
- `git merge master`
- `git push origin production`
- Go to "CI/CD" and "pipelines" within this Gitlab repository to monitor deployment.

## Assumptions

- The .env file is assumed to be an external file, and would not be part of this repository for a real project. Having passwords in a file on the hosted repository is considered a security risk.
