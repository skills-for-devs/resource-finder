'use strict';

//------ packages

const express = require('express');
require('dotenv').config();
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
const { response } = require('express');

//------ set up the application

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

//------- global variables

const DATABASE_URL = process.env.DATABASE_URL;
const VIDEO_API_KEY = process.env.VIDEO_API_KEY;
const client = new pg.Client(DATABASE_URL);
const PORT = process.env.PORT || 3111;
// const allJobs = [];
// const allVideos = [];

// ------- routes

app.get('/', (req, res) => {
  res.render('pages/login.ejs', {data: false});
});
app.post('/signup', getSignup); // login portal
app.post('/login', getLogin);
// app.get('/vidsearch', getVideoSearch); // render search input to query APIs

//placeholder for getting search to work
app.get('/search/new/:id', (req, res) => {
  const userDatabase = `SELECT * FROM profile WHERE id=$1;`;
  const sqlArray = [req.params.id];
  client.query(userDatabase, sqlArray).then(results => {
    res.render('pages/search.ejs', {user: results.rows[0]});
  });
});

// app.get('/search', getSearch);
app.post('/search/:id', getSearch);
// app.post('/search', saveResource); // save a chosen vid/job to their DB
app.get('/resources/:id', viewResources); //view saved elements from db
app.delete('/resources/:resourceid', deleteResource);
// app.error('/error', getError); // for errors
app.put('/resources', updateResource); // for editing saved favorite
app.post('/videoresources/:id', saveVideoResource);
app.post('/jobresources/:id', saveJobResource);


// --------- route callbacks
function getLogin(req, res) {
  const userQuery = req.body.name;
  const userNameQuery = req.body.username;
  const sqlQuery = 'SELECT * FROM profile WHERE username=$1;';
  const sqlArray = [userNameQuery];
  client.query(sqlQuery, sqlArray).then((result) => {
    if(result.rows.length === 0){
      res.render('pages/login.ejs', {data: true});
    } else {
      res.redirect(`/search/new/${result.rows[0].id}`);
    }
  });
}

function getSignup(req, res) {
  // console.log(req.body);
  const userQuery = req.body.name;
  const userNameQuery = req.body.username;
  //If they are saying signup - if username doesn't exist
  const sqlQuery = 'INSERT INTO profile (firstname, username) VALUES ($1, $2) RETURNING *;';
  const sqlArray = [userQuery, userNameQuery];
  client.query(sqlQuery, sqlArray).then((result) => {
    console.log(result.rows);
    res.redirect(`/search/new/${result.rows[0].id}`);
  });
  //custom catch - listening for error, if so, redirect to page with message "choose a unique username"
  //could have button on page - go back home

  // user is presented with a big beautiful login/signup box -- username, name
  // check database for existing username based on user input (if user selects sign up)
  // if no matching username, create and add new
  // then res.redirect to search page

  // check db for matching username/name based on user input (if user selects log in)
  // if credentials fail, give "try again" error message and reset fields
  // if pass, res.redirect to search page with saved user content from DB

}

function getSearch(req,res) {
  // do both video and job search functions
  // two superagent calls
  // store in same object and pass to front end to render
  console.log('this is body', req.body);
  console.log('this is params', req.params);
  const query = req.body.query;
  const location = 'seattle';
  let contentObject = {};
  // const allJobs = [];
  // const allVideos = [];
  const jobsUrl= `https://jobs.github.com/positions.json?description=${query}`;
  const videoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=21&q=${query}&type=video&key=${VIDEO_API_KEY}`;
  superagent.get(jobsUrl).then(jobsInfo => {
    const jobs = jobsInfo.body.map(jobObject => new Job(jobObject));
    contentObject.jobs = jobs;
  }).then(() => superagent.get(videoUrl).then(videoInfo => {
    const videos = videoInfo.body.items.map(videoObject => new Video(videoObject));
    contentObject.videos = videos;
    res.render('pages/show.ejs', {content: contentObject, user: req.params.id, query});
  }))
    .catch(error => {
      res.status(500).send('api failed');
      console.error(error);
    });


  //Notes from Chance:
  //Go out to one API, push results into an object
  //Chance suggested pulling default number of videos and pushing into an array, setting to display only __ at a time
  //.then go out to second API
  //push results into same object as first api
  //send the object with two keys (videos, jobs) to the front-end
}

// function a() {
//   superagent.get(videoUrl).then(videoInfo => {
//     console.log('this is video info', videoInfo);
//   }
// };

function getVideoSearch(req, res) {
  // user is presented with a search box to take their keyword query
  // upon submission, search is sent to youtube and github jobs apis as query
  // superagent voyages bravely into API abyss and returns, hopefully, with a quagmire of data
  // when that comes back, job 1 renders on the page (something like a search.ejs bookapp thing), and youtube (3 videos) render on the page.
  // user is presented with View More buttons for each (pagination/offset) (try offset of 3). Copy what worked for Yelp. Reference City Explorer front-end to see how it interfaced.
  // helper functions Video and Job are constructors to use JSON from API to render elements
  // const vidURL = VIDEO_API_KEY;
  // res.render an ejs partial on this same page?

}

function getJobSearch(req, res) {
  //
  //
}

function highlightKeywords() {
  // array of keywords (javascript, python, nodejs, etc etc)
  // use jquery to style each instance with emphasis. and on click, call new search query for clicked keyword
  //

}


function saveVideoResource(req, res) {
  console.log('this is body', req.body);
  console.log('this is params', req.params);
  const profileId = req.params.id;
  const savedVideo = req.body;
  const sqlQuery = 'INSERT INTO video (title, url, description, image, profile_id) VALUES ($1, $2, $3, $4, $5);';
  const sqlArray = [savedVideo.title, savedVideo.url, savedVideo.description, savedVideo.image, profileId];
  client.query(sqlQuery, sqlArray).then(() => {
    //307 re-direct tip from Nicco(TA)
    res.redirect(307, `/search/${profileId}?${savedVideo.query}`);
  });
  //this function triggers when user selects "Save Resource" button
  // sql query and array - insert into table the title and url for job and video - link, title, image placeholder
  // give visual confirmation (jquery to give feedback confirmation) (could be a snippet to say "you have X resources saved to your favorites") (a side panel)
  // could we have a text input form next to the Save Resource input to save resource to add "notes" to their saved resource? (add another table in the field for "notes") <form>(form sends the obj) $1, $2, $3, $4, etc (form sends the user textinput)</form>
  // this would be a put route
}

function saveJobResource(req, res) {
  const profileId = req.params.id;
  const savedJob = req.body;
  const sqlQuery = 'INSERT INTO job (title, url, logo, profile_id) VALUES ($1, $2, $3, $4);';
  const sqlArray = [savedJob.title, savedJob.url, savedJob.logo, profileId];
  client.query(sqlQuery, sqlArray).then(() => {
    //307 re-direct tip from Nicco(TA)
    res.redirect(307, `/search/${profileId}?${savedJob.query}`);
  });
}

function viewResources(req, res) {
  console.log(req.params);
  const profileId = req.params.id;
  const videosQuery = `SELECT * FROM video WHERE profile_id=${profileId};`;
  const jobsQuery = `SELECT * FROM job WHERE profile_id=${profileId};`;
  console.log(videosQuery);
  client.query(videosQuery).then(videoResults => {
    client.query(jobsQuery).then(jobsResults => {
      res.render('pages/savedresources.ejs', {jobs: jobsResults.rows, videos: videoResults.rows, user: profileId});
    });
  });
  // when user click button on nav, is taken to page with saved resources (videos, jobs, notes)
  // pg query from db for user
  // each element is displayed using ejs, h2, img, p
  //delete /edit button
  // console.log(req.params.id);
  // 
  // const id = req.params.id;
  // const sqlQuery = 'DELETE FROM resources WHERE id=$1;';
  // const sqlArray = [id];

  // client.query(sqlQuery, sqlArray)
  //   .then(() => {
  //     res.redirect('/');
  //   })
  //   .catch(() => {
  //     // res.redirect('/error');
  //   });
}

function updateResource(req, res) {
  // for updating notes on saved resource
  // on front-end, have form that sends this data:
  // const id = req.params.id;
  // const sqlQuery = 'UPDATE book SET author=$1, title=$2, image_url=$3, description=$4 WHERE id=$5;';
  // const sqlArray = [req.body.author, req.body.title, req.body.image_url, req.body.description, id];
  // client.query(sqlQuery, sqlArray)
  //   .then(() => {
  //     res.redirect(`/books/${id}`);
  //   })
  //   .catch(() => {
  //     res.redirect('/error');
  //   });

}


function deleteResource(req, res) {
  // from resources page, user selects button to delete one from db
  console.log(req.params);
  console.log(req.body['resource-type']);
  console.log(req.body);
  const resourceId = req.params.resourceid;
  const resourceTable = req.body['resource-type'];
  if(resourceTable === 'job'){
    const sqlQuery = 'DELETE FROM job WHERE id=$1;';
    const sqlArray = [resourceId];
    client.query(sqlQuery, sqlArray).then(() => {
      response.render(`/resources/${resourceId}`);
    });
  }
}


function getError(req, res) {
  // 404 page
}


// ------- Helper functions


function Video(videoObject) {
  // constructors for rendering youtube video
  this.title = videoObject.snippet.title;
  this.url = `https://youtube.com/watch?v=${videoObject.id.videoId}`;
  this.description = videoObject.snippet.description;
  this.image = videoObject.snippet.thumbnails.medium.url;
  // allVideos.push(this);
}

function Job(jobObject) {
  // constructor for rendering github job
  this.title = jobObject.title;
  this.url = jobObject.url;
  this.description = jobObject.description;
  this.logo = jobObject.company_logo;
  // allJobs.push(this);
}


//----- Event Listeners



// show more videos


// show next job









// ------- Start server

client.connect()
  .then(() => {
    app.listen(PORT), console.log(`Runnin' on ${PORT}`);
  })
  .catch(error => {
    console.error(error);
  });
