
var express = require('express');
var fs = require('fs');

var app = express();
app.use(express.static('dist'))

app.post('/files', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  fs.readdir('./dist/videos', function(err, files) {
    res.json({
      code: 200,
      data: files
    })
  })
})

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
//   // fs.readFile("./index.html",function(err,data){
//   //   // body
//   //   if(err){
//   //       console.log(err);
//   //       //404：NOT FOUND
//   //       response.writeHead(404,{"Content-Type":"text/html"});
//   //   }
//   //   else{
//   //       //200：OK
//   //       response.writeHead(200,{"Content-Type":"text/html"});
//   //       response.write(data.toString());
//   //   }
//   //   response.end();
//   // });
// })

app.listen(3001, function() {
  console.log('服务启动成功，端口3001')
})

