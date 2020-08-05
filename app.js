
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
      data: collections.filter((collection) => {
        if(collection.indexOf('大前端') === -1){
          return true;
        }
      }),
      ip,
    })
  })
})

app.post('/query', function(req, res) {
  const { collectionName } = req.body;
  res.header('Access-Control-Allow-Origin', '*');
  fs.readdir(`./dist/videos/${collectionName}`, function(err, dirs) {
    const mp4Reg = /\.mp4$/i;
    const zipReg = /\.(zip|pdf|rar|png|jpg|downloading|cfg)$/i;
    const filesList = [];
    dirs.map((dir) => {
      if (mp4Reg.test(dir)) {
        filesList.push(dir);
      }
    })

    Promise.all(dirs.map((dir) => {
      if (mp4Reg.test(dir)) {
        return dir;
      } else if(!zipReg.test(dir)) {
        return new Promise((resolve, reject) => {fs.readdir(`./dist/videos/${collectionName}/${dir}`, function(err, files) {

          resolve({name: dir, list: sortFiles(files.filter((file) => {
            return mp4Reg.test(file)
          }))});

        })})
      }
    })).then((dirs) => {
      const data = []
      dirs.map((dir) => {
        if(dir && typeof(dir) !== 'string') {
          data.push(dir);
        }
      })
      res.json({
        code: 200,
        data: sortFiles(filesList).concat(data)
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

function sortFiles(fileList) {
  // const reg = /-((.)+?)\s/;
  const reg = /^((\d)+)-((\d)+)\s/;
  const hashObj = {};
  const sortArr = [];
  const newList = [];
  function sortNumber(a,b){
    const objA = a.trim().split('-');
    const objB = b.trim().split('-');
    if (objA[0] > objB[0]) {
      return 1;
    } else if (objA[0] < objB[0]) {
      return -1;
    } else {
      return objA[1] - objB[1]
    }
  }
  
  fileList && fileList.map((file) => {
    let matchResult = file.match(reg);
    if(matchResult) {
      sortArr.push(matchResult[0]);
      hashObj[matchResult[0]] = matchResult
    }
  })
  sortArr.sort(sortNumber);
  sortArr.map((index) => {
    newList.push(hashObj[index]['input']);
  })
  return newList.length ? newList : fileList;
}

function getClientIP(req) {
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
      req.connection.remoteAddress || // 判断 connection 的远程 IP
      req.socket.remoteAddress || // 判断后端的 socket 的 IP
      req.connection.socket.remoteAddress;
};
