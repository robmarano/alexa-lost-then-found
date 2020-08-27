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
// Adapter to connect with S3 for persistence of user data across sessions
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
// Localization client initialized below in an interceptor
const i18next = require('i18next');
// Library for simplifying common tasks
const _ = require('lodash');
// Used to calculate the user's time of day
const moment = require('moment-timezone');

// Utilities for common functions
const utils = require('./utils');
const {
    isRequestType,
    isIntentRequestWithIntentName,
    isOneOfIntentNames,
    isYes,
    isNo
} = utils;

// Localized resources used by the localization client
const languageStrings = require('./resources/languageStrings');
// States to help manage the flow
const states = require('./states');

// A service for managing things to find
const LostFoundService = require('./lostFoundService');

//
// INTENT HANDLERS
//

//
// LaunchRequestHandler
//
// Invoked when a user launches the skill or wants to play again after adopting a pet
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return isRequestType(handlerInput, 'LaunchRequest')
            || isIntentRequestWithIntentName(handlerInput, 'AMAZON.StartOverIntent')
            || isYes(handlerInput, states.PLAY_AGAIN);
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        // Sound effects and visuals throughout the experience will be based on the user's time of day
        // This is fetched once per session
        const hour = await getCurrentHour(handlerInput);
        sessionAttributes.isDayTime = hour >= 7 && hour <= 21; // We say day time is between 7 AM and 9 PM
        console.log("isDayTime", sessionAttributes.isDayTime);

        // Get the user's adopted pets
        const {petShopService} = handlerInput;
        const adoptedPets = await petShopService.getAdoptedPets();

        if (_.isEmpty(adoptedPets)) {
            // User has not pets; offer to go to the pet shop
            sessionAttributes.state = states.VISIT_PET_SHOP;
            return getNoAdoptedPetsResponse(handlerInput);
        } else {
            // User has adopted pets; offer to pet one
            sessionAttributes.state = states.GIVE_PETS;
            return getAdoptedPetsResponse(handlerInput, adoptedPets);
        }
    }
};

//
// HelpIntentHandler
//
// Invoked when a user asks for help
//
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return isIntentRequestWithIntentName(handlerInput, 'AMAZON.HelpIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(handlerInput.t('HELP'))
            .reprompt(handlerInput.t('HELP_REPROMPT'))
            .getResponse();
    }
};

//
// CancelAndStopIntentHandler
//
// Invoked when a user wants to stop or cancel
//
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return isRequestType(handlerInput, 'IntentRequest')
            && isOneOfIntentNames(handlerInput, 'AMAZON.CancelIntent', 'AMAZON.StopIntent', 'AMAZON.NoIntent');
    },
    handle(handlerInput) {
        // Give a goodbye message and end the session
        return handlerInput.responseBuilder
            .speak(handlerInput.t('EXIT'))
            .withShouldEndSession(true)
            .getResponse();
    }
};

//
// SessionEndedRequestHandler
//
// Invoked when the current skill session ends for any reason other than your code closing the session
//
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return isRequestType(handlerInput, 'SessionEndedRequest');
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        const {request} = handlerInput.requestEnvelope;
        const {reason} = request;

        console.log('Session ended with reason:', reason);

        if (reason === 'ERROR') {
            console.log('error:', JSON.stringify(request.error));
        }

        return handlerInput.responseBuilder.getResponse();
    }
};

//
// FallbackHandler
//
// Provides a graceful fallback message when no other handler can handle an IntentRequest
// This should be the last request handler configured in skill builder below
//
const FallbackHandler = {
    canHandle(handlerInput) {
        return isRequestType(handlerInput, 'IntentRequest');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(handlerInput.t('FALLBACK'))
            .reprompt(handlerInput.t('FALLBACK_REPROMPT'))
            .getResponse();
    }
};

//
// ErrorHandler
//
// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below
//
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);

        return handlerInput.responseBuilder
            .speak(handlerInput.t('ERROR'))
            .withShouldEndSession(true)
            .getResponse();
    }
};

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
 * The SkillBuilder acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The ORDER matters - they're processed top to bottom.
 */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        FallbackHandler // make sure FallbackHandler is last so it doesn't override your other IntentRequest handlers
    )
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
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName: process.env.S3_PERSISTENCE_BUCKET})
    )
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('reference-skills/lost-then-found/v1')
    .lambda();