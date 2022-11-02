const fs = require('fs');
const path = require('path');

const fileArr = [];
fs.promises.readdir(path.join(__dirname,'secret-folder'),{withFileTypes: true})
  .then(filenames => {
    for (let file of filenames){
      if (!file.isDirectory()){
        fileArr.push(file)
      }
    }
    for (let file of fileArr){
      let filePath = path.join(__dirname, 'secret-folder', file.name);
      let fileExt = path.extname(filePath);
      fs.stat(filePath, (err, stats)=>{console.log(`${path.basename(filePath, fileExt)} - ${fileExt.split('').slice(1).join('')} - ${stats.size}b`)})
    }
  })