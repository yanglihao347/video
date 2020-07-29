
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
    const filesList = [];
    dirs.map((dir) => {
      if (mp4Reg.test(dir)) {
        filesList.push(dir);
      }
    })
    function sortNumber(a,b){
      return a - b
    }
    const reg = /-((.)+?)\s/;
    const hashObj = {};
    const sortArr = [];
    filesList && filesList.map((file) => {
      let matchResult = file.match(reg);
      if(matchResult) {
        sortArr.push(Number(file.match(reg)[1]));
        hashObj[file.match(reg)[1]] = file.match(reg).input
      }
    })
    const newFilesList = [];
    sortArr.sort(sortNumber);
    sortArr.map((index) => {
      newFilesList.push(hashObj[index]);
    })
    
    Promise.all(dirs.map((dir) => {
      if (mp4Reg.test(dir)) {
        return dir;
      } else if(!zipReg.test(dir)) {
        return new Promise((resolve, reject) => {fs.readdir(`./dist/videos/${collectionName}/${dir}`, function(err, files) {
          const reg = /-((.)+?)\s/;
          const hashObj = {};
          const sortArr = [];
          const filesList = [];
          
          files && files.map((file) => {
            let matchResult = file.match(reg);
            if(matchResult) {
              sortArr.push(Number(file.match(reg)[1]));
              hashObj[file.match(reg)[1]] = file.match(reg).input
            }
          })
          sortArr.sort(sortNumber);
          sortArr.map((index) => {
            filesList.push(hashObj[index]);
          })
          
          resolve({name: dir, list: filesList.length ? filesList : files});
        })})
      }
    })).then((dirs) => {
      const data = []
      dirs.map((dir) => {
        if(typeof(dir) !== 'string') {
          data.push(dir);
        }
      })
      console.log(data);
      res.json({
        code: 200,
        data: newFilesList.length ? newFilesList.concat(data) : filesList.concat(data)
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
