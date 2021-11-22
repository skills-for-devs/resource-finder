'use strict';

//------ packages
const express = require('express');
require('dotenv').config();
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

//------ set up the application
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

//------- global variables
const DATABASE_URL = process.env.DATABASE_URL;
const VIDEO_API_KEY = process.env.VIDEO_API_KEY;
const JOBS_API_KEY = process.env.JOBS_API_KEY;
const client = new pg.Client(DATABASE_URL);
const PORT = process.env.PORT || 3111;

// ------- routes
app.get('/', (req, res) => {
  res.render('pages/login.ejs', {data: false});
});
app.get('/about/:id', (req, res) => {
  const profileId = req.params.id;
  res.render('pages/about.ejs', {user: profileId});
});
app.post('/signup', getSignup); // login portal
app.post('/login', getLogin);

app.get('/search/new/:id', (req, res) => {
  const userDatabase = `SELECT * FROM profile WHERE id=$1;`;
  const sqlArray = [req.params.id];
  client.query(userDatabase, sqlArray).then(results => {
    res.render('pages/search.ejs', {user: results.rows[0].id});
  });
});

app.post('/search/:id', getSearch);
app.get('/resources/:id', viewResources); //view saved elements from db
app.delete('/resources/user/:id/resource/:resourceid', deleteResource);
// app.error('/error', getError); // for errors
app.put('/resources/user/:id/resource/:resourceid', updateResource); // for editing saved favorite
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
  const userQuery = req.body.name;
  const userNameQuery = req.body.username;
  //If they are saying signup - if username doesn't exist
  const sqlQuery = 'INSERT INTO profile (firstname, username) VALUES ($1, $2) RETURNING *;';
  const sqlArray = [userQuery, userNameQuery];
  client.query(sqlQuery, sqlArray).then((result) => {
    //here is where to handle Sql error -- send to error page so they can navigate back and try again.====
    // console.log(result.rows);
    res.redirect(`/search/new/${result.rows[0].id}`);
  });
  //custom catch - listening for error, if so, redirect to page with message "choose a unique username"
  // check database for existing username based on user input (if user selects sign up)
  // if no matching username, create and add new
  // then res.redirect to search page
}

function getSearch(req,res) {
  // do both video and job search functions
  const query = req.body.query;
  let contentObject = {};
  const jobsUrl= `https://data.usajobs.gov/api/search?Keyword=${query}`;
  const videoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=21&q=${query}&type=video&key=${VIDEO_API_KEY}`;
  superagent.get(jobsUrl).set('Authorization-Key', JOBS_API_KEY).then(jobsInfo => {
    const jobs = jobsInfo.body.SearchResult.SearchResultItems.map(jobObject => new Job(jobObject));
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

}

function saveVideoResource(req, res) {
  const profileId = req.params.id;
  const savedVideo = req.body;
  const sqlQuery = 'INSERT INTO video (title, url, description, image, note, profile_id) VALUES ($1, $2, $3, $4, $5, $6);';
  const sqlArray = [savedVideo.title, savedVideo.url, savedVideo.description, savedVideo.image, savedVideo.note, profileId];
  client.query(sqlQuery, sqlArray).then(() => {
    //307 re-direct tip from Nicco(TA)
    res.redirect(307, `/search/${profileId}?${savedVideo.query}`);
  });
}

function saveJobResource(req, res) {
  const profileId = req.params.id;
  const savedJob = req.body;
  const sqlQuery = 'INSERT INTO job (title, url, logo, note, profile_id) VALUES ($1, $2, $3, $4, $5);';
  const sqlArray = [savedJob.title, savedJob.url, savedJob.logo, savedJob.note, profileId];
  client.query(sqlQuery, sqlArray).then(() => {
    //307 re-direct tip from Nicco(TA)
    res.redirect(307, `/search/${profileId}?${savedJob.query}`);
  });
}

function viewResources(req, res) {
  const profileId = req.params.id;
  //ORDER By tip from Skyler(TA) for sorting
  const videosQuery = `SELECT * FROM video WHERE profile_id=${profileId} ORDER BY id ASC;`;
  const jobsQuery = `SELECT * FROM job WHERE profile_id=${profileId} ORDER BY id ASC;`;
  // console.log(videosQuery);
  client.query(videosQuery).then(videoResults => {
    client.query(jobsQuery).then(jobsResults => {
      res.render('pages/savedresources.ejs', {jobs: jobsResults.rows, videos: videoResults.rows, user: profileId});
    });
  });

}

function updateResource(req, res) {
  const profileId = req.params.id;
  const resourceTable = req.body['resource-type'];
  if(resourceTable === 'job'){
    const sqlQuery = 'UPDATE job SET title=$1, url=$2, logo=$3, note=$4, profile_id=$5 WHERE id=$6;';
    const sqlArray = [req.body.title, req.body.url, req.body.logo, req.body.note, req.body.user, req.params.resourceid];
    client.query(sqlQuery, sqlArray).then(() => {
      res.redirect(`/resources/${profileId}`);
    });
  } else {
    const sqlQuery = 'UPDATE video SET title=$1, url=$2, description=$3, image=$4, note=$5, profile_id=$6 WHERE id=$7;';
    const sqlArray = [req.body.title, req.body.url, req.body.description, req.body.image, req.body.note, req.body.user, req.params.resourceid];
    client.query(sqlQuery, sqlArray).then(() => {
      res.redirect(`/resources/${profileId}`);
    });
  }

}


function deleteResource(req, res) {
  // from resources page, user selects button to delete one from db
  const resourceId = req.params.resourceid;
  const profileId = req.params.id;
  const resourceTable = req.body['resource-type'];
  console.log('this is resourceTable', resourceTable);
  if(resourceTable === 'job'){
    const sqlQuery = 'DELETE FROM job WHERE id=$1;';
    const sqlArray = [resourceId];
    client.query(sqlQuery, sqlArray).then(() => {
      res.redirect(`/resources/${profileId}`);
    });
  } else {
    const sqlQuery = 'DELETE FROM video WHERE id=$1;';
    const sqlArray = [resourceId];
    client.query(sqlQuery, sqlArray).then(() => {
      res.redirect(`/resources/${profileId}`);
    });
  }
}


// function getError(req, res) {
//   // 404 page
// }


// ------- Helper functions

function Video(videoObject) {
  // constructors for rendering youtube video
  this.title = videoObject.snippet.title;
  this.url = `https://youtube.com/embed/${videoObject.id.videoId}`;
  // thanks to Chance(TA) for helping us to add the embed feature for videos!
  this.description = videoObject.snippet.description;
  this.image = videoObject.snippet.thumbnails.medium.url;
}

//   // constructor for rendering github job
// function Job(jobObject) {
//   this.title = jobObject.title;
//   this.url = jobObject.url;
//   this.description = jobObject.description;
//   this.logo = jobObject.company_logo;
// }

function Job(jobObject) {
  // constructor for rendering usa job
  this.title = jobObject.MatchedObjectDescriptor.PositionTitle;
  this.url = jobObject.MatchedObjectDescriptor.PositionURI;
  this.description = jobObject.MatchedObjectDescriptor.QualificationSummary;
}


// ------- Start server
client.connect()
  .then(() => {
    app.listen(PORT), console.log(`Runnin' on ${PORT}`);
  })
  .catch(error => {
    console.error(error);
  });
