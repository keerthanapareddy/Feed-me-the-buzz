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

let outputP;
var adverbs = {};
var verbs = [];
var netflixCategories = {};
var fortuneTelling = {};
var fortuneSentences =[];
var activity = {};
var activity_in_sentence = [];
var moods = {};



var grammarSource = {
  // 'origin': '#[#number#][#plural_nouns#][#netflixCategories#][#verbsPast#][#adverb_in_sentence#]story#',
  // 'story': ['#number# #plural_nouns# that #adverb_in_sentence# #verbsPast# #fortuneSentences#',
  //          'Here is why #activity_in_sentence# #will# make you feel #moods#'
  //          ],
  'origin': ['I am #number# #netflixCategories#'],
  // 'story': ['#number# #plural_nouns# that #adverb_in_sentence# #verbsPast# #fortuneSentences#',
  //          'Here is why #activity_in_sentence# #will# make you feel #moods#'
  //          ],

  'number':['10','14','12','3','8','6','15','5'],
  'plural_nouns':['gifs','clips','sets','pairs','sentences','articles','tricks','Youtube videos'],  //10
  'netflixCategories': _.sample(netflixCategoriesParsed.categories),
  // 'verbsPast' :verbs,
 	'adverb_in_sentence': _.sample(adverbsParsed.adverbs)
  // 'fortuneSentences':_.flatten(fortuneSentences),
  // 'will':['could','would','will','can'],
  // 'activity_in_sentence':activity_in_sentence,
  // 'moods':moods
};

const generateString = () => {
  var grammar = tracery.createGrammar(grammarSource);
  grammar.addModifiers(tracery.baseEngModifiers);
  return grammar.flatten("#origin#");
}


app.intent('Default Welcome Intent', conv => {
  conv.ask('Hello, Welcome to Feed me the buzz. I can tell you the next Buzzfeed article you should read based on your interest in the 10 articles I present to you. Shall we start?');
});

app.intent('Get article', conv => {
  conv.ask(' Shall we start?');
});


app.intent('Get article - yes', conv => {
  let randomString = generateString();
  conv.close(`Here is the first ${_.flatten(randomString)}`);
});

app.intent('Get article - no', conv => {
  conv.close('No worries! Have a good day');
});

/*
const generateString = () => {
  grammarSource.adverb_in_sentence = adverbs.adverbs;

  //verbs
  for(var i = 0; i<verbsPast.verbs.length; i++){
   verbs.push(verbsPast.verbs[i].past);
    grammarSource.verbsPast = verbs;
  }
  grammarSource.netflixCategories = netflixCategories.categories;
  grammarSource.moods = moods.moods;


fortuneTelling.tarot_interpretations.forEach(interpretation => {
  fortuneSentences.push(interpretation.meaning.light)
})

  //fortune telling
  for(var i = 0; i<fortuneTelling.tarot_interpretations.length; i++){
    for(var j = 0; j<fortuneTelling.tarot_interpretations[i].meanings.light.length; j++){
    	fortuneSentences.push(fortuneTelling.tarot_interpretations[i].meanings.light[j]);
    	 // print(fortuneTelling.tarot_interpretations[i].meanings.light[j]);
      grammarSource.fortuneSentences = fortuneSentences;
    }
  }

  //activity
  for(var i = 0; i < activity.categories.length; i++){
    for(var j = 0; j < activity.categories[i].examples.length; j++){
   	 activity_in_sentence.push(activity.categories[i].examples[j]);
    	grammarSource.activity_in_sentence = activity_in_sentence;
    }
  }
}

*/


exports.feedMeTheBuzz = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
