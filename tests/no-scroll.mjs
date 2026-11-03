import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge'});const reports=[];
try{for(const viewport of [{width:615,height:532},{width:1366,height:650},{width:1366,height:768},{width:1920,height:1080}]){
 const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.LESSON_URL||'http://127.0.0.1:5173');
 const jump=async i=>{await page.locator('.page-button').click();await page.locator('.contents-menu button').nth(i).click();};
 const check=async()=>{await page.waitForTimeout(180);const box=await page.evaluate(()=>{const area=document.querySelector('.fit-viewport'),slide=document.querySelector('.fit-slide'),r=slide.getBoundingClientRect(),a=area.getBoundingClientRect();return {pageScroll:document.documentElement.scrollHeight>innerHeight+1,areaScroll:document.querySelector('.lesson-scroll').scrollHeight>document.querySelector('.lesson-scroll').clientHeight+1,fits:r.bottom<=a.bottom+1&&r.left>=a.left-1&&r.right<=a.right+1,scale:getComputedStyle(slide).transform};});assert.equal(box.pageScroll,false);assert.equal(box.areaScroll,false);assert.equal(box.fits,true,JSON.stringify({viewport,...box}));};
 for(let i=0;i<15;i++){await jump(i);await check();}
 await jump(5);await page.getByRole('button',{name:'O',exact:true}).click();await page.locator('#q6text').fill('내가 예상한 학교생활');await page.getByRole('button',{name:'작성 완료',exact:true}).click();await check();
 await jump(6);await page.getByRole('button',{name:'O',exact:true}).click();await check();
 await jump(9);await page.getByLabel('chinaSchedule 활동 1',{exact:true}).fill('저장되는 첫 활동');await page.getByRole('button',{name:'＋ 행 추가',exact:true}).click();await page.getByLabel('chinaSchedule 활동 6',{exact:true}).fill('새로운 여섯 번째 활동');await page.getByRole('button',{name:'이전 행',exact:true}).click();assert.equal(await page.getByLabel('chinaSchedule 활동 1',{exact:true}).inputValue(),'저장되는 첫 활동');await page.getByRole('button',{name:'다음 행',exact:true}).click();assert.equal(await page.getByLabel('chinaSchedule 활동 6',{exact:true}).inputValue(),'새로운 여섯 번째 활동');await page.getByRole('button',{name:'6행 삭제',exact:true}).click();await check();
 await jump(12);await page.getByRole('button',{name:'두 시간표 나란히 보기',exact:true}).click();await check();await page.getByRole('button',{name:'다음 행',exact:true}).click();await check();assert.deepEqual(errors,[]);
 await jump(13);await check();await page.screenshot({path:`test-results/no-scroll-${viewport.width}x${viewport.height}.png`});reports.push({viewport,pages:15,fit:true,pagination:true,errors});await page.close();
}await fs.writeFile('test-results/no-scroll-report.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports));}finally{await browser.close();}
