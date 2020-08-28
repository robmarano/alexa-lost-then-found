//
// lambda/custom/resources/en-US.js
//
// taken in part from
// https://github.com/alexa/skill-sample-nodejs-pet-tales/blob/master/lambda/custom/resources/en.js
//
// Localized content for en-* locales
//

'use strict';

const {getHelpAudio, getHelpVoice} = require('./utils');

module.exports = {
    GOTO_LOST_THEN_FOUND_PROMPT: "Hello! So happy to see you. A new digital lost and found shop opened up in town here in Alexa Land. It's called Lost Then Found. It helps you keep track of where you place or hide your valuable things. I promise to not tell anyone. Please ask me to either remember a thing at a location, or, find a thing. Go ahead.",
    GOTO_LOST_THEN_FOUND_REPROMPT: "Would you like to me to remember or to find a thing of yours at the Lost Then Found?",
    
    ASK_TO_REMEMBER_THING: "What would you like me to remember for you?",
    ASK_TO_REMEMBER_THING_REPROMPT: "What should I remember for you?",
    
    ASK_TO_FIND_THING: "What would you like to find for you? Or would you like to remember another thing?",
    ASK_TO_FIND_THING_REPROMPT: "What should I find for you? Or should I remember another thing?",
    WELCOME_BACK_ASK_TO_FIND_THING: "Welcome back to Lost Then Found. What would you like to find for you? Or would you like to remember another thing?",
    WELCOME_BACK_ASK_TO_FIND_THING_REPROMPT: "Welcome back to Lost Then Found. What should I find for you? Or should I remember another thing?",
    
    FOUND_THING: "{{name}} is located {{location}}",
    NOT_FOUND_THING: "You did not tell me where {{name}} is hidden.",

    FIRST_VISIT: "Great! Alright, let’s go.",
    RETURN_VISIT: "Alright, let’s go to the pet shop then and look at some more animals.",

    HELP: "Lost Then Found is a utility in which you can save secret location of your most prized possessions like your keys, your wallet, or smartphone. If you ever get stuck or lost and need to start over your experience say \"Alexa, start over.\" ",
    HELP_REPROMPT: "If you ever get stuck or lost in Lost Then Found and need to start over your experience say \"Alexa, start over.\"",

    FALLBACK: "Sorry, I didn't catch that. Say that again please.",
    FALLBACK_REPROMPT: "Say that again please.",

    ERROR: "<audio src=\"soundbank://soundlibrary/animals/amzn_sfx_cat_angry_meow_1x_02\"/> Oh no! Looks like there was a problem. Please try again later.",
    EXIT: "Goodbye!",
    DISJUNCTION: "or"
};