module.exports = {
    async execute(dataUtil,protobuf,protobuff,jsondata,kcpobj,keyBuffer,player,world){
        var packetIdName="PingRsp";
        var packetID=dataUtil.getPacketIDByProtoName(packetIdName);
        var PingRsp = {
            clientTime: protobuff["clientTime"],
            ueTime: protobuff["ueTime"]
        }
        var data = await dataUtil.objToProtobuffer(PingRsp,packetID);
        await kcpobj.send(await dataUtil.dataToPacket(data,packetID,keyBuffer));
        console.log(`[${packetIdName}] was sent back.`);
    }
}