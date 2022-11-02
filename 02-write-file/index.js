const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'))
stdout.write('Enter some text\n');
const text = '';
stdin.on('data', data=>{
  if(data.toString().split('').slice(0,-2).join('') === 'exit'){
    process.exit();
  }
  output.write(data.toString())
});

process.on('SIGINT',()=>process.exit());
process.on('exit', ()=>console.log('Process ended, bye!'))