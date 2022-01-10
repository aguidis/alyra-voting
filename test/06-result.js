const {
    expectRevert
} = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");

contract("Vote result", async accounts => {
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

        await this.instance.voteForProposal(0, { from: voter1 });
        await this.instance.voteForProposal(0, { from: voter2 });
        await this.instance.voteForProposal(1, { from: voter3 });
        await this.instance.voteForProposal(0, { from: voter4 });
        await this.instance.voteForProposal(2, { from: voter5 });
        await this.instance.voteForProposal(2, { from: voter6 });

        await this.instance.endVotingSession();
    });

    it("Can see others voters votes only by registred voter.", async () => {
        await this.instance.tallyingVotes();

        const voter2VotedProposal = await this.instance.getVoterVote(voter2, { from: voter1 });
        assert.equal(voter2VotedProposal, 0);

        const voter3VotedProposal = await this.instance.getVoterVote(voter3, { from: voter1 });
        assert.equal(voter3VotedProposal, 1);

        const voter4VotedProposal = await this.instance.getVoterVote(voter4, { from: voter1 });
        assert.equal(voter4VotedProposal, 0);

        const voter5VotedProposal = await this.instance.getVoterVote(voter5, { from: voter1 });
        assert.equal(voter5VotedProposal, 2);

        const voter6VotedProposal = await this.instance.getVoterVote(voter6, { from: voter1 });
        assert.equal(voter6VotedProposal, 2);
    });

    it("Can see winning proposal details only by registred voter.", async () => {
        await this.instance.tallyingVotes();

        let winner = await this.instance.getWinner({ from: voter1 });

        assert.equal(winner.description, "13ème mois obligatoire.");
        assert.equal(winner.voteCount, 3);

        winner = await this.instance.getWinner({ from: voter2 });

        assert.equal(winner.description, "13ème mois obligatoire.");
        assert.equal(winner.voteCount, 3);

        winner = await this.instance.getWinner({ from: voter3 });

        assert.equal(winner.description, "13ème mois obligatoire.");
        assert.equal(winner.voteCount, 3);

        winner = await this.instance.getWinner({ from: voter4 });

        assert.equal(winner.description, "13ème mois obligatoire.");
        assert.equal(winner.voteCount, 3);

        winner = await this.instance.getWinner({ from: voter5 });

        assert.equal(winner.description, "13ème mois obligatoire.");
        assert.equal(winner.voteCount, 3);

        winner = await this.instance.getWinner({ from: voter6 });

        assert.equal(winner.description, "13ème mois obligatoire.");
        assert.equal(winner.voteCount, 3);
    });

    it("Should not be able to see winning proposal details if votes has not been tallied.", async () => {
        await expectRevert(
            this.instance.getWinner({ from: voter1 }),
            "The winning proposal is not defined yet."
        );
    });
});
