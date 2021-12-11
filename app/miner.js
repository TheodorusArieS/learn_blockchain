const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");


class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine() {
        const validTransaction = this.transactionPool.validTransaction();
        validTransaction.push(Transaction.rewardTransaction(this.wallet,Wallet.blockchainWallet()));
        
        const block = this.blockchain.addBlock(validTransaction);
        //synchronize the chain to peer-to-peer server
        this.p2pServer.syncChains();
        //clear the transaction pool
        this.transactionPool.clear();
        //broadcast to every miner to clear the transaction pool
        this.p2pServer.broadcastClearTransaction();
    
        return block;
    }
}

module.exports = Miner;