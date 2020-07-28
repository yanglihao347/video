
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('dist'))
app.use(bodyParser.urlencoded());

app.post('/getCollections', function(req, res) {
  var ip = getClientIP(req);
  res.header('Access-Control-Allow-Origin', '*');
  fs.readdir('./dist/videos', function(err, collections) {
    res.json({
      code: 200,
      data: collections,
      ip,
    })
  })
})

app.post('/query', function(req, res) {
  const { collectionName } = req.body;
  res.header('Access-Control-Allow-Origin', '*');
  fs.readdir(`./dist/videos/${collectionName}`, function(err, dirs) {
    const mp4Reg = /\.mp4$/i;
    const zipReg = /\.(zip|pdf|rar)$/i;
    Promise.all(dirs.map((dir) => {
      if (mp4Reg.test(dir)) {
        return dir;
      } else if(!zipReg.test(dir)) {
        return new Promise((resolve, reject) => {fs.readdir(`./dist/videos/${collectionName}/${dir}`, function(err, files) {
          resolve({name: dir, list:files});
        })})
      }
    })).then((dirs) => {
      const data = []
      dirs.map((dir) => {
        if(dir) {
          data.push(dir);
        }
      })
      res.json({
        code: 200,
        data: data
      })
    })
  })
})

app.post('/getFiles', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  fs.readdir('./dist/videos', function(err, files) {
    const videoList = []
    files.map((name) => {
      let mp4Reg = /\.mp4$/i;
      if(mp4Reg.test(name)) {
        videoList.push(name);
      }
    })
    res.json({
      code: 200,
      data: videoList
    })
  })
})

app.listen(3001, '0.0.0.0', function() {
  console.log('服务启动成功，端口3001')
})

function getClientIP(req) {
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
      req.connection.remoteAddress || // 判断 connection 的远程 IP
      req.socket.remoteAddress || // 判断后端的 socket 的 IP
      req.connection.socket.remoteAddress;
};
