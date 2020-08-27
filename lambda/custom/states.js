//
// lambda/custom/states.js
//
// LOST THEN FOUND skill
//

// States to help manage the flow
module.exports = {
	VISIT_LOST_FOUND: 'VISIT_LOST_FOUND', // When the user wishes to visit the Lost Then Found Shop
    REGISTER_THING: 'REGISTER_THING', // When the user is prompted to register an item to track
    CHECK_THING: 'CHECK_THING', // When the user is prompted to review an item registered to track
    FIND_THING: 'FIND_THING', // When the user is prompted to provide an item that s/he thinks is lost
    REMOVE_THING: 'REMOVE_THING' // When the user is prompted to no longer track an item
};