# Voting system

The smart contract voting system is designed for a small organization whose voters, defined beforehand, are registered on a whitelist thanks to their Ethereum address.
They can submit new proposals during a proposal registration session, and can vote on the proposals during the voting session.

- Voting is not secret
- Each voter can see the votes of others
- The winner is determined by a simple majority
- The proposal with the most votes wins

## Stack

- Ethereum in memory blockchain, Ganache Version 2.5.4 (GUI or CLI)
- Truffle v5.4.18 (core: 5.4.18)
- Solidity v0.8.10 (solc-js)
- Node v15.5.0
- Web3.js v1.5.3

## The voting process

- The voting administrator registers a white list of voters identified by their Ethereum address
- The voting administrator starts the proposal registration session
- Registered voters are allowed to register their proposals while the registration session is active
- Voting administrator ends proposal registration session
- Voting administrator begins the voting session
- Registered voters vote for their preferred proposals
- Voting administrator ends voting session
- Voting administrator tally votes
- World can check the final details of the winning proposal

## Tests

All the tests have been divided into dedicated files with a prefix symbolizing the stage of the voting process in progress. For ease of reading, each test file reflects a stage of the voting process described in the previous section.

As far as possible, the following scenarios are checked for each step:

- Checking the `sender` when a function is supposed to be called by the administrator or a participant supposed to be registered
- Checking the current state before executing an action that could alter the state of the contract
- Checking inputs
- Checking exceptions when validation constraints are not respected
- Verification of state variables following a function call that has altered the contract
