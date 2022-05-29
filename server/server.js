const fs = require("fs")
const protobuf = require("protobufjs");

const dataUtil = require("../data/util/dataUtil");
const handshake = require("../data/util/handshake");

const dgram = require("dgram");
const kcp = require("node-kcp");
const { constants } = require("buffer");

var seedKey = undefined;
var server = dgram.createSocket("udp4");
var initialKey = fs.readFileSync("./data/util/initalKey.bin")
var seedKey=null;

function handleHandshake(data, type)
{
    //console.log(data);
    switch (type) {
        case 255: // 0xFF -- NEW CONNECTION
            var buffer = Buffer.from(data)
            var Handshake = new handshake();
            Handshake.decode(buffer);

            var _Conv = (Date.now());
            var _Token = 0xFFCCEEBB ^ ((Date.now() >> 32) & 0xFFFFFFFF);

            var newBuffer = new handshake([0x145, 0x14514545], _Conv, _Token);
            return newBuffer;
        case 404: // 0X194 -- DISCONNECTION
            var buffer = Buffer.from(data)
            var Handshake = new handshake(handshake.MAGIC_DISCONNECT);

            seedKey = undefined

            return Handshake
        default:
            console.log("[HandError] %x" + type)
            return;
    }
}




async function handleSendPacket(noMagic,packetID, kcpobj, keyBuffer) {
    var protobuff = await dataUtil.dataToProtobuffer(noMagic, packetID);
    var packetIdName = dataUtil.getProtoNameByPacketID(packetID);
    var jsondata="";
    var player;
    var world;
    var avatar;
    if(player==undefined||world==undefined||avatar==undefined){
        player=JSON.parse(fs.readFileSync("./json/player.json").toString());
        player.playerStore=JSON.parse(fs.readFileSync("./json/playerStore.json").toString());
        world=JSON.parse(fs.readFileSync("./json/world.json").toString());
        avatar=JSON.parse(fs.readFileSync("./json/avatar.json").toString());
    }
    if(protobuff!=undefined){
        jsondatatmp=JSON.stringify(protobuff,null,"\t");
        jsondata=JSON.parse(Buffer.from(jsondatatmp));
        //console.log("Got Req JSON：["+packetIdName+"]\n"+jsondatatmp);//change this to debug
    }
    try{
        require("./handle/"+packetIdName).execute(dataUtil,protobuf,protobuff,jsondata,kcpobj,keyBuffer,player,world,avatar);
    }catch(e){
        console.log(`handle undefined：./handle/${packetIdName}。`);
    };
    if(packetIdName=="GetPlayerTokenReq"){
        require('child_process').execFile('./server/seed/ConsoleApp2.exe', [2], function (err, data) {
            if (err) {
                console.log(err)
            }
            seedKey = Buffer.from(data.toString(), 'hex'); // Key
        });
    }
}




var clients = {};
module.exports = {
    execute(port,token) {
        server.bind(port);
        server.on('error', (error) => {
            server.close();
        });

        server.on('listening', () => {
            var address = server.address();
            console.log(`[Tip] KCP ${address.port}。`); 
        });
        
        var output = async function (data, size, context) {
            if (data == undefined || data == null || data == NaN) return;
            
            if (data.length > 26 && data != undefined) {
                data = dataUtil.formatSentPacket(data, token);

                var arrayData = dataUtil.getPackets(data); 
                for (var k in arrayData) {
                    server.send(arrayData[k], 0, arrayData[k].length, context.port, context.address);
                }
                return
            }

            server.send(data, 0, size, context.port, context.address);
        };

        server.on('message', async (data, rinfo) => {
            // Extracted from KCP example lol
            var k = rinfo.address + '_' + rinfo.port + '_' + data.readUInt32LE(0).toString(16);
            var bufferMsg = Buffer.from(data);

            if (bufferMsg.byteLength <= 20) {
                var ret = handleHandshake(bufferMsg, bufferMsg.readInt32BE(0));
                ret.encode();
                console.log("[HANDSHAKE]")
                server.send(ret.buffer, 0, ret.buffer.byteLength, rinfo.port, rinfo.address);
                return
            }

            if (undefined === clients[k]) {
                var context = {
                    address: rinfo.address,
                    port: rinfo.port
                };
                var kcpobj = new kcp.KCP(data.readUInt32LE(0), context);
                kcpobj.nodelay(1, 10, 2, 1);
                kcpobj.output(output);
                clients[k] = kcpobj;
            }
            
            token = data.readUInt32BE(4);

            var kcpobj = clients[k];
            var reformatedPacket = await dataUtil.reformatKcpPacket(bufferMsg);
            kcpobj.input(reformatedPacket)
            kcpobj.update(Date.now())

            var recv = kcpobj.recv();
            if (recv) {
                var packetRemHeader = recv;

                var keyBuffer = seedKey == undefined ? initialKey : seedKey;
                
                dataUtil.xorData(packetRemHeader, keyBuffer);

                if (packetRemHeader.length > 5 && packetRemHeader.readInt16BE(0) == 0x4567 && packetRemHeader.readUInt16BE(packetRemHeader.byteLength - 2) == 0x89AB) {
                    var packetID = packetRemHeader.readUInt16BE(2);
                    if (![2349, 373, 3187, 19, 1, 49].includes(packetID)) {
                        var dataBuffer = await dataUtil.dataToProtobuffer(dataUtil.parsePacketData(recv), packetID);
                        //console.log(dataBuffer);
                        console.log("[Got Req]  %i (%s)", packetID, dataUtil.getProtoNameByPacketID(packetID)); 
                    }

                    var noMagic = dataUtil.parsePacketData(packetRemHeader);
                    if (packetID == parseInt(dataUtil.getProtoNameByPacketID(packetID))) {
                         console.log("[UNK PACKET] " + packetRemHeader.toString('hex'));
                        //fs.appendFile("./unk/unknown_packets/" + packetID, packetRemHeader, (err)=>{if(err)throw err})
                       return;
                     }
                    handleSendPacket(noMagic, packetID, kcpobj, keyBuffer);
                }
                
            }

        });
    }
}