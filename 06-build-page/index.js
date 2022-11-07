const fs = require('fs');
const path = require('path');

let templateStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
let template = '';
templateStream.on('data', chunk => template += chunk);

fs.mkdir(path.join(__dirname,'project-dist'), {recursive: true}, (err)=>{if (err) throw err});
fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', (err)=> {if (err) throw err});
fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), '', (err)=> {if (err) throw err});
createFolder(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'))
templateStream.on('end', ()=>{
  getTemplate()
})

async function readFile(file){
  try{
    const chunk = await fs.promises.readFile(path.join(__dirname,'components', file.name), 'utf8');
    return chunk
  }
  catch (err) { console.error( err ) }
}

async function getTemplate(){
  try{
    const filenames = await fs.promises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
    let obj = {}
    for (let file of filenames){
      let fileName = file.name.split('.')[0];
      if (template.includes(`{{${fileName}}}`)){
        let fileData = await readFile(file);
        obj[fileName] = fileData;
      }
    }
    for (let i = 0; i < Object.keys(obj).length; i++){
      template = template.replace(`{{${Object.keys(obj)[i]}}}`, obj[Object.keys(obj)[i]])
    }
    fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template, (err)=> {if (err) throw err});
  }
  catch (err) { console.error( err ) }
}

fs.promises.readdir(path.join(__dirname,'styles'), {withFileTypes: true})
.then(filenames=> {
  for (let file of filenames){
    if (file.isFile && path.extname(path.join(__dirname,'styles', file.name)) === '.css') {
      let streamRead = fs.createReadStream(path.join(__dirname,'styles', file.name), 'utf-8');
      streamRead.on('data', chunk => fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), chunk + '\n', (err)=> {if (err) throw err}));
    }
  }
})



function createFolder(сopyPath, destPath){
  fs.mkdir(destPath, {recursive: true}, (err)=>{
    if (err) throw err;
    fs.promises.readdir(destPath, {withFileTypes: true})
      .then(filenames=> {
        if (filenames.length > 0){
          for (let file of filenames){
            removeFiles(path.join(destPath, file.name), file)
          }
        }
        
        fs.promises.readdir(сopyPath,{withFileTypes: true})
        .then(filenames => {
          for (let file of filenames){
            if (!file.isDirectory()){
              let filePath = path.join(сopyPath, file.name);
              fs.copyFile(filePath, path.join(destPath, file.name), (err)=>{
                if (err) throw err;
              })
            } else{
              createFolder(path.join(сopyPath,file.name), path.join(destPath,file.name))
            }
          }
        });
      })
  });
}


function removeFiles(filePath, file){
  if (file.isFile()){
    fs.unlink(filePath, (err)=>{if (err) throw err})
  } else {
    fs.promises.readdir(filePath, {withFileTypes: true})
      .then(subfiles => {
        for (let subfile of subfiles){
          removeFiles(path.join(filePath, subfile.name), subfile);
        }
        }
      )
    
  }
}