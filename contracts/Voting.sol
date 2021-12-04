//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

// let instance = await Voting.deployed();
// instance.addVoter(accounts[1]);instance.addVoter(accounts[2]);instance.addVoter(accounts[3]);
// instance.getWhitelistedVoters();
// instance.startProposalSession();
// instance.submitProposal("coucou 1", {from: accounts[1]});
// instance.submitProposal("coucou 2", {from: accounts[2]});
// instance.submitProposal("coucou 3", {from: accounts[3]});
// instance.endProposalSession();

contract Voting is Ownable {
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    uint256 public winningProposalId;

    WorkflowStatus public state;

    address[] private whiteListedVoters;
    mapping(address => Voter) private addressToVoter;

    Proposal[] private proposals;

    constructor() {
        state = WorkflowStatus.RegisteringVoters;
    }

    function addVoter(address _voterAddress) public onlyOwner {
        require(
            state == WorkflowStatus.RegisteringVoters,
            "You can no longer add voters."
        );

        require(
            _voterAddress != address(0),
            "You must add a valid ETH address."
        );

        require(
            addressToVoter[_voterAddress].isRegistered == false,
            "Voter already added."
        );

        whiteListedVoters.push(_voterAddress);
        addressToVoter[_voterAddress] = Voter(true, false, 0);

        emit VoterRegistered(_voterAddress);
    }

    function startProposalSession() public onlyOwner {
        require(whiteListedVoters.length > 1, "Voting system need voters !");
        require(
            state == WorkflowStatus.RegisteringVoters,
            "You can no longer start the proposal session."
        );

        WorkflowStatus oldStatus = state;
        state = WorkflowStatus.ProposalsRegistrationStarted;

        emit WorkflowStatusChange(oldStatus, state);
    }

    function submitProposal(string memory _description) public {
        require(
            state == WorkflowStatus.ProposalsRegistrationStarted,
            "You can no longer submit a proposal."
        );

        require(
            addressToVoter[msg.sender].isRegistered == true,
            "Submit denied because participant does not belong to registered voters."
        );

        proposals.push(Proposal(_description, 0));
        uint256 proposalId = proposals.length - 1;

        emit ProposalRegistered(proposalId);
    }

    function endProposalSession() public onlyOwner {
        require(
            proposals.length > 1,
            "Voting system needs 2 proposals at least !"
        );
        require(
            state == WorkflowStatus.ProposalsRegistrationStarted,
            "You can no longer end the proposal session."
        );

        WorkflowStatus oldStatus = state;
        state = WorkflowStatus.ProposalsRegistrationEnded;

        emit WorkflowStatusChange(oldStatus, state);
    }

    function startVotingSession() public onlyOwner {
        require(
            state == WorkflowStatus.ProposalsRegistrationEnded,
            "You can no longer start the voting session."
        );

        WorkflowStatus oldStatus = state;
        state = WorkflowStatus.VotingSessionStarted;

        emit WorkflowStatusChange(oldStatus, state);
    }

    function voteForProposal(uint256 _proposalId) public {
        require(
            state == WorkflowStatus.VotingSessionStarted,
            "You can no longer vote for proposal."
        );

        Voter storage currentVoter = addressToVoter[msg.sender];

        require(
            currentVoter.isRegistered == true,
            "You are not registered for voting."
        );

        require(
            currentVoter.hasVoted == false,
            "You are not registered for voting."
        );

        Proposal storage proposal = proposals[_proposalId];

        // https://ethereum.stackexchange.com/questions/30912/how-to-compare-strings-in-solidity/82739
        string memory empty = "";
        require(
            keccak256(bytes(proposal.description)) == keccak256(bytes(empty)),
            "Proposal does not exist."
        );

        currentVoter.votedProposalId = _proposalId;
        currentVoter.hasVoted = true;

        proposal.voteCount++;

        emit Voted(msg.sender, _proposalId);
    }

    function endVotingSession() public onlyOwner {
        require(
            state == WorkflowStatus.VotingSessionStarted,
            "You can no longer end the voting session."
        );

        // check si une proposal a au moins un vote
        // check si il y a egalite

        WorkflowStatus oldStatus = state;
        state = WorkflowStatus.VotingSessionEnded;

        emit WorkflowStatusChange(oldStatus, state);
    }

    function getWhitelistedVoters() public view returns (address[] memory) {
        return whiteListedVoters;
    }

    function getVoterVote(address voterAddress) public view returns (uint256) {
        require(
            addressToVoter[msg.sender].isRegistered == true,
            "This address does not belong to registered voters."
        );

        require(
            addressToVoter[msg.sender].hasVoted == true,
            "Vote not submitted yet."
        );

        return addressToVoter[voterAddress].votedProposalId;
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    function getProposalDetails(uint256 _proposalId)
        public
        view
        returns (Proposal memory)
    {
        return proposals[_proposalId];
    }
}
