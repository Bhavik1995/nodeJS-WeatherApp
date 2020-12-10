const http = require('http');
var requests = require('requests');
const fs = require('fs');


const homeFile = fs.readFileSync("home.html","UTF8");

const replaceVal = (tempVal ,orgVal)=>{
    let temperature = tempVal.replace("{%tempval%}",Math.round(orgVal.main.temp)/10);
   // var tempVal = temperature.toFixed(2);
     temperature = temperature.replace("{%tempmin%}",Math.round(orgVal.main.temp_min)/10);
     temperature = temperature.replace("{%tempmax%}",Math.round(orgVal.main.temp_max)/10);
     temperature = temperature.replace("{%location%}",orgVal.name);
     temperature = temperature.replace("{%country%}",orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
     return temperature;
}
const server = http.createServer((req,res)=>{
     if(req.url == "/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Dombivli&appid=6d2d7ad061160d1d135da725fefebd7a")
        .on('data', (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
          //console.log(arrData[0].main.temp);
          const realTimeData = arrData.map(val => replaceVal(homeFile,val)).join("");
          res.write(realTimeData);
          //console.log(realTimeData);
          })
        .on('end', (err) => {
          if (err) return console.log('connection closed due to errors', err);
         
          res.end();
        });
     }
});

server.listen(8000,"127.0.0.1");