
process.env.UV_THREADPOOL_SIZE = 5; // set thread is run same time

const crypto = require('crypto');

const start = Date.now();

// Node is not single thread, Event loop is single thread

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('1: ', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('2: ', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('3: ', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('4: ', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('5: ', Date.now() - start);
});
