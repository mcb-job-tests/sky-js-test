
const constants = require("./constants");

let channelRewardMap = new Map();

channelRewardMap.set( constants.SPORTS, 'CHAMPIONS_LEAGUE_FINAL_TICKET');
channelRewardMap.set( constants.KIDS, 'N/A');
channelRewardMap.set( constants.MUSIC, 'KARAOKE_PRO_MICROPHONE');
channelRewardMap.set( constants.NEWS, 'N/A');
channelRewardMap.set( constants.MOVIES, 'PIRATES_OF_THE_CARIBBEAN_COLLECTION');

function rewardsService( customerAccountNumber, portfolio, eligibilityService ) {
    switch ( eligibilityService( customerAccountNumber ) ){
        case constants.CUSTOMER_ELIGIBLE:
            return {
                data : portfolio.map( channelSubscription => channelRewardMap.get( channelSubscription ) )
                                .filter( reward => reward !== 'N/A')
            };
        case constants.CUSTOMER_INELIGIBLE:
            return {
                data: [],
            };
        case constants.TECHNICAL_FAILURE_EXCEPTION:
            return {
                data: [],
            };
        case constants.INVALID_ACCOUNT_NUMBER_EXCEPTION:
            throw ({ name: constants.INVALID_ACCOUNT_NUMBER_EXCEPTION, customerAccountNumber: customerAccountNumber });
        default:
            throw constants.ILLEGAL_ELIGIBILITY_SERVICE_OUTPUT;
    }
}

module.exports = {
    rewardsService: rewardsService,
    channelRewardMap: channelRewardMap
};