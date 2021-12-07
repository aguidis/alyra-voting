const {
    BN,
    expectEvent,
    expectRevert
} = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");

contract("Voting session", async accounts => {
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
    });

    it("Can start voting session only by admin (owner of contract).", async () => {
        const receipt = await this.instance.startVotingSession();

        expectEvent(receipt, 'WorkflowStatusChange', {
            previousStatus: new BN(2),
            newStatus: new BN(3)
        });

        const state = await this.instance.state();
        assert.equal(state, 3);
    });

    it("Should not be able to start voting session as non admin.", async () => {
        await expectRevert(
            this.instance.startVotingSession({ from: voter1 }),
            "Ownable: caller is not the owner"
        );
    });

    it("Can vote for proposal only by registred voters.", async () => {
        await this.instance.startVotingSession();

        await this.instance.voteForProposal(0, { from: voter1 });
        await this.instance.voteForProposal(0, { from: voter2 });
        await this.instance.voteForProposal(1, { from: voter3 });

        const proposal0 = await this.instance.getProposalDetails(0);
        const proposal1 = await this.instance.getProposalDetails(1);

        assert.equal(proposal0.description, "13ème mois obligatoire.");
        assert.equal(proposal0.voteCount, 2);

        assert.equal(proposal1.description, "Tickets resto à 20 euros.");
        assert.equal(proposal1.voteCount, 1);

        const totalVotes = await this.instance.totalVotes();

        assert.equal(totalVotes, 3);
    });

    it("Should not be able to vote as non registred voter", async () => {
        await this.instance.startVotingSession();

        await expectRevert(
            this.instance.voteForProposal(0, { from: unregistredVoter }),
            "You are not registered for voting."
        );
    });

    it("Should not be able to vote twice", async () => {
        await this.instance.startVotingSession();

        await this.instance.voteForProposal(0, { from: voter1 });

        await expectRevert(
            this.instance.voteForProposal(0, { from: voter1 }),
            "You cannot vote twice."
        );
    });

    it("Should fire 'Voted' event after registration.", async () => {
        await this.instance.startVotingSession();

        const receipt = await this.instance.voteForProposal(0, { from: voter1 });

        expectEvent(receipt, 'Voted', {
            voter: voter1,
            proposalId: new BN(0)
        });
    });

    it("Can end voting session only by admin (owner of contract).", async () => {
        await this.instance.startVotingSession();

        await this.instance.voteForProposal(0, { from: voter1 });
        await this.instance.voteForProposal(0, { from: voter2 });
        await this.instance.voteForProposal(1, { from: voter3 });

        const receipt = await this.instance.endVotingSession();

        expectEvent(receipt, 'WorkflowStatusChange', {
            previousStatus: new BN(3),
            newStatus: new BN(4)
        });

        const state = await this.instance.state();
        assert.equal(state, 4);
    });

    it("Should not be able to end voting session without a vote", async () => {
        await this.instance.startVotingSession();

        await expectRevert(
            this.instance.endVotingSession(),
            "Nobody has voted yet."
        );
    });
});
