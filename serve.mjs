import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('./dist/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpeg':'image/jpeg','.json':'application/json'};
const server=http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}if((await stat(file)).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end('Not found');}});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'4173 포트가 이미 사용 중입니다. 실행 중인 수업 창의 http://127.0.0.1:4173 을 확인하세요.':e.message);process.exitCode=1;});
server.listen(4173,'127.0.0.1',()=>console.log('수업 웹앱: http://127.0.0.1:4173\n종료: Ctrl+C. 인터넷 없이 사용할 수 있습니다. 바이두 검색은 인터넷 연결이 필요합니다.'));

