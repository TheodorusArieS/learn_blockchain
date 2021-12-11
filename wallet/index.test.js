const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const BlockChain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

describe("Wallet", () => {
    let wallet, tp, bc;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new BlockChain();
    })

    describe("creating a transaction", () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 20;
            recipient = 'h3ll0';
            transaction = wallet.createTransaction(recipient, sendAmount, tp, bc);
        })

        describe("and doing the same transaction", () => {

            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp, bc);
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

    describe("calculate balance", () => {
        let addBalance, repeatAdd, senderWallet;

        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 50;
            repeatAdd = 3;
            for (let i = 0; i < repeatAdd; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, tp, bc)
            }
            bc.addBlock(tp.transactions);
        })

        it('check balance after transaction for recipent address', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + addBalance * repeatAdd);
        })

        it('check balance after transaction for sender address', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - addBalance * repeatAdd);
        })

        describe("recipient conducts transaction", () => {
            let substractBalance, recipientBalance;

            beforeEach(() => {
                tp.clear();
                substractBalance = 25;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey, substractBalance, tp, bc)
                bc.addBlock(tp.transactions);
            })

            it('check sender balance after conduction transaction', () => {
                expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - substractBalance)
            })

            describe("and the sender wallet conducts another transaction", () => {
                let senderCurrentBalance;

                beforeEach(() => {
                    tp.clear();
                    senderCurrentBalance = senderWallet.calculateBalance(bc);
                    senderWallet.createTransaction(wallet.publicKey, addBalance, tp, bc);
                    bc.addBlock(tp.transactions);
                })

                it('calculate the recipient balance only using transaction since its most recent one', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - substractBalance + addBalance);
                })
            })

        })



    })


})