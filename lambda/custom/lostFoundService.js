//
// lambda/custom/lostFoundService.js
//
// LOST THEN FOUND skill
//

'use strict';

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

//
// A helper class for managing and adopting pets
//
class LostFoundService {

    //
    // constructor
    //
    constructor(handlerInput) {
        this.handlerInput = handlerInput;
    }

    //
    // getThings()
    //
    async getThings() {
        const persistentAttributes = await this.handlerInput.attributesManager.getPersistentAttributes();
        const {things} = persistentAttributes;
        return things;
    }
}

module.exports = LostFoundService;