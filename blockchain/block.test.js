const Block = require('./block');

describe('Block', () => {
    let data, lastBlock, block;
    beforeEach(() => {
        data = "Bar";
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data);

    });

    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash); 
    });

    it('generate a hash that matches the difficulty',()=>{
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.log(block.toString());
    })

    it("lowers the difficulty for mining block",()=>{
        expect(Block.adjustDifficulty(block,block.timestamp+360000)).toEqual(block.difficulty-1);
    })

    it("raises the difficulty for mining block",()=>{
        expect(Block.adjustDifficulty(block,block.timestamp+1)).toEqual(block.difficulty+1);
    })

});