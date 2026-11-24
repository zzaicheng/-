import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initialState,validateState} from '../src/state.mjs';
import {collectWrittenResults,makeWordResults} from '../src/word-results.mjs';

const slides=JSON.parse(readFileSync(new URL('../src/data/slides.json',import.meta.url)));

test('Word 내보내기는 저장된 답변과 입력한 시간표를 수업 순서대로 사용한다',()=>{
 const state=initialState();
 state.fields.d10a='서울에서 본 <시험> & 준비';
 state.fields['poll-2-experience']='다른 점심시간\n두 번째 줄';
 state.fields.eyeAnswer='  ';
 state.tables.chinaSchedule[1].activity='上午自习';
 const results=collectWrittenResults(validateState(JSON.parse(JSON.stringify(state))),slides);
 assert.deepEqual(results.map(section=>section.title),[slides[2],slides[9],slides[10]].map(slide=>slide.attrs['data-title']));
 assert.equal(results[0].answers[0].text,'다른 점심시간\n두 번째 줄');
 assert.deepEqual(results[1].rows,[['2','','上午自习']]);
 assert.equal(results[2].answers[0].text,'서울에서 본 <시험> & 준비');
});

test('답변이 없는 경우를 포함해 유효한 Word 파일을 생성한다',async()=>{
 const state=initialState();
 assert.deepEqual(collectWrittenResults(state,slides),[]);
 const blob=await makeWordResults(state,slides);
 assert.match(blob.type,/wordprocessingml\.document/);
 assert.equal(Buffer.from(await blob.arrayBuffer()).subarray(0,4).toString('hex'),'504b0304');
});
