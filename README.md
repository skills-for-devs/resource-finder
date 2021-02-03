# Code 301 Final Project - Skills for Devs - Skillfinder.dev

## GitHub Repo: [Click here](https://github.com/skills-for-devs/resource-finder.git)

## Team

- AJ Johnson
- Lauren Sierra
- Stephen Webber
- Carly Dekock

## Description

A dynamic app/website that allows the user to search for free resources based on the details of relevant job descriptions. User is given the opportunity to sign in to their account, and enter a programming language they’d like to learn more about and potentially find jobs related to. Pulling from GitHub jobs and YouTube APIs the user is presented with jobs related to the language specified as well as informational videos to learn more about the language. Keywords in the job descriptions can be selected to offer further content.

## Getting Started

- You will need: DATABASE_URL, VIDEO_API_KEY

### Dependencies

- dotenv
- ejs
- express
- method-override
- pg
- superagent

### User Stories

- As a software developer visiting the website, I want to be able to specify the language that I want to search for, so that I have control over what I’m looking for.
- As a user, I want to be presented with a login screen, so that I can login and tailor my experience.
- As a user, I want to be presented with a description of the requirements of several job listings relevant to my search query, so that I can learn more and be able to click on further content on the site.
- As a user, I want to be able to use this data to search for relevant video resources, so that I can click on it to bring up YouTube videos.
- As a user, I want to be able to save resources of my choosing, so that I can see them the next time I login and re-visit them.

### Software Requirements

- Link to requirements [here](requirements.md)

### Domain Model diagrams [1](images/domain-model-1.jpeg) and [2](images/domain-model-2.jpeg)

### Wireframe diagram [here](images/wireframes.jpeg)

### Entity Relationship Diagram [here](ERD-projectprep.png)

- Table 1: user - responsible for storing name and username
- Table 2: video - responsible for storing saved videos for each user (title, url, description, note)
- Table 3: job - responsible for storing saved jobs for each user (title, url, note)

## Credits and Collaborators

- Chance Harmon (TA)
- Nicco Ryan (TA)
- Skyler Burger (TA)
- Nicholas Carignan
