const http = require('http');

const fs = require('fs');

const https = require("https");
const port = process.env.PORT || 8000;
const homefile = fs.readFileSync('index.html', 'utf-8');
const replaceVal = (tempval,value)=>{
    var temperature=tempval.replace("{%tempvalue%}",value.main.temp);
    temperature=temperature.replace("{%tempmin%}",value.main.temp_min);
    temperature=temperature.replace("{%tempmax%}",value.main.temp_max);
    temperature=temperature.replace("{%location%}",value.name);
    temperature=temperature.replace("{%country%}",value.sys.country);
    return temperature;
}
const server = http.createServer((req, resp) => {
    if (req.url == '/') {
       let get=https.get("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=d25142f6786b125dfa6771797987504f",(res)=>{
           let data= "";
           res.on('data',(chunk)=>{
               data += chunk;
           });
           res.on('end',()=>{
               console.log(JSON.parse(data));
               const objdata=JSON.parse(data);
               const arrdata=[objdata];
               const realtimedata=arrdata.map((val)=> {return replaceVal(homefile,val)}).join("");
               console.log(realtimedata);
               resp.write(realtimedata);
               resp.end();
           });
       })
       get.on("error",(err)=>{
           console.log(err);
       });
    }
});

server.listen(port, "127.0.0.1",()=>{
    console.log("listening to the server");
});