module.exports = {
    async execute(dataUtil,protobuf,protobuff,jsondata,kcpobj,keyBuffer,player,world){
        packetIdName="GetPlayerTokenRsp";
        var packetID=dataUtil.getPacketIDByProtoName(packetIdName);
        var GetPlayerTokenRsp = {
            "uid": player.uid,
            "token": protobuff["accountToken"],
            "accountType": protobuff["accountType"],
            "accountUid": player.uid.toString(),
            "secretKeySeed": 0,
            "platformType": protobuff["platformType"],
        };
        var data = await dataUtil.objToProtobuffer(GetPlayerTokenRsp,packetID);
        await kcpobj.send(await dataUtil.dataToPacket(data,packetID,keyBuffer));
        
        console.log(`[${packetIdName}] SENT BACK\n${JSON.stringify(GetPlayerTokenRsp,null,"\t")}`);
    }
}