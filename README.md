# Système de vote

Le smart contract de vote est conçu pour une petite organisation dont les électeurs, définis en amont, sont inscrits sur une liste blanche (whitelist) grâce à leur adresse Ethereum.
Ils peuvent soumettre de nouvelles propositions lors d'une session d'enregistrement des propositions, et peuvent voter sur les propositions lors de la session de vote.

- Le vote n'est pas secret
- Chaque électeur peut voir les votes des autres
- Le gagnant est déterminé à la majorité simple
- La proposition qui obtient le plus de voix l'emporte.

## Stack

- Ethereum in memory blockchain, Ganache Version 2.5.4 (GUI or CLI)
- Truffle v5.4.18 (core: 5.4.18)
- Solidity v0.8.10 (solc-js)
- Node v15.5.0
- Web3.js v1.5.3

## Le processus de vote

- ✅ L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum

- ✅ L'administrateur du vote commence la session d'enregistrement de la proposition.

- ✅ Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.

- ✅ L'administrateur de vote met fin à la session d'enregistrement des propositions.

- ✅ L'administrateur du vote commence la session de vote.

- ✅ Les électeurs inscrits votent pour leurs propositions préférées.

- ✅ L'administrateur du vote met fin à la session de vote.

- ✅ L'administrateur du vote comptabilise les votes.

- ✅ Tout le monde peut vérifier les derniers détails de la proposition gagnante.

## Questions

- S'il n'y a pas de gagnant ? (égalité)

## TODO

- tester les requires de getVoterVote()
