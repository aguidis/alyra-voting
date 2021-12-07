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

        await this.instance.voteForProposal(0, { from: voter1 });
        await this.instance.voteForProposal(0, { from: voter2 });
        await this.instance.voteForProposal(1, { from: voter3 });
        await this.instance.voteForProposal(0, { from: voter4 });
        await this.instance.voteForProposal(2, { from: voter5 });
        await this.instance.voteForProposal(2, { from: voter6 });
    });

    it("Can start tallying votes only by admin (owner of contract).", async () => {
        await this.instance.endVotingSession();

        const receipt = await this.instance.tallyingVotes();

        expectEvent(receipt, 'WorkflowStatusChange', {
            previousStatus: new BN(4),
            newStatus: new BN(5)
        });

        const state = await this.instance.state();
        assert.equal(state, 5);

        const winner = await this.instance.getWinner();

        assert.equal(winner.description, "13ème mois obligatoire.");
        assert.equal(winner.voteCount, 3);
    });

    it("Should not be able to start tallying votes if voting session is in progress.", async () => {
        await expectRevert(
            this.instance.tallyingVotes(),
            "You can start yet tailling the votes."
        );
    });
});
