## Vision:
A dynamic app/website that allows the user to search for free resources based on the details of relevant job descriptions. User is given the opportunity to sign in to their account, and enter a programming language they’d like to learn more about and potentially find jobs related to. Pulling from GitHub jobs and YouTube APIs the user is presented with jobs related to the language specified as well as informational videos to learn more about the language. Keywords in the job descriptions can be selected to offer further content.

## Pain point: 
User wants a job, wants to be qualified to get the job. Based on where they are now and what they’re interested in, where do they need to go and what do they need to learn to get there?

## Scope:

### IN
The web app provides information on current jobs from Github Jobs based on their search query. It also provides Youtube videos based on the same search query. User can scroll through additional results.

Users will be able to save videos and job listings to their favorites. Users can also add a short text note, edit, and delete to each favorite.

### OUT
It will not be a mobile app.
It will not pull from other job boards.
It will not store user data besides their saved entries and notes.
It will not submit to any job boards or upload videos.

## MVP:
- Login screen (user saved to database)
- Keyword/programming language search
- Job content from GitHub jobs API
- Informational video content from YouTube API
- User has ability to save content/videos to their login
- Text field for user to input notes related to content they are saving

## Stretch goals:
- Build in newsfeed pulling from Twitter/news API
- Build in meetups/eventbrite API
- Graphs
- Google search feature
- Additional styling
- Keyword search from job descriptions

## Functional Requirements
- A user can create an account using a name and email address.
- A user can submit keyword searches via a search box.
- A user can select job listings and videos to add to their favorites. These persist in the database until deleted.
- A user can add and edit custom notes to their saved jobs and videos.

## Data Flow
After login a user types a keyword into the search box. The user can browse the results by scrolling or pressing a button to add it to their favorites. A nav bar at the screen's top allows the search page to be reloaded. The user can select via the nav bar to visit an About Us page to learn more about the developers. The user can also select via the nav bar to view their favorites. On the favorites page, the user can scroll through a listing of what they previously selected.

## Security
- The URL uses SSL
- No password is required. No private/personal data is stored besides that related to the job search and the user's notes.
- Usability
- The site is styled using CSS Grid to be mobile-first. The design offers a clean layout with clear choices and obvious sections for user input and interaction.
