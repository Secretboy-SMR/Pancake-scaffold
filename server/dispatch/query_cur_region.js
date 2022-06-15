const NodeRSA = require('node-rsa');
const fs = require('fs');
const dataUtil = require("../../data/util/dataUtil");

function encrypt(data) {
    const publicKey = fs.readFileSync('./data/util/rsa_public_key.pem');
    const nodersa = new NodeRSA(publicKey);
    nodersa.setOptions({ encryptionScheme: 'pkcs1' });
    const encrypted = nodersa.encrypt(data, 'base64');
    return encrypted;
    }

function decrypt(data) {
    const privateKey = fs.readFileSync('./data/util/rsa_private_key.pem');
    const nodersa = new NodeRSA(privateKey);
    nodersa.setOptions({ encryptionScheme: 'pkcs1' });
    const decrypted = nodersa.decrypt(data, 'base64');
    return decrypted;
    }
module.exports = {
    async execute(req,res){
    console.log("asdasd");
        const cur={
            regionfo: {
            gateserverIp: '127.0.0.1',
            gateserverPort: 22102,
            secretKey:
                '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',
        },
        clientSecretKey:
              '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',
        regionCustomConfigEncrypted:
              'cAABZgpr2gtno6pAO26QxJcdWQTqWMHEgNr0vlIlM20hlNrjIvm3tfvXeBdZc5Moa1C3bVqe9NbPTUb4HWvl2yMDVkHnT6HFUtHs/RF1NZf4DYMZV/i+0G5130OkA+DnNbCs7p7TpSkrf4DA9CqWqEIPhpQYAuGWcn9CTotd2T2yBoQcar7SgbJQkOiBT2l4f0zJtR9cJfkpDBJNfyVjXFidu2A0OP5Nc2y+TVds5TIqZ29iwNSu82QcnaRCEn4e3/KyYED3gy1LKyQkCEAO9rrK/Qs86kam7xZX5aZQkZQmCIUd9e8lhusqRrwAoejbFoBMjq//FgsM/9YgET3OF4JU6Ya+VE3QossesLOe/hu01zft0Sdw25MKzP+G8JlvmprHy8i2iIYZjdGdW14aHodymDzNOiZ1ksj43OydNZFrgxUkg3N2+ZKdj+UbpF3+2HN79TIBhdJuAs54p4MbZWNm4T3pdBrfuyqjQ2NTGTGWzR7frlX7wgbjRc6yZZ5L2fGH18zbfbwkdQG01xWd5Gh9SEIg1HomsEu1WNkaRp2y62CteMVesvcS/7bzvPfbAflKq9OOuhlhgHnlS2YTSFQgYFzqwqWo70E/DVmK8O7SM2tOF6fTSDnQOGSFzcQgUAdhoQafQA0LXtZFwxPlOnKAeabGL9gbgKv2ADR4FACxbODM6R8U0NxJBqcVame8G7i4A2l3CI0e+alcQvIY9SjeH2QpvUut3QLkUXZSQLoVcLnkno+ayy0Q3Br/j2iTkGv+2HAtaZsYOpqMHD+ZLbI2dZacgZ05/0dqudHbIGJtzrTckAt9q++1EKJeM0l/qD8egUI='
        }
        var packetIdName="QueryCurrRegionHttpRsp";
        var packetID=dataUtil.getPacketIDByProtoName(packetIdName);
        var data = await dataUtil.objToProtobuffer(cur,packetID);
        
        const encrypted = encrypt(data);
        const json={
            "content":encrypted,
            "sign":"Pancake-scaffold"
        };
        res.end(JSON.stringify(json));
    }
}