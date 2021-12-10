

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine() {
        const validTransaction = this.transactionPool.validTransaction();
        //include reward for the miner
        //create a block consist of valid transaction
        //synchronize the chain to peer-to-peer server
        //clear the transaction pool
        //broadcast to every miner to clear the transaction pool
    }
}

module.exports = Miner;