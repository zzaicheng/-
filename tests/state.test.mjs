import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialState,validateState,percentages,isEditing} from '../src/state.mjs';
import fs from 'node:fs';
test('저장 파일 왕복 및 손상된 파일 거부',()=>{const v=initialState();v.fields.eyeAnswer='느낀 점';assert.deepEqual(validateState(JSON.parse(JSON.stringify(v))),v);for(const bad of [null,{version:2},{...v,tables:{}},{...v,polls:{a:[-1]}},{...v,fields:{a:2}}])assert.throws(()=>validateState(bad));});
test('빈 집계와 인원 비율',()=>{assert.deepEqual(percentages([0,0]),[0,0]);assert.deepEqual(percentages([1,3]),[25,75]);});
test('입력 요소 단축키 보호',()=>{assert.equal(isEditing({closest:()=>({})}),true);assert.equal(isEditing({closest:()=>null}),false);});
test('원본 15페이지와 6단계 자료·이미지 보존',()=>{const slides=JSON.parse(fs.readFileSync(new URL('../src/data/slides.json',import.meta.url)));assert.equal(slides.length,15);const all=JSON.stringify(slides);for(let i=1;i<=6;i++)assert.ok(all.includes(`교과서 눈 보호 체조 ${i}단계 그림`));const images=JSON.parse(fs.readFileSync(new URL('../docs/assets.json',import.meta.url)));for(const image of images)assert.ok(fs.existsSync(new URL('../public/assets/'+image.file,import.meta.url)));});
