const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe("Wallet", () => {
    let wallet, tp;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
    })

    describe("creating a transaction", () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 20;
            recipient = 'h3ll0';
            transaction = wallet.createTransaction(recipient, sendAmount, tp);
        })

        describe("and doing the same transaction", () => {

            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp);
            })

            it("double the same 'amount' from wallet", () => {
                // expect(tp.transactions.find(t => t.input.address === wallet.publicKey).outputs.find(a => a.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount - sendAmount);
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
            })

            it("clone the 'sendAmount' output of the recipient", () => {
                expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            })

        })
    })
})