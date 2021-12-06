const {
    BN,
    expectEvent,
    expectRevert
} = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");

contract("Proposals registration", async accounts => {
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const voter4 = accounts[4];

    beforeEach(async () => {
        this.instance = await Voting.new();

        await this.instance.addVoter(voter1)
        await this.instance.addVoter(voter2)
    });

    it("Can start registration session only by admin (owner of contract) and with enough voters.", async () => {
        const receipt = await this.instance.startProposalSession();

        expectEvent(receipt, 'WorkflowStatusChange', {
            previousStatus: new BN(0),
            newStatus: new BN(1)
        });

        const state = await this.instance.state();
        assert.equal(state, 1);
    });

    it("Should not be able to start registration session as non admin.", async () => {
        await expectRevert(this.instance.startProposalSession({ from: voter1 }), "Ownable: caller is not the owner");
    });

    it("Can submit proposal only by registred voter.", async () => {
        this.instance.startProposalSession();

        await this.instance.submitProposal("13ème mois obligatoire.", { from: voter1 });

        const proposals = await this.instance.getProposals();

        assert.lengthOf(proposals, 1)

        assert.equal(proposals[0].description, "13ème mois obligatoire.");
    });

    it("Should not be able to add empty proposal.", async () => {
        await this.instance.startProposalSession();

        await expectRevert(
            this.instance.submitProposal("", { from: voter1 }),
            "Proposal can't be empty."
        );
    })

    it("Should not be able to add proposals if proposals registration ended.", async () => {
        await this.instance.startProposalSession()

        await this.instance.submitProposal("13ème mois obligatoire.", { from: voter1 });
        await this.instance.submitProposal("Tickets resto à 20 euros.", { from: voter1 });

        await this.instance.endProposalSession()

        await expectRevert(
            this.instance.submitProposal("Des frites à la cantine."),
            "You can no longer submit a proposal."
        );
    })

    it("Should not be able to submit proposal if participant not registred as voter.", async () => {
        await this.instance.startProposalSession()

        await expectRevert(
            this.instance.submitProposal("Ticket restaurant de 20 euros.", { from: voter3 }),
            "Submit denied because participant does not belong to registered voters."
        );
    });

    it("Should fire 'ProposalRegistered' event after registration.", async () => {
        await this.instance.startProposalSession()

        const receipt = await this.instance.submitProposal("13ème mois obligatoire.", { from: voter1 });

        expectEvent(receipt, 'ProposalRegistered', {
            proposalId: new BN(0)
        });
    });

    it("Can end registration session only by admin (owner of contract) and with enough proposals.", async () => {
        this.instance.startProposalSession();

        await this.instance.submitProposal("13ème mois obligatoire.", { from: voter1 });
        await this.instance.submitProposal("Tickets resto à 20 euros.", { from: voter1 });

        const receipt = await this.instance.endProposalSession();

        expectEvent(receipt, 'WorkflowStatusChange', {
            previousStatus: new BN(1),
            newStatus: new BN(2)
        });

        const state = await this.instance.state();
        assert.equal(state, 2);
    });
});
