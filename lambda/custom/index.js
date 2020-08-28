//
// lambda/custom/index.js
//
// LOST THEN FOUND skill
//

'use strict';

/* CONSTANTS */

const SKILL_NAME = "EEWOCS Kids Lost Then Found";

// Library for developing Alexa skills
const Alexa = require('ask-sdk');
//const Alexa = require('ask-sdk-core');

// Adapter to connect with S3 for persistence of user data across sessions
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');

// Localization client initialized below in an interceptor
const i18next = require('i18next');

// Library for simplifying common tasks
const _ = require('lodash');

// Utilities for common functions
const utils = require('./utils');
const {
    getS3PreSignedUrl,
    getTimeZone,
    getCurrentHour,
    capitalizeFirstLetter,
    isRequestType,
    isIntentName,
    isOneOfIntentNames,
    isIntentRequestWithIntentName,
    isSessionState,
    isYes,
    isNo,
    getPerson,
    getPersonId,
    getSlotResolutionValues,
    getSlotResolutionIds,
    disjunction,
    Thing
} = utils;

// Localized resources used by the localization client
const languageStrings = require('./resources/languageStrings');
// States to help manage the flow
const states = require('./states');

// A service for managing things to find
const LostFoundService = require('./lostFoundService');

const S3BucketName = process.env.S3_PERSISTENCE_BUCKET;
const config = {
  bucketName: S3BucketName
};
const S3Adapter = new persistenceAdapter.S3PersistenceAdapter(config);
console.log("S3PersistenceAdapter", S3Adapter);


//
// INTENT HANDLERS
//

//
// LaunchRequestHandler
//
// Invoked when a user launches the skill
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        //return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
        return isRequestType(handlerInput, 'LaunchRequest')
            || isIntentRequestWithIntentName(handlerInput, 'AMAZON.StartOverIntent');
    },
    async handle(handlerInput) {
        console.log("Handler:", "LaunchRequestHandler");
        // const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var sessionAttributes = await handlerInput.attributesManager.getPersistentAttributes();
        if (sessionAttributes === undefined) {
            sessionAttributes = await handlerInput.attributesManager.getSessionAttributes();
        } else {
            await handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }
        console.log("sessionAttributes", sessionAttributes);
        // if (sessionAttributes.state === undefined) { // _.isEmpty(things)
        //     sessionAttributes.state = states.REMEMBER_THING;
        //     return getRememberedThingsResponse(handlerInput);
        // }

        // Sound effects and visuals throughout the experience will be based on the user's time of day
        // This is fetched once per session
        const hour = await getCurrentHour(handlerInput);
        sessionAttributes.isDayTime = hour >= 7 && hour <= 21; // We say day time is between 7 AM and 9 PM
        console.log("isDayTime", sessionAttributes.isDayTime);

        // Get user's remembered things, if any, so far 
        const {lostFoundService} = handlerInput;
        const things = await lostFoundService.getThings();
        
        // User has zero things remembered, so need to remember
        if (_.isEmpty(things)) {
            console.log("things EMPTY");
            // User has no remembered things, need to remember at least one to continue
            sessionAttributes.state = states.REMEMBER_THING;
            // sessionAttributes.things = [];
            await handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            await handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
            await handlerInput.attributesManager.savePersistentAttributes();
            return getInitialResponse(handlerInput);
        } else {
            console.log("things NOT EMPTY");
            // User has regmembered things, so offer to find one
            sessionAttributes.state = states.FIND_THING;
            await handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            await handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
            await handlerInput.attributesManager.savePersistentAttributes();
            console.log("things remembered",sessionAttributes.things);
            return getWelcomeBackAndFindThingResponse(handlerInput);
        }
    }
};

//
// Returns a response offering to start using Lost Then found
//
function getInitialResponse(handlerInput) {
    return handlerInput.responseBuilder
        .speak(handlerInput.t('GOTO_LOST_THEN_FOUND_PROMPT'))
        .reprompt(handlerInput.t('GOTO_LOST_THEN_FOUND_REPROMPT'))
        .getResponse();
}

//
// Returns a response offering to remember a thing to be found
//
function getRememberedThingsResponse(handlerInput) {
    return handlerInput.responseBuilder
        .speak(handlerInput.t('ASK_TO_REMEMBER_THING'))
        .reprompt(handlerInput.t('ASK_TO_REMEMBER_THING_REPROMPT'))
        .getResponse();
}

//
// Returns a response offering to find a thing to be found
//
function getFindThingResponse(handlerInput) {
    return handlerInput.responseBuilder
        .speak(handlerInput.t('ASK_TO_FIND_THING'))
        .reprompt(handlerInput.t('ASK_TO_FIND_THING_REPROMPT'))
        .getResponse();
}

function getWelcomeBackAndFindThingResponse(handlerInput) {
    return handlerInput.responseBuilder
        .speak(handlerInput.t('WELCOME_BACK_ASK_TO_FIND_THING'))
        .reprompt(handlerInput.t('WELCOME_BACK_ASK_TO_FIND_THING_REPROMPT'))
        .getResponse();
}

//
// RememberThingIntentHandler
//
// Invoked when a user wishes to remember location for a thing, or first time using it.
const RememberThingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RememberThingIntent';
    },
    async handle(handlerInput) {
        console.log("Handler:", "RememberThingIntentHandler");
        var sessionAttributes = await handlerInput.attributesManager.getSessionAttributes();
        console.log("sessionAttributes", sessionAttributes);
        // var object = handlerInput.requestEnvelope.request.intent.slots.thing.value;
        // var location = handlerInput.requestEnvelope.request.intent.slots.location.value;
        var item = Alexa.getSlotValue(handlerInput.requestEnvelope, 'thing');
        console.log("item", item);
        var location = Alexa.getSlotValue(handlerInput.requestEnvelope, 'location');
        console.log("location", location);
        const athing = new Thing(item, location);
        console.log("thing remembered", athing);

        var things;
        // User has zero things remembered, so need to remember
        if (sessionAttributes.things === undefined) {
            // User has no remembered things, need to remember at least one to continue
            things = [];
        } else {
            things = sessionAttributes.things;
        }
        console.log("things", things);
        // User has remembered things, so offer to find one
        things.push(athing);
        sessionAttributes.things = things;
        sessionAttributes.state = states.VISIT_LOST_FOUND;
        console.log("sessionAttributes", sessionAttributes);
        await handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        await handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
        await handlerInput.attributesManager.savePersistentAttributes();
        console.log("things remembered",sessionAttributes.things);
        return getFindThingResponse(handlerInput);
    }
};

//
// FindThingIntentHandler
//
const FindThingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FindThingIntent';
    },
    async handle(handlerInput) {
        console.log("Handler:", "FindThingIntentHandler");
        var sessionAttributes = await handlerInput.attributesManager.getSessionAttributes();
        console.log("sessionAttributes", sessionAttributes);
        sessionAttributes.state = states.FIND_THING;
        var item = Alexa.getSlotValue(handlerInput.requestEnvelope, 'thing');
        console.log("item", item);
        
        if (_.isEmpty(sessionAttributes.things)) {
            console.log("sessionAttributes.things", sessionAttributes.things);
            return handlerInput.responseBuilder
                .speak(handlerInput.t('GOTO_LOST_THEN_FOUND_REPROMPT'))
                .reprompt(handlerInput.t('GOTO_LOST_THEN_FOUND_REPROMPT'))
                .getResponse();
        } else {
            const thingToFind = sessionAttributes.things.find(thing => thing._name === item);
            console.log("thingToFind",thingToFind);
            const name = thingToFind._name;
            console.log("name", name);
            const location = thingToFind._location;
            console.log("location", location);
            const speakOutput = `<prosody volume="soft"> ${name} is located ${location}.</prosody> <break strength="strong"/> What else should we do? Remember or find another thing?`;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(handlerInput.t('GOTO_LOST_THEN_FOUND_REPROMPT'))
                .getResponse();
        }


        
        // const speakOutput = 'Finding Lost Things';

        // return handlerInput.responseBuilder
        //     .speak(speakOutput)
        //     .reprompt('What lost thing are you looking for?')
        //     .getResponse();
    }
};

//
// HelpIntentHandler
//
// Invoked when a user asks for help
//
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        console.log("Handler:", "HelpIntentHandler");
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(handlerInput.t('HELP'))
            .reprompt(handlerInput.t('HELP_REPROMPT'))
            .getResponse();
    }
};

//
// CancelAndStopIntentHandler
//
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        console.log("Handler:", "CancelAndStopIntentHandler");

        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        console.log("Handler:", "FallbackIntentHandler");
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log("Handler:", "SessionEndedRequestHandler");
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        console.log("Handler:", "IntentReflectorHandler");
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        console.log("Handler:", "ErrorHandler");
        console.log("sessionAttributes:", sessionAttributes);
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//
// INTERCEPTORS
//

//
// LocalizationInterceptor
//
// This request interceptor will bind two translations function to handlerInput:
// 't' which returns the translated value
// 'randomT' which will return a random element if the translated value is an array
//
const LocalizationInterceptor = {
    process(handlerInput) {
        i18next.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings,
            returnObjects: true
        }).then((t) => {
            handlerInput.t = (...args) => {
                return t(...args);
            };
            handlerInput.randomT = (...args) => {
                const value = t(...args);
                if (_.isArray(value)) {
                    // if the translated value is an array, return a random element
                    return _.sample(value);
                } else {
                    return value;
                }
            };
        });
    }
};

//
// LostFoundServiceInterceptor
//
// Creates a new instance of the LostFoundService on each request
const LostFoundServiceInterceptor = {
    process(handlerInput) {
        handlerInput.lostFoundService = new LostFoundService(handlerInput);
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RememberThingIntentHandler,
        FindThingIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addRequestInterceptors(
        {
            process(handlerInput) {
                console.log('Request:', JSON.stringify(handlerInput, null, 2));
            }
        },
        LocalizationInterceptor,
        LostFoundServiceInterceptor
    )
    .addResponseInterceptors(
        {
            process(handlerInput, response) {
                console.log('Response:', JSON.stringify(response, null, 2));
            }
        }
    )
    .addErrorHandlers(
        ErrorHandler
    )
    .withPersistenceAdapter(S3Adapter)
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('home/lost-then-found/v1.0')
    .lambda();