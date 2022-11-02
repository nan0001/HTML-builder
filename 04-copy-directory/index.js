const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname,'files-copy'), {recursive: true}, (err)=>{
  if (err) throw err;
  fs.promises.readdir(path.join(__dirname,'files-copy'), {withFileTypes: true})
    .then(filenames=> {
      if (filenames.length > 0){
        for (let file of filenames){
          fs.unlink(path.join(__dirname,'files-copy', file.name), (err)=>{if (err) throw err})
        }
      }
      

      fs.promises.readdir(path.join(__dirname,'files'),{withFileTypes: true})
      .then(filenames => {
        for (let file of filenames){
          if (!file.isDirectory()){
            let filePath = path.join(__dirname, 'files', file.name);
            fs.copyFile(filePath, path.join(__dirname,'files-copy',file.name), (err)=>{
              if (err) throw err;
            })
          }
        }
      });
    })
});

