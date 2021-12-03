const {
    expectEvent,
    expectRevert
} = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");

contract("Voter registration", async accounts => {
    beforeEach(async () => {
        this.instance = await Voting.new();
    });

    const randomUser = accounts[9];

    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const voter4 = accounts[4];

    it("Can add new voters to the whitelist only by admin (owner of contract).", async () => {
        await this.instance.addVoter(voter1)
        await this.instance.addVoter(voter2)
        await this.instance.addVoter(voter3)

        const whiteListedVoters = await this.instance.getWhitelistedVoters();

        assert.lengthOf(whiteListedVoters, 3)
    });

    it("Should not be able to add new voter to the whitelist as non admin.", async () => {
        await expectRevert(this.instance.addVoter(voter1, { from: randomUser }), "Ownable: caller is not the owner");
    });

    it("Should not be able to add new voter if proposals registration started.", async () => {
        await this.instance.addVoter(voter1)
        await this.instance.addVoter(voter2)
        await this.instance.addVoter(voter3)

        await this.instance.startProposalSession()

        await expectRevert(this.instance.addVoter(voter4), "You can no longer add voters.");
    })

    it("Cannot add twice the same voter.", async () => {
        await this.instance.addVoter(voter1)

        await expectRevert(this.instance.addVoter(voter1), "Voter already added.");
    });

    it("Should fire 'VoterRegistered' event after registration.", async () => {
        const receipt = await this.instance.addVoter(voter1);

        expectEvent(receipt, 'VoterRegistered', {
            voterAddress: voter1
        });
    });
});