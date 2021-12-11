const Transaction = require("./transaction");


class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);
        if (transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        let transaction = this.transactions.find(t => t.input.address === address);
        return transaction;
    }

    validTransaction() {

        let valid_trx = this.transactions.filter(transaction => {
            //checking if total amount from input is the same as total amount in output
            const totalOutput = transaction.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0)
            if (totalOutput !== transaction.input.amount) {
                console.log(`Total Amount is not the same in trx address ${transaction.address}`);
                return;
            }

            // check if signature is correct (means no tempering data after sign)
            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`This transaction signature is not valid from wallet address ${transaction.address}`);
                return;
            }
            return transaction;
        })

        return valid_trx;
    }

    clear(){
        this.transactions = [];
    }
}

module.exports = TransactionPool;