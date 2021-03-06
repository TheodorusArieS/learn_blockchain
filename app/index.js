const express = require('express');
const bodyParser = require('body-parser');
const BlockChain = require('../blockchain/index');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const bc = new BlockChain();

const app = express();
const tp = new TransactionPool();
const wallet = new Wallet();

const p2pServer = new P2pServer(bc, tp);

const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());
app.get('/blocks', (req, res) => {
    res.json(bc.chain);
})

app.get('/transactions', (req, res) => {
    console.log("/TRANSACTION DATA:", tp.transactions.length);
    res.json(tp.transactions);
})

app.get('/public-key', (req, res) => {
    res.json({ publicKey: wallet.publicKey });
})

app.get('/mine-transaction', (req, res) => {
    const block = miner.mine();
    console.log(`new block added : ${block.toString()}`);
    res.redirect('/blocks');
})

app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    p2pServer.syncChains();

    res.redirect('/blocks');
})

app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, tp, bc);

    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
})

app.listen(HTTP_PORT, console.log(`listening to port ${HTTP_PORT}`));
p2pServer.listen();