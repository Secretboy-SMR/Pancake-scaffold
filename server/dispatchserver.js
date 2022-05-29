const fs = require("fs");
const http = require("http");
const url = require("url");
module.exports = {//模块导出
    async execute(host,port){
        // HTTP Server Listener
        const requestListener = function (req, res) {
            // Handle Favicon Error
            if (req.url === '/favicon.ico') {
                res.writeHead(200, {'Content-Type': 'image/x-icon'} );
                res.end();
                return;
            }


            try {
                res.writeHead(200, { "Content-Type": "text/html" });
                if(req.url!="/log"&&req.url!="/crash/dataUpload"&&req.url!="/sdk/dataUpload"){
                  //console.log("[HTTP] REQ URL: %s", req.url);
                }
                const file = fs.readFileSync("./server/dispatch/" + req.url.split("?")[0] + ".json").toString();
                res.end(file);
            }
            catch (e) {
                res.writeHead(200, { "Content-Type": "text/html" });
                if(req.url=="/admin/mi18n/plat_oversea/m2020030410/m2020030410-version.json")
                  res.end('{"version": 52}');
                else{
                  //console.log("[HTTP] Module %s wasnt found.", req.url);
                  res.end('{"code":0}');
                }
                
            }
        }
        //Creates the HTTP server
        const httpserver = http.createServer(requestListener);


        // On HTTP Server Start.
        httpserver.listen(port, host, () => {
            console.log(`[HTTP] Server is running on http://${host}:${port}`);
        });
    }
}