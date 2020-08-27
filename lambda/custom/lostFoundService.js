//
// lambda/custom/lostFoundService.js
//
// LOST THEN FOUND skill
//

const _ = require('lodash');

// Define the types of things available to remember
// Make sure these values reflect the corresponding "LIST_OF_THINGS" custom slot ID in the interaction model
const thing_types = {
  KEYS: "keys",
  PHONE: "phone",
  BOOK: "book",
  MONEY: "money",
  WATCH: "watch",
  WALLET: "wallet",
  CREDIT_CARD: "credit card",
  REMOTE_CONTROL: "remote control",
  RING: "ring",
  EARRINGS: "earrings",
  PENCIL: "pencil",
  NINTENDO_SWITCH: "nintendo switch"
};

const location_types = {
	LINEN_CLOSET: "linen closet",
	KEY_CHAIN: "key chain",
	DRAWER: "drawer",
	SOFA: "sofa"
};

// Define each thing available
// The "name" field should correspond with the IDs defined in the "Name" custom slot
// "name" is a key to translations in resources
const things = [
    {
        name: "KEYS",
        type: thing_types.KEYS,
        location: location_types.SOFA,
        sound: "soundbank://soundlibrary/animals/amzn_sfx_dog_med_bark_1x_02",
        awakeSrc: "https://veoxmbq.s3.amazonaws.com/pet-tales/assets/Characters/png/Rascal.png",
        sleepSrc: "https://veoxmbq.s3.amazonaws.com/pet-tales/assets/Characters/png/Rascal_Sleep.png"
    }
];

// A helper for managing and adopting pets
class LostFoundService {

    constructor(handlerInput) {
        this.handlerInput = handlerInput;
    }
    
    
    // Returns a set of thing types with one or more things
    async getAvailableThingTypes() {
        const availableThings = await this.getAvailableThings();
        return _.uniq(_.map(availableThings, (a) => a.type));
    }

    // Returns a set of location types with things
    async getAvailableLocationTypes() {
        const availableLocations = await this.getAvailableThings();
        return _.uniq(_.map(availableThings, (a) => a.location));
    }

    // Returns a list of things still available for finding
    async getAvailableThings() {
        const persistentAttributes = await this.handlerInput.attributesManager.getPersistentAttributes();
        const {foundThings} = persistentAttributes;
        const unavailableThingNames = _.map(foundThings, (thing) => {
            return thing.name;
        });

        return _.filter(things, (thing) => {
            return !_.includes(unavailableThingNames, thing.name);
        });
    }

    // Returns a list of things of a given type available for finding
    async getAvailableThingsByType(type) {
        const availableThings = await this.getAvailableThings();
        return _.filter(availableThings, (thing) => {
            return thing.type === type;
        });
    }

    // Returns a list of all thing sounds
    getAllThingSounds() {
        return _.map(things, (thing) => {
            return thing.sound;
        });
    }

    // Returns a list of sounds each thing makes
    getThingSoundsByType(type) {
        return _.map(_.filter(things, (thing) => {
           return thing.type === type;
        }), (thing) => {
            return thing.sound;
        });
    }

    // Returns thing metadata for the given name
    getThing(name) {
        return _.find(things, (thing) => {
            return thing.name === name;
        });
    }

    // Returns true if a thing is available to be found
    async isRegistered(name) {
        const availableThings = await this.getAvailableThings();
        return _.includes(_.map(availableThings, (thing) => {
            return thing.name;
        }), name);
    }

    async findThing(thing) {
        const persistentAttributes = await this.handlerInput.attributesManager.getPersistentAttributes();
        _.defaults(persistentAttributes, {
            foundThings: []
        });
        persistentAttributes.foundThings.push(thing);

        // To keep this sample simple, we are only allowing a max of four found things
        // Least recently found things is the first to be sent back to the shop if this max is exceeded
        let thingFound;
        if (persistentAttributes.foundThings.length > 4) {
            thingFound = persistentAttributes.foundThings.shift();
            console.log("Sending back the last recently found thing:", thingFound.name);
        }

        await this.handlerInput.attributesManager.savePersistentAttributes();
        return thingSentBack;
    }

    async getFoundThings() {
        const persistentAttributes = await this.handlerInput.attributesManager.getPersistentAttributes();
        return persistentAttributes.foundThings || [];
    }
}

module.exports = LostFoundService;