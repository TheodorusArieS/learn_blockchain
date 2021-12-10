const WebSocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
}

class P2pServer {

    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.socket = [];
        this.transactionPool = transactionPool;
    }

    listen() {
        const server = new WebSocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeers();
        console.log("listening to peer to peer port in :", P2P_PORT);
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new WebSocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        })
    }

    connectSocket(socket) {
        this.socket.push(socket);
        console.log("connected socket");
        // this.messageHandler(socket);
        this.sendChain(socket)

    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            switch(data.type){
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                default:
                    break;
            }


        })
    }

    sendChain(socket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain,
        }));
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction,
        }));
    }

    syncChains() {
        this.socket.forEach(socket => {
            this.sendChain(socket);
        })
    }

    broadcastTransaction(transaction) {
        this.socket.forEach(socket => this.sendTransaction(socket, transaction))
    }
}

module.exports = P2pServer;