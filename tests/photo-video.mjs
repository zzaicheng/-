import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge'});
try{for(const viewport of [{width:615,height:532},{width:1366,height:768},{width:1920,height:1080}]){
 const p=await browser.newPage({viewport});await p.route('https://player.bilibili.com/**', route=>route.fulfill({contentType:'text/html',body:'<title>Bilibili player fixture</title>'}));await p.goto(process.env.LESSON_URL||'http://127.0.0.1:5173');
 const jump=async i=>{await p.locator('.page-button').click();await p.locator('.contents-menu button').nth(i).click();};
 const fits=async()=>{await p.waitForTimeout(250);assert.ok(await p.evaluate(()=>{const a=document.querySelector('.fit-viewport').getBoundingClientRect(),s=document.querySelector('.fit-slide').getBoundingClientRect();return s.bottom<=a.bottom+1&&document.documentElement.scrollHeight<=innerHeight+1;}));};
 await jump(6);await p.getByRole('button',{name:'O',exact:true}).click();const photo=p.locator('#napContent img');await photo.evaluate(im=>im.decode());assert.ok((await photo.getAttribute('src')).endsWith('nap-classroom-user.png'));assert.deepEqual(await photo.evaluate(im=>[im.naturalWidth,im.naturalHeight]),[1333,800]);await fits();await p.screenshot({path:`test-results/new-photo-${viewport.width}.png`});
 await jump(8);
 const player=p.locator('iframe[title="눈 보호 체조 Bilibili 영상"]');
 const openVideo=p.getByRole('button',{name:'영상자료 보기 →',exact:true});
 await p.locator('#eyeAnswer').fill('영상과 설명을 함께 본 소감');
 for(let stage=1;stage<=6;stage++){
  await p.getByAltText(`눈 보호 체조 ${stage}단계 AI 사진`).waitFor();
  assert.equal(await player.count(),0);
  if(stage<6){
   assert.equal(await openVideo.count(),0);
   await p.getByRole('button',{name:'다음 단계 →',exact:true}).click();
  }
 }
 await openVideo.click();
 const playerUrl=new URL(await player.getAttribute('src'));
 assert.equal(playerUrl.hostname,'player.bilibili.com');
 assert.equal(playerUrl.searchParams.get('bvid'),'BV1Ab2XBTEww');
 assert.equal(await p.locator('video').count(),0);
 assert.equal(await p.getByRole('button',{name:'6단계 안내 영상 보기',exact:true}).count(),0);
 assert.equal(await p.getByRole('link',{name:'bilibili에서 영상 열기 ↗'}).getAttribute('href'),'https://www.bilibili.com/video/BV1Ab2XBTEww/');
 await fits();
 await p.screenshot({path:`test-results/new-video-${viewport.width}.png`});
 await p.getByRole('button',{name:'← 단계 설명 보기',exact:true}).click();
 assert.equal(await player.count(),0);
 assert.equal(await p.locator('#eyeAnswer').inputValue(),'영상과 설명을 함께 본 소감');
 assert.equal(await p.getByRole('button',{name:'6단계',exact:true}).getAttribute('aria-pressed'),'true');
 await openVideo.click();
 await jump(9);
 assert.equal(await player.count(),0);
 console.log(JSON.stringify({viewport,photo:true,video:true,fits:true,responsePreserved:true}));
 await p.close();
}}finally{await browser.close();}
