const url = require('url');
const http = require('http');
const path = require('path');
// const fs = require('fs');
// const LimitSizeStream = require('./LimitSizeStream');
const receiveFile = require('./receiveFile');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (!filepath) {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }

      receiveFile(filepath, req, res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }


  // const pathname = url.parse(req.url).pathname.slice(1);
  //
  // if (pathname.includes('/')) {
  //   res.statusCode = 400;
  //   return res.end();
  // }
  //
  // const filepath = path.join(__dirname, 'files', pathname);
  //
  //
  // switch (req.method) {
  //   case 'POST':
  //
  //     if (fs.existsSync(filepath)) {
  //       res.statusCode = 409;
  //       return res.end();
  //     }
  //
  //     const writeStream = fs.createWriteStream(pathname, {flags: 'wx'});
  //     const limitSizeStream = new LimitSizeStream({limit: 1e6});
  //
  //     req.pipe(limitSizeStream).pipe(writeStream);
  //
  //     limitSizeStream.on('error', (err) => {
  //       if (err.code === 'LIMIT_EXCEEDED') {
  //         fs.unlink(pathname, (err) => {
  //           res.statusCode = 413;
  //           return res.end();
  //         });
  //       }
  //       fs.unlink(pathname, (err) => {
  //         res.statusCode = 500;
  //         return res.end();
  //       });
  //     });
  //
  //     writeStream.on('error', (err) => {
  //       fs.unlink(pathname, (err) => {
  //         res.statusCode = 500;
  //         return res.end();
  //       });
  //     }).on('close', () => {
  //       res.statusCode = 201;
  //       return res.end();
  //     });
  //
  //     res.on('close', () => {
  //       if (res.finished) return;
  //       fs.unlink(filepath, (err) => {});
  //     });
  //
  //     break;
  //
  //   default:
  //     res.statusCode = 501;
  //     res.end('Not implemented');
  // }
});

module.exports = server;
