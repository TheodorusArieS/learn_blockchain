const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const BlockChain = require('../blockchain')

describe("Transaction Pool", () => {
    let tp, wallet, transaction, bc;
    beforeEach(() => {

        tp = new TransactionPool();
        wallet = new Wallet();
        bc = new BlockChain();
        transaction = wallet.createTransaction('rand-4ddr355', 20, tp, bc);
        

    });

    it("It adds a transaction to the pool", () => {
        // console.log("TRX POOL:", JSON.stringify(tp));
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    })

    it("updates a transaction in the pool", () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'foo-addr3ss', 20);
        tp.updateOrAddTransaction(transaction);

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
    })

    it(`clear transaction pool`, () => {
        tp.clear();
        expect(tp.transactions.length).toEqual(0);
    })

    describe("Mixing valid and invalid transaction", () => {
        let validTransactions;

        beforeEach(() => {
            validTransactions = [...tp.transactions];
            for (let i = 0; i < 2; i++) {
                wallet = new Wallet();
                transaction = wallet.createTransaction(`4dr3s5-${i}`, 20, tp, bc);

                if (i % 2 == 0) {
                    transaction.input.amount = 99999;
                } else {
                    validTransactions.push(transaction);
                }
            }
        })

        it("it show difference between valid and invalid transaction", () => {

            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        })

        // it("grabs valid transaction ", () => {
        //     expect(tp.validTransaction()).toEqual(validTransactions);
        // })
    })
})