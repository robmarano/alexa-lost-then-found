//
// lambda/custom/utils.js
// in part shared from
// https://github.com/alexa/skill-sample-nodejs-pet-tales/blob/master/lambda/custom/utils.js
// and
// https://github.com/garystafford/alexa-skill-azure-facts/blob/master/lambda/custom/index.js
//
// LOST THEN FOUND skill
//

'use strict';

// Used to interface with Alexa services
const Alexa = require('ask-sdk');
// Used to interface to AWS services
const AWS = require('aws-sdk');
// Used to calculate the user's time of day
const moment = require('moment-timezone');

const _ = require('lodash');

// S3 client to access files stored in S3
const s3SigV4Client = new AWS.S3({
    signatureVersion: 'v4',
    region: process.env.S3_PERSISTENCE_REGION
});

// Get S3 pre-signed URL
function getS3PreSignedUrl(s3ObjectKey) {

    const bucketName = process.env.S3_PERSISTENCE_BUCKET;
    const s3PreSignedUrl = s3SigV4Client.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: s3ObjectKey,
        Expires: 60*1 // the Expires is capped for 1 minute
    });
    console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`);
    return s3PreSignedUrl;
}

// Returns the time zone of the user's Alexa device
async function getTimeZone(handlerInput) {
    const {serviceClientFactory, requestEnvelope} = handlerInput;
    const {deviceId} = requestEnvelope.context.System.device;
    const client = serviceClientFactory.getUpsServiceClient();
    return await client.getSystemTimeZone(deviceId)
}

// Returns the current hour based on the user's time zone
async function getCurrentHour(handlerInput) {
    const timeZone = await getTimeZone(handlerInput);
    console.log("User's time zone:", timeZone);
    return moment.tz(timeZone).hours();
}

// Format names which come over as all lowercase from Alexa
function capitalizeFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function isRequestType(handlerInput, requestType) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === requestType;
}

function isIntentName(handlerInput, intentName) {
    return Alexa.getIntentName(handlerInput.requestEnvelope) === intentName;
}

function isOneOfIntentNames(handlerInput, ...intentNames) {
    return intentNames.includes(Alexa.getIntentName(handlerInput.requestEnvelope));
}

function isIntentRequestWithIntentName(handlerInput, intentName) {
    return isRequestType(handlerInput, 'IntentRequest')
        && isIntentName(handlerInput, intentName);
}

function isSessionState(handlerInput, state) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    return sessionAttributes.state === state;
}

function isYes(handlerInput, state) {
    return isRequestType(handlerInput, 'IntentRequest')
        && isIntentName(handlerInput, 'AMAZON.YesIntent')
        && isSessionState(handlerInput, state);
}

function isNo(handlerInput, state) {
    return isRequestType(handlerInput, 'IntentRequest')
        && isIntentName(handlerInput, 'AMAZON.NoIntent')
        && isSessionState(handlerInput, state);
}

function getPerson(handlerInput) {
    return handlerInput.requestEnvelope.context.System.person;
}

function getPersonId(handlerInput) {
    const person = getPerson(handlerInput);
    if (person) {
        return person.personId;
    }
}

function getSlotResolutionValues(handlerInput, slotName) {
    const slot = Alexa.getSlot(handlerInput.requestEnvelope, slotName);
    const authorities = _.get(slot, 'resolutions.resolutionsPerAuthority', []);
    return _.flatten(_.map(authorities, (authority) => {
        return authority.values;
    }));
}

function getSlotResolutionIds(handlerInput, slotName) {
    const values = getSlotResolutionValues(handlerInput, slotName);
    return _.map(values, (value) => {
        return value.value.id;
    });
}

function isAplSupported(handlerInput) {
    const interfaces = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope);
    const aplInterface = interfaces["Alexa.Presentation.APL"];
    return _.get(aplInterface, 'runtime.maxVersion') >= "1.1";
}

function addAplIfSupported(handlerInput, token, document, data = {}) {
    if (isAplSupported(handlerInput)) {
        handlerInput.responseBuilder
            .addDirective({
                "type": "Alexa.Presentation.APL.RenderDocument",
                "token": token,
                "document": document,
                "datasources": {
                    "data": {
                        "type": "object",
                        "properties": data
                    }
                }
            });
    }
}

function getAplADirective(token, document, data = {}) {
    return {
        "type": "Alexa.Presentation.APLA.RenderDocument",
        "token": token,
        "document": document,
        "datasources": {
            "data": {
                "type": "object",
                "properties": data
            }
        }
    }
}

/**
 * Formats an array of strings for speech
 *
 * Example input: ["milk", "cookies"]
 * Example output: "milk, or, cookies"
 *
 * Note: this logic may not work for all locales
 */
function disjunction(handlerInput, array) {
    if (array.length === 1) {
        return array[0];
    }
    return array.slice(0, -1).concat(handlerInput.t("DISJUNCTION")).concat(array[array.length - 1]).join(", ");
}

//
// Thing class
//
class Thing {
    constructor(name, location) {
        this._name = name;
        this._location = location;
    }
    
    get name() {
        return this._name.toUpperCase();
    }
    
    set name(newName) {
        this._name = newName;
    }
    
    get location() {
        return this._location.toUpperCase();
    }
    
    set location(newLocation) {
        this._location = newLocation;
    }
}

module.exports = {
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
    isAplSupported,
    addAplIfSupported,
    getAplADirective,
    disjunction,
    Thing
};