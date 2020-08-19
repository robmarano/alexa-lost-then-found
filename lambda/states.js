// States to help manage the flow
module.exports = {
	VISIT_LOST_THEN_FOUND_SHOP: 'VISIT_LOST_THEN_FOUND_SHOP', // When the user wishes to visit the Lost Then Found Shop
    REGISTER_THING: 'REGISTER_THING', // When the user is prompted to register an item to track
    CHECK_THING: 'CHECK_THING', // When the user is prompted to review an item registered to track
    FIND_THING: 'FIND_THING', // When the user is prompted to provide an item that s/he thinks is lost
    LEARN_MORE: 'LEARN_MORE', // When the user is prompted to hear more about how to use "Echo Geckos Lost Then Found" Alexa skill
    REMOVE_THING: 'REMOVE_THING' // When the user is prompted to no longer track an item
};