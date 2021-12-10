const BlockChain = require('./index');
const Block = require('./block');

describe("Block Chain", () => {
    let bc, bc2;
    beforeEach(() => {
        bc = new BlockChain();
        bc2 = new BlockChain();

    })

    it("this block chain should start with the genesis block", () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    })

    it('this add new block', () => {
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
    });

    it('validates valid chain', () => {
        bc2.addBlock('foo');
        expect(bc2.isValidChain(bc2.chain)).toBe(true);


    });

    it('invalidates invalid chain', () => {
        bc2.addBlock('foo');
        bc2.chain[1].data = 'not foo';
        expect(bc2.isValidChain(bc2.chain)).toBe(false);

    });

    it('invalidates valid chain but the genesis block is wrong', () => {
        bc2.chain[0].data = 'bad data';
        expect(bc2.isValidChain(bc2.chain)).toBe(false);

    });

    it("Replace the old chain with the new chain", () => {
        bc2.addBlock('bobo');
        bc.replaceChain(bc2.chain);

        expect(bc2.chain).toEqual(bc.chain);

    });

    it('doesnot replace the chain because length is equal or less than',()=>{
        bc.addBlock('foo');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    
    })

});