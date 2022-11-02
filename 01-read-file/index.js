const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname,'text.txt');
const stream = fs.createReadStream(filepath, 'utf-8');
stream.on('data', chunk => console.log(chunk));