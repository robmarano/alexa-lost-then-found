// Helper functions for generating Lost Then Found sound effects and SSML
const helpers = {
    LOST: {
        sound: "soundbank://soundlibrary/animals/amzn_sfx_dog_med_bark_1x_02",
        voice: (text) => `<voice name='Matthew'><prosody rate='fast'>${text}</prosody></voice>`
    },
    FOUND: {
        sound: "soundbank://soundlibrary/animals/amzn_sfx_dog_med_bark_1x_01",
        voice: (text) => `<voice name='Celine'>${text}</voice>`
    }
}

function getHelpAudio(helperName) {
    return {
        type: 'Audio',
        source: helpers[helperName].sound
    }
}

function getHelpVoice(helperName, text) {
    return {
        type: 'Speech',
        contentType: 'SSML',
        content: `<speak>${helpers[helperName].voice(text)}</speak>`
    }
}

module.exports = {
    getHelpVoice,
    getHelpAudio
}