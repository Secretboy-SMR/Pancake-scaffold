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
                console.log("[HTTP] REQ URL: %s", req.url);
                if(req.url.split("/")[1] == "query_cur_region"){
                    require("./dispatch/query_cur_region").execute(req,res);
                }else{
                    const file = fs.readFileSync("./server/dispatch/" + req.url.split("?")[0] + ".json").toString();
                    res.end(file);
                }
            }
            catch (e) {
                res.writeHead(200, { "Content-Type": "text/html" });
                console.log("[HTTP] Module %s wasnt found.", req.url);
                res.end('{"code":0}');
                
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