const Voting = artifacts.require("Voting");

// https://trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript 
// https://docs.openzeppelin.com/learn/writing-automated-tests
// https://betterprogramming.pub/a-few-tips-for-unit-testing-ethereum-smart-contract-in-solidity-d804062068fb
// https://dev.to/carlomigueldy/unit-testing-a-solidity-smart-contract-using-chai-mocha-with-typescript-3gcj
// https://dev.to/stermi/how-to-create-tests-for-your-solidity-smart-contract-2238
// https://ethereum-blockchain-developer.com/060-tokenization/04-add-unit-tests/
// https://programmer.ink/think/solidity-test-case-practice.html

let instance;

before(async () => {
    instance = await Voting.deployed();
})

contract("Voting test", async accounts => {
    const admin = accounts[0];

    describe("Initial State", () => {
        it("Should be open to voters registrations.", async () => {
            const state = await instance.state();
            assert.equal(state, 0);
        });

        it("Should have empty voters.", async () => {
            const whiteListedVoters = await instance.getWhitelistedVoters();
            assert.lengthOf(whiteListedVoters, 0)
        });

        it("Should have empty proposals.", async () => {
            const proposals = await instance.getProposals();
            assert.lengthOf(proposals, 0)
        });
    });

    describe("Voters registration", () => {
        it("Can add new voters by ETH address to the whitelist only by admin (owner of contract).", async () => {

        });

        it("Should be started only if proposals registration is open.", async () => {

        });

        it("Cannot add twice the same voter.", async () => {

        });

        it("Should fire 'VoterRegistered' event after registration.", async () => {

        });
    });

    describe("Proposals registration", () => {
        it("Can start registration only by the administrator.", async () => {

        });

        it("Should be started if there is a minimum amount of voters.", async () => {

        });

        it("Should be started only if voters registration is open.", async () => {

        });

        it("Should fire 'ProposalsRegistrationStarted' event after proposals registration has started.", async () => {

        });

        it("Can submit a proposal only if registration is open.", async () => {

        });

        it("Can submit a proposal only if member of the whitelist.", async () => {

        });

        it("Should fire 'ProposalRegistered' event after proposal submit.", async () => {

        });

        it("Can close registration only by the administrator.", async () => {

        });

        it("Should be only closed if there is a minimum amount of proposals.", async () => {

        });

        it("Should fire 'ProposalsRegistrationEnded' event after proposal registration is closed.", async () => {

        });
    });

    describe("Voting session", () => {
        it("Can start session only by the administrator.", async () => {

        });

        it("Should fire 'VotingSessionStarted' event after voting session has started.", async () => {

        });

        it("Can vote only if member of the whitelist.", async () => {

        });

        it("Can close voting only by the administrator.", async () => {

        });

        it("Should be only closed if there is a minimum amount of votes.", async () => {

        });

        it("Should fire 'VotingSessionEnded' event after voting session is closed.", async () => {

        });
    });

    describe("Voting result", () => {
        it("Can start voting result only by the administrator.", async () => {

        });

        it("Can check winning proposal by everyone.", async () => {

        });
    });
});
