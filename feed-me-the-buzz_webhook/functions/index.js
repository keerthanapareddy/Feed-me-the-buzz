const functions = require('firebase-functions');
const { dialogflow } = require('actions-on-google');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
var tracery = require('tracery-grammar');
//npm install lodash
const _ = require('lodash')

const fs = require('fs');
const activitiesRaw = fs.readFileSync('activities.json');
const activitiesParsed = JSON.parse(activitiesRaw);
console.log(activitiesParsed);

const adverbsRaw = fs.readFileSync('adverbs.json');
const adverbsParsed = JSON.parse(adverbsRaw);

const fortuneTellingRaw = fs.readFileSync('fortuneTelling.json');
const fortuneTellingParsed = JSON.parse(fortuneTellingRaw);

const moodsRaw = fs.readFileSync('moods.json');
const moodsParsed = JSON.parse(moodsRaw);

const netflixCategoriesRaw = fs.readFileSync('netflixCategories.json');
const netflixCategoriesParsed = JSON.parse(netflixCategoriesRaw);

const verbsRaw = fs.readFileSync('verbs.json');
const verbsParsed = JSON.parse(verbsRaw);

const app = dialogflow();

let outputP;
var adverb = {};
var verbs = [];
var netflixCategories = {};
var fortune = {};
var fortuneSentences =[];
var activity = {};
var moods = {};


var grammarSource = {
  'origin': ['#story#'],
  'story': ['Would you be interested in #number# #plural_nouns# that #adverb# #verbsPast# #fortune#',
            'Would you read an article  Here is why #activity# #will# make you feel #moods#',
            'Would you prefer #activity# over #activity#',
            'Do you enjoy #activity#',
            'Do you think you are #fortune#'
           ],


  'number':['10','7','12','3','8','6','9','5','4','2'],
  'plural_nouns':['gifs','clips','sets','pairs','sentences','articles','tricks','Youtube videos'],  //10
  'netflixCategories': netflixCategoriesParsed.categories,
  'verbsPast' :verbsParsed.verbs,
 	'adverb': adverbsParsed.adverbs,
  'fortune': fortuneTellingParsed.fortune,
  'will':['could','would','will','can'],
  'activity': activitiesParsed.activities,
  'moods': moodsParsed.moods
};



const generateString = () => {
  var grammar = tracery.createGrammar(grammarSource);
  grammar.addModifiers(tracery.baseEngModifiers);
  return grammar.flatten("#origin#");
}


app.intent('Default Welcome Intent', conv => {
  conv.ask('Hello, Welcome to Feed me the buzz. I can tell you the next Buzzfeed article you should read based on your answers. Shall we start?');
});


app.intent('Default Welcome Intent - no', conv => {
  conv.close('No worries! Have a good day');
});


app.intent('Get article', conv => {
  let randomString = generateString();
  conv.ask(`${randomString}`);
});

app.intent('Get article - yes', conv => {
  let randomString = generateString();
  conv.ask(`${randomString}`);
});

app.intent('Get article - no', conv => {
  let randomString = generateString();
  conv.ask(`${randomString}`);
});

exports.feedMeTheBuzz = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
