const {
    BN,
    expectEvent,
    expectRevert
} = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");

contract("Proposals registration", async accounts => {
    beforeEach(async () => {
        this.instance = await Voting.new();
    });

    const randomUser = accounts[9];

    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const voter4 = accounts[4];

    it("Can start registration session only by admin (owner of contract) and with enough voters.", async () => {
        await this.instance.addVoter(voter1)
        await this.instance.addVoter(voter2)

        this.instance.startProposalSession();
    });

    it("Should not be able to start as non admin.", async () => {
        await expectRevert(this.instance.startProposalSession({ from: randomUser }), "Ownable: caller is not the owner");
    });

    it("Can submit proposal only by registred voter.", async () => {
        await this.instance.addVoter(voter1)
        await this.instance.addVoter(voter2)

        this.instance.startProposalSession();

        await this.instance.submitProposal("13ème mois obligatoire.", { from: voter1 });

        const proposals = await this.instance.getProposals();

        assert.lengthOf(proposals, 1)

        assert.equal(proposals[0].description, "13ème mois obligatoire.");
    });

    it("Should not be able to add proposals if proposals registration ended.", async () => {
        await this.instance.addVoter(voter1)
        await this.instance.addVoter(voter2)

        await this.instance.startProposalSession()

        await this.instance.submitProposal("13ème mois obligatoire.", { from: voter1 });
        await this.instance.submitProposal("Tickets resto à 20 euros.", { from: voter1 });

        await this.instance.endProposalSession()

        await expectRevert(
            this.instance.submitProposal("Des frites à la cantine."), "You can no longer submit a proposal.");
    })

    it("Should not be able to submit proposal if participant not registred as voter.", async () => {
        await this.instance.addVoter(voter1)
        await this.instance.addVoter(voter2)

        await this.instance.startProposalSession()

        await expectRevert(
            this.instance.submitProposal("Ticket restaurant de 20 euros.", { from: voter3 }),
            "Submit denied because participant does not belong to registered voters."
        );
    });

    it.only("Should fire 'VoterRegistered' event after registration.", async () => {
        await this.instance.addVoter(voter1)
        await this.instance.addVoter(voter2)

        await this.instance.startProposalSession()

        const receipt = await this.instance.submitProposal("13ème mois obligatoire.", { from: voter1 });

        expectEvent(receipt, 'ProposalRegistered', {
            proposalId: new BN(0)
        });
    });

    // Todo add tests for endProposalSession
});
