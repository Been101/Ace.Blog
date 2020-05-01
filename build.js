var copydir = require('copy-dir');
 
copydir.sync('./dist', './', {
  utimes: true,  // keep add time and modify time
  mode: true,    // keep file mode
  cover: true    // cover file when exists, default is true
});