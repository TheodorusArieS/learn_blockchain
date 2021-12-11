const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');

describe("Wallet", () => {
    let transaction, amount, recipient, wallet;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13nt';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    })

    it("outputs the 'amount' subtracted from wallet balance", () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
    })

    it("outputs the 'amount' added to wallet balance ", () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
    })

    it("input the balance of the wallet", () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    })

    it("validates the valid transaction", () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    })

    it("invalidates invalid transaction", () => {
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    })

    describe("transacting with amount exceed wallet balance", () => {
        beforeEach(() => {
            amount = 5000;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        })
        it("amount exceed balance suppose to not create transaction", () => {
            expect(transaction).toEqual(undefined);
        })
    })

    describe("an updating a transaction", () => {
        let nextAmount, nextRecipient;
        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'n3xt-4ddr3ss';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        })

        it("subtracts the 'nextAmount' from sender's output ", () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
        })

        it("outputs amount of the next recipient", () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
        })
    })

    describe("create reward transaction", () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
        })

        it("check mining reward is correct", () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
        })
    })
})