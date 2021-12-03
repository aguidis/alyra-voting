const Voting = artifacts.require("Voting");

let instance;

before(async () => {
    instance = await Voting.deployed();
})

contract("Voting setup", async accounts => {
    const admin = accounts[0];

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
