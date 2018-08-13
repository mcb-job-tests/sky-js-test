const {rewardsService} = require("./redeemService");
const constants = require("./constants");

const chai = require("chai");
const assert = chai.assert;
const sinon = require("sinon");

describe("rewardsService test", () => {
    let eligibilityService = sinon.stub();

    beforeEach( () => {
        eligibilityService.withArgs( 123 ).returns( constants.CUSTOMER_ELIGIBLE );
        eligibilityService.withArgs( -666 ).returns( constants.INVALID_ACCOUNT_NUMBER_EXCEPTION );
        eligibilityService.withArgs( 666 ).returns( constants.CUSTOMER_INELIGIBLE );
        eligibilityService.withArgs( null ).returns( constants.TECHNICAL_FAILURE_EXCEPTION );
        eligibilityService.withArgs( '123' ).returns( );
    });

    it("checks an eligible customer can redeem correct rewards", () => {
        const rewards = rewardsService( 123, [ constants.MOVIES, constants.NEWS, constants.MUSIC ], eligibilityService );

        assert.equal( true, rewards.data.includes( 'PIRATES_OF_THE_CARIBBEAN_COLLECTION' ) );
        assert.equal( true, rewards.data.includes( 'KARAOKE_PRO_MICROPHONE' ) );
        assert.equal( false, rewards.data.includes( 'N/A' ) );
        assert.equal( false, rewards.data.includes( 'CHAMPIONS_LEAGUE_FINAL_TICKET' ) );
    });

    it("checks an ineligible customer cannot redeem rewards", ()=>{
        const rewards = rewardsService( 666, [ constants.MOVIES, constants.NEWS, constants.MUSIC ], eligibilityService );
        assert.equal( true, rewards.data.length === 0);
    });

    it("checks an Invalid account number throws correct exception", ()=>{
        let rewards = null;
        try {
             rewards = rewardsService( -666, [ constants.MOVIES, constants.NEWS, constants.MUSIC ], eligibilityService );
        } catch( error ) {
            assert.equal( null, rewards );
            assert.equal( constants.INVALID_ACCOUNT_NUMBER_EXCEPTION, error.name );
            assert.equal( -666, error.customerAccountNumber );
        }
    });

    it("checks a technical failure does not return rewards", ()=>{
        let rewards = rewardsService( null, [ constants.MOVIES, constants.NEWS, constants.MUSIC ], eligibilityService );
        assert.equal( true, rewards.data.length === 0);
    });

    it("checks for Illegal EligibilityService output", ()=>{
        let rewards = null;
        try {
            rewards = rewardsService( '123', [ constants.MOVIES, constants.NEWS, constants.MUSIC ], eligibilityService );
        } catch( error ) {
            assert.equal( null, rewards );
            assert.equal( constants.ILLEGAL_ELIGIBILITY_SERVICE_OUTPUT, error);
        }
    });

});