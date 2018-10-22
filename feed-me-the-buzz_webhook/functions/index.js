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

var count = 0;

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
  'story': ['Do you prefer #activity# over #activity#',
            'Do you enjoy #activity#',
            'Do you think you are #fortune#',
            'Do you sometimes feel #moods#'
           ],
    'result':['#resultPrefix# #resultSentence#'],

  'resultSentence':['#number# #plural_nouns# that #adverb# #verbsPast# #fortune#',
            'Here is why #activity# #will# make you feel #moods#'
          ],

  'resultPrefix':['You got',
                  'Your result is',
                  'The buzzfeed article you got is',
                  'The buzzfeed article you should read next is'
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

const resultStringFunction = () => {
  var grammar = tracery.createGrammar(grammarSource);
  grammar.addModifiers(tracery.baseEngModifiers);
  return grammar.flatten("#result#");
}



app.intent('Default Welcome Intent', conv => {
  conv.ask('Hello, Welcome to Feed me the buzz. Answer these 5 questions, and I can tell you the next article you should read on the internet. Shall we start?');
});


app.intent('Default Welcome Intent - no', conv => {
  conv.close('No worries! Have a good day');
});


app.intent('Get article', conv => {
  let randomString = generateString();
  let resultString = resultStringFunction();
  count = count + 1;
  if(count < 6){
    conv.ask(`${randomString}`);
  }else if(count > 6 || count == 6){
    conv.close(`${resultString}`);
  }
});

app.intent('Quit', conv => {
  conv.close('No worries! Have a good day');
});


exports.feedMeTheBuzz = functions.https.onRequest(app);
