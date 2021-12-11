const { INITIAL_BALANCE } = require('../config');
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');

class Wallet {

    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.getKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return ` Wallet --
            balance     : ${this.balance}
            publicKey   : ${this.publicKey.toString()}
        `
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, transactionPool,blockchain) {
        this.balance = this.calculateBalance(blockchain)
        if (this.balance < amount) {
            console.log(`Amount : ${amount} exceeds wallet balance :${this.balance}`);
            return;
        }
        let transaction = transactionPool.existingTransaction(this.publicKey);
        if (transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }
        return transaction;


    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.publicKey = 'blockchain-address';
        return blockchainWallet;
    }

    calculateBalance(blockchain) {
        let balance = this.balance;
        let transactions = [];
        blockchain.chain.forEach(block => block.data.forEach(transaction => transactions.push(transaction)));

        const walletInputTs = transactions.filter(transaction => transaction.input.address === this.publicKey);
        let startTime = 0;

        if (walletInputTs.length > 0) {
            const recentInputTs = walletInputTs.reduce((prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current);
            balance = recentInputTs.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputTs.input.timestamp;
        }

        transactions.forEach(transaction => {
            if (transaction.input.timestamp > startTime) {
                transaction.outputs.find(output => {
                    if (output.address === this.publicKey) {
                        balance += output.amount;
                    }
                })
            }
        })

        return balance;
    }


}

module.exports = Wallet;