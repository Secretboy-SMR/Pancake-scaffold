const { O_NONBLOCK } = require("constants");
var net = require('net');

const server = net.createServer();
let host = 'localhost';
let port = 80;
let tcp_port=42472;
server.listen(tcp_port, host, () => {
    console.log(`TCP Running ${tcp_port} 。`);
});

server.on('connection', function (sock) {
    console.log(`Connected: ${sock.remoteAddress } : ${sock.remotePort}`);

    sock.on('data', function (data) {
        console.log(`Got data ${sock.remoteAddress} :\n ${ data}`);
        // Write the data back to all the connected, the client will receive it as data from the server
        sock.write("0x0");
    });
});

async function start(){
    var token = 0x00000000;
    require("./server/dispatchserver.js").execute(host,port);
    require("./server/server.js").execute(22102,token);
}

start();