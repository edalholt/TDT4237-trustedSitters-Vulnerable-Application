# TrustedSitters

Vulnerable Application for TDT4237 Spring 2022

## Prerequisites

The following must be installed before running this application

- [Python >= 3.7](https://www.python.org/)
- [Node >= 12](https://nodejs.org/en/)

## Setup

### Backend

To run the backend server, run the following commands:

- `cd backend`

- `pip install -r requirements.txt`

- `python manage.py migrate`

- `python manage.py runserver`

After installing once, you only need to run the `python manage.py runserver` command to start the django server

### Frontend

To run the frontend server, run the following commands:

- `cd frontend`
- `npm install`
- `npm start`

After installing once, you only need to run the `npm start` command to start the react server
