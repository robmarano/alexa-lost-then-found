//
// lambda/custom/resources/en.js
//
// taken in part from
// https://github.com/alexa/skill-sample-nodejs-pet-tales/blob/master/lambda/custom/resources/en.js
//
// Localized content for en-* locales
//

const {getHelpAudio, getHelpVoice} = require('./utils');

module.exports = {
    GENERIC_GREETING: "Hey there.",
    GENERIC_RETURN_GREETING: "Great to see you back.",
    USE_LOST_THEN_FOUND_PROMPT: "So happy to see you. A new digital lost and found shop opened up in town. It's called Lost Then Found. It helps you keep track of where you place or hide your valuable things. Would you be interested in cataloging your things and where you placed them? I promise to not tell anyone.",
    USE_LOST_THEN_FOUND_REPROMPT: "Would you like to catalog or find your things at the Lost Then Found shop?",
    GET_THINGS: "Would you like me to tell you where {{name}} is?",
    GET_THINGS_REPROMPT: "Would you like to find {{name}}?",

    FIRST_VISIT: "Great! Alright, let’s go.",
    RETURN_VISIT: "Alright, let’s go to the pet shop then and look at some more animals.",

    SHOP_KEEPER_GREETING: "<voice name='Hans'>Hey there, name’s Tim! Let me know if you need anything while you’re looking around. I've got cats, dogs, and all types of rare creatures.</voice>",
    SHOP_KEEPER_GREETING_HAS_PETS: [
        "<voice name='Hans'>Welcome back. What can I show you today? {{animalTypesAvailable}}?</voice>",
        "<voice name='Hans'>Hey there. Good to see you again. Let me know what you'd like to see. {{animalTypesAvailable}}?</voice>"
    ],
    PET_TYPE_PROMPT: "Thanks Tim. <break time='2s'/>So, what type of animal are you thinking about getting?",
    ENTER_THING_STORE_REPROMPT: "What thing are you thinking about finding? {{thingTypesAvailable}}?",
    THING_TYPE_keys: "a key or set of keys",
    THING_TYPE_smartphone: "a smartphone like Android or iPhone",
    THING_TYPE_rare_collection: "something from the rare collection",

    THING_TYPE_SELECTED_keys: "Without keys you can't get in a house or drive a car. Please show us where the keys are.",
    THING_TYPE_SELECTED_smartphone: "Finally you're off the phone. Whew. Ok. Please show us the phone.",
    THING_TYPE_SELECTED_rare_collection: "So mysterious and intriguing. Can we see those exotic things?",
    THING_TYPE_NOT_AVAILABLE: "I don’t think our shop carries secrets like where to find that. {{prompt}}",
    THING_TYPES_AVAILABLE_REPROMPT: "What would you like to find? {{thingTypesAvailable}}",

    SHOP_KEEPER_RIGHT_THIS_WAY: [
        "<voice name='Hans'>Of course. Right this way.</voice>",
        "<voice name='Hans'>Absolutely, let's go this way.</voice>",
        "<voice name='Hans'>Sure, follow me.</voice>"
    ],
    THINGS_AVAILABLE_COUNT: "<voice name='Hans'>We have {{count}} things in our shop right now.</voice>",
    THING_INTRO: "<voice name='Hans'>{{thing.name}}, a {{thing.type}}</voice> ",
    THING_TYPE_SELECTED_PROMPT: "<voice name='Hans'>Would you like to hear more about this one?</voice>",
    THING_TYPE_SELECTED_PROMPT_plural: "<voice name='Hans'>Which one would you like to know more about?</voice>",
    THING_TYPE_SELECTED_REPROMPT: "Which one would you like to hear more about?",
    THING_CATALOG_DISPLAY_TITLE: "Your secret stash of things Catalog",

    ABOUT_PET_RASCAL: [
        getPetVoice('RASCAL', 'Hi Hi Hi. Hello. How are you? I\'m Rascal.'),
        getPetAudio('RASCAL'),
        getPetVoice('RASCAL', 'I just love love love to run and jump and play. Please please please let me be your pet!'),
        getPetAudio('RASCAL')
    ],
    ABOUT_PET_BONBON: [
        getPetVoice('BONBON', 'Bonjour, mon amie.'),
        getPetAudio('BONBON'),
        getPetVoice('BONBON', 'I am Bonbon. I am the finest fluffy poodle you have ever laid your eyes upon.'),
        getPetAudio('BONBON')
    ],
    ABOUT_PET_LARRY: [
        getPetVoice('LARRY', 'Hey bud.'),
        getPetAudio('LARRY'),
        getPetVoice('LARRY', 'Pick me, Larry.'),
        getPetAudio('LARRY'),
        getPetAudio('LARRY', 'I\'m a mighty little guy. I\'ll be your chihuahua pal for life.'),
        getPetAudio('LARRY')
    ],
    ABOUT_PET_CHESTER: [
        getPetAudio('CHESTER'),
        getPetVoice('CHESTER', 'Hello there, kind citizen. It is I, Chester. Please do me the pleasure of choosing me as your feline companion.')
    ],
    ABOUT_PET_BELLE: [
        getPetVoice('BELLE', 'If you must pick someone I guess you can go for me, Belle. Whatever makes you happy, I suppose.'),
        getPetAudio('BELLE')
    ],
    ABOUT_PET_KOKO: [
        getPetVoice('KOKO', 'I can tell you and I would be the best of friends.'),
        getPetAudio('KOKO'),
        getPetVoice('KOKO', 'Please let me be a part of your family. Name\'s Koko.')
    ],
    ABOUT_PET_SCALES: [
        getPetVoice('SCALES', 'Scales at your service.'),
        getPetAudio('SCALES'),
        getPetVoice('SCALES', 'Why don\'t you choose someone sensational like myself?'),
        getPetAudio('SCALES')
    ],
    ABOUT_PET_FEATHERS: [
        getPetAudio('FEATHERS'),
        getPetVoice('FEATHERS', 'Hey there buddy ol\' Pal. I\'m Feathers. I know a thing or two about good pets. One of those things being I\'m a perfect one. So choose me.'),
        getPetAudio('FEATHERS')
    ],
    ABOUT_PET_HOPS: [
        getPetVoice('HOPS', 'Hi.'),
        getPetAudio('HOPS'),
        getPetVoice('HOPS', 'Hello.'),
        getPetAudio('HOPS'),
        getPetVoice('HOPS', 'I\'m hops. I love bouncing around. I\'m the bestest bunny.')
    ],

    ASK_TO_REGISTER_THING: "<voice name='Hans'>Would you like to register {{thing.name}} so you can find it later?</voice>",

    ANIMAL_NOT_AVAILABLE: "I don't think that one is available. Who else would you like to see?",
    ANIMAL_NOT_AVAILABLE_REPROMPT: "Which one would you like to hear more about?",

    DO_NOT_ADOPT_PET: "Ok. What would you like to see next? {{animalTypesAvailable}}",
    ADOPT_PET: "We would like that cute, adorable, {{pet.name}}.",
    SENT_BACK_PROMPT: "Your house won't have enough room for all these pets. {{pet.name}} went back to Tim's pet shop. You can always go back to the pet shop and get him again.",
    SHOP_KEEPER_GOODBYE: "<voice name='Hans'>Great choice! Thanks for stopping in!</voice>",
    NEW_PET_AT_HOME: "What a cutie! Next time you stop by Pet Tales, {{pet.name}} will be right here waiting for you.",
    PLAY_AGAIN: "Would you like to play again?",

    THANKS_FOR_PETS_RASCAL: [
        [getPetAudio('RASCAL'), getPetVoice('RASCAL', 'Thanks, thanks, thanks! I needed that!')],
        [getPetAudio('RASCAL'), getPetVoice('RASCAL', 'Awww. You’re the best.')],
        [getPetAudio('RASCAL'), getPetVoice('RASCAL', 'I never can get enough of these pets.')]
    ],
    THANKS_FOR_PETS_LARRY: [
        [getPetAudio('LARRY'), getPetVoice('LARRY', 'Oh yes.'), getPetAudio('LARRY'), getPetVoice('LARRY', 'Right behind the ear. That\'s the best.')],
        [getPetAudio('LARRY'), getPetVoice('LARRY', 'I needed that.')],
        [getPetAudio('LARRY'), getPetVoice('LARRY', 'Thank you for that.')]
    ],
    THANKS_FOR_PETS_BONBON: [
        [getPetVoice('BONBON', 'Ahh. Merci. Merci.'), getPetAudio('BONBON')],
        [getPetVoice('BONBON', 'S\'il vous plaît right on the top of the head.'), getPetAudio('BONBON')],
        [getPetVoice('BONBON', 'Je t\'aime. You are wonderful.'), getPetAudio('BONBON')]
    ],
    THANKS_FOR_PETS_CHESTER: [
        [getPetVoice('CHESTER', 'I do enjoy a pet or two. Thank you.'), getPetAudio('CHESTER')],
        [getPetVoice('CHESTER', 'You are without a doubt the best'), getPetAudio('CHESTER')],
        [getPetVoice('CHESTER', 'I could not ask for anything better than this'), getPetAudio('CHESTER')]
    ],
    THANKS_FOR_PETS_BELLE: [
        [getPetAudio('BELLE'),getPetVoice('BELLE', 'Thanks for the pet, I guess.')],
        [getPetVoice('BELLE', 'Ok. ok.'),getPetAudio('BELLE'), getPetVoice('BELLE', 'That\'s enough.')],
        [getPetVoice('BELLE', 'Please. Enough with the pets already'), getPetAudio('BELLE')]
    ],
    THANKS_FOR_PETS_KOKO: [
        [getPetAudio('KOKO'),getPetVoice('KOKO', 'You are the best. Thanks so much.')],
        [getPetAudio('KOKO'),getPetVoice('KOKO', 'Thanks for that.')],
        [getPetAudio('KOKO'),getPetVoice('KOKO', 'That was great. Thanks.')]
    ],
    THANKS_FOR_PETS_SCALES: [
        [getPetVoice('SCALES', 'Ssssensational pet. Thankssss.'), getPetAudio('SCALES')],
        [getPetVoice('SCALES', 'How very ssssssweet of you.'), getPetAudio('SCALES')],
        [getPetVoice('SCALES', 'You make me feel so ssssspecial.'), getPetAudio('SCALES')]
    ],
    THANKS_FOR_PETS_FEATHERS: [
        [getPetVoice('FEATHERS', 'Awww.'), getPetAudio('FEATHERS'), getPetVoice('FEATHERS', 'You make me a happy little birdy.')],
        [getPetVoice('FEATHERS', 'Aww shucks.'), getPetAudio('FEATHERS'), getPetVoice('FEATHERS', 'I appreciate it.')],
        [getPetAudio('FEATHERS'), getPetVoice('FEATHERS', 'You know how to make a little birdy feel special.')]
    ],
    THANKS_FOR_PETS_HOPS: [
        [getPetAudio('HOPS'), getPetAudio('HOPS'), getPetVoice('HOPS', 'Thanks buddy old pal.')],
        [getPetAudio('HOPS'), getPetAudio('HOPS'), getPetVoice('HOPS', 'Gee golly. You are fantastic.')],
        [getPetAudio('HOPS'), getPetAudio('HOPS'), getPetVoice('HOPS', 'That was swell.')]
    ],

    GIVE_MORE_PETS: "Would you like to pet {{pet.name}} again, or, go to the pet shop?",

    PET_NAME_RASCAL: "Rascal",
    PET_NAME_BONBON: "Bonbon",
    PET_NAME_LARRY: "Larry",
    PET_NAME_CHESTER: "Chester",
    PET_NAME_BELLE: "Belle",
    PET_NAME_KOKO: "Koko",
    PET_NAME_SCALES: "Scales",
    PET_NAME_FEATHERS: "Feathers",
    PET_NAME_HOPS: "Hops",

    PET_BREED_BEAGLE: "beagle",
    PET_BREED_POODLE: "poodle",
    PET_BREED_CHIHUAHUA: "chihuahua",
    PET_BREED_BRITISH_SHORTHAIR: "British shorthair",
    PET_BREED_RAGDOLL: "ragdoll",
    PET_BREED_KORAT: "korat",
    PET_BREED_SNAKE: "snake",
    PET_BREED_BIRD: "bird",
    PET_BREED_BUNNY: "bunny",

    HELP: "Lost Then Found is a utility in which you can save secret location of your most prized possessions like your keys, your wallet, or smartphone. If you ever get stuck or lost and need to start over your experience say \"Alexa, start over.\" ",
    HELP_REPROMPT: "If you ever get stuck or lost in Lost Then Found and need to start over your experience say \"Alexa, start over.\"",

    FALLBACK: "Sorry, I didn't catch that. Say that again please.",
    FALLBACK_REPROMPT: "Say that again please.",

    ERROR: "<audio src=\"soundbank://soundlibrary/animals/amzn_sfx_cat_angry_meow_1x_02\"/> Oh no! Looks like there was a problem. Please try again later.",
    EXIT: "Goodbye!",
    DISJUNCTION: "or"
};