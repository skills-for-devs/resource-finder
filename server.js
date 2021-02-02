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
const client = new pg.Client(DATABASE_URL);
const PORT = process.env.PORT || 3111;

// ------- routes

app.get('/', getLogin); // login portal
// app.get('/vidsearch', getVideoSearch); // render search input to query APIs
app.get('/search', getSearch);
app.post('/search', saveResource); // save a chosen vid/job to their DB
app.get('/resources', viewResources); //view saved elements from db
app.delete('/resources', deleteResource);
// app.error('/error', getError); // for errors
app.put('/resources', updateResource); // for editing saved favorite


// --------- route callbacks

function getLogin(req, res) {
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
  console.log(req.body.search);
  const query = req.body.search;
  const jobsUrl= `https://jobs.github.com/positions.json?description=${query}`;

  //Notes from Chance:
  //Go out to one API, push results into an object
  //Chance suggested pulling default number of videos and pushing into an array, setting to display only __ at a time
  //.then go out to second API
  //push results into same object as first api
  //send the object with two keys (videos, jobs) to the front-end
}

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


function saveResource(req, res) {
  //this function triggers when user selects "Save Resource" button
  // sql query and array - insert into table the title and url for job and video - link, title, image placeholder
  // give visual confirmation (jquery to give feedback confirmation) (could be a snippet to say "you have X resources saved to your favorites") (a side panel)
  // could we have a text input form next to the Save Resource input to save resource to add "notes" to their saved resource? (add another table in the field for "notes") <form>(form sends the obj) $1, $2, $3, $4, etc (form sends the user textinput)</form>
  // this would be a put route



}

function viewResources(req, res) {
  // when user click button on nav, is taken to page with saved resources (videos, jobs, notes)
  // pg query from db for user
  // each element is displayed using ejs, h2, img, p
  //delete /edit button
  // console.log(req.params.id);
  // 
  // const id = req.params.id;
  // const sqlQuery = 'DELETE FROM resources WHERE id=$1;';
  // const sqlArray = [id];

  client.query(sqlQuery, sqlArray)
    .then(() => {
      res.redirect('/');
    })
    .catch(() => {
      // res.redirect('/error');
    });

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
  // 
}


function getError(req, res) {
  // 404 page
}


// ------- Helper functions


function Video() {
  // constructors for rendering youtube video
}

function Job() {
  // constructor for rendering github job
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
