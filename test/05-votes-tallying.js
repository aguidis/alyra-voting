const {
    BN,
    expectEvent,
    expectRevert
} = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");

contract("Votes tallying", async accounts => {
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const voter4 = accounts[4];
    const voter5 = accounts[5];
    const voter6 = accounts[6];

    const unregistredVoter = accounts[7];

    beforeEach(async () => {
        this.instance = await Voting.new();

        await this.instance.addVoter(voter1)
        await this.instance.addVoter(voter2)
        await this.instance.addVoter(voter3)
        await this.instance.addVoter(voter4)
        await this.instance.addVoter(voter5)
        await this.instance.addVoter(voter6)

        await this.instance.startProposalSession();

        await this.instance.submitProposal("13ème mois obligatoire.", { from: voter1 });
        await this.instance.submitProposal("Tickets resto à 20 euros.", { from: voter2 });
        await this.instance.submitProposal("Avoir des chaises Herman Miller Aeron.", { from: voter3 });

        await this.instance.endProposalSession();

        await this.instance.startVotingSession();
    });

});
