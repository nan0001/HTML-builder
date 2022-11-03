const { throws } = require('assert');
const fs = require('fs');
const path = require('path');

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err)=> {if (err) throw err});

fs.promises.readdir(path.join(__dirname,'styles'), {withFileTypes: true})
.then(filenames=> {
  for (let file of filenames){
    if (file.isFile && path.extname(path.join(__dirname,'styles', file.name)) === '.css') {
      let streamRead = fs.createReadStream(path.join(__dirname,'styles', file.name), 'utf-8');
      streamRead.on('data', chunk => fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), chunk + '\n', (err)=> {if (err) throw err}));
    }
  }
})
