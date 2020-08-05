var fs = require('fs');

var reg1 = /__ev更多资源： 250java.cn/i;
var reg2 = /更多资源： 250java.cn/i;
fs.readdir('./dist/videos/算法与数据结构-综合提升 Cpp版', function(err, dirs) {
  dirs.map((dir) => {
    var match1 = dir.match(reg2);
    if(match1) {
      var arr = dir.split('更多资源： 250java.cn');
      var newFile = arr.join('');
      fs.renameSync(`./dist/videos/算法与数据结构-综合提升 Cpp版/${dir}`,`./dist/videos/算法与数据结构-综合提升 Cpp版/${newFile}`)
    }
    // fs.readdir(`./dist/videos/算法与数据结构-综合提升 Cpp版/${dir}`,function(err, files) {
    //   files.map((file) => {
    //     var match1 = file.match(reg2);
    //     if(match1) {
    //       var arr = file.split('更多资源： 250java.cn');
    //       var newFile = arr.join('');
    //       fs.renameSync(`./dist/videos/算法与数据结构-综合提升 Cpp版/${dir}/${file}`,`./dist/videos/算法与数据结构-综合提升 Cpp版/${dir}/${newFile}`)
    //     }
    //   })
    // })
  })
})