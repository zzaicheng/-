import React,{useState} from 'react';
import data from './data/slides.json';
import EyeExercise from './EyeExercise';
export {EyeExercise};
import {SourceNode,walk,plain,Field,Complete,Photo,ScheduleComparison,Timer,useLesson} from './components';
export const slides=data;
function Source({index}){const main=data[index].children.find(n=>typeof n!=='string'&&n.tag==='main');return <SourceNode node={main} slide={index}/>;}
export function Welcome(){return <Source index={0}/>;}
export function LearningRoute(){return <Source index={1}/>;}
export function MySchool(){return <Source index={2}/>;}
export function Assumptions(){return <Source index={3}/>;}
export function NewYear(){return <Source index={4}/>;}
export function Predict(){return <Source index={5}/>;}
export function Nap(){return <Source index={6}/>;}
export function EntranceExam(){return <Source index={7}/>;}
export function ChinaSchedule(){return <Source index={9}/>;}
export function CompareExam(){return <><Source index={10}/><div className="below"><Complete id="d10d"/><Timer/></div></>;}
export function CompareRest(){return <><Source index={11}/><div className="below"><Complete id="d11d"/><Timer/></div></>;}
export function OurSchedule(){const [compare,setCompare]=useState(false);return <><div className="view-switch"><button aria-pressed={!compare} onClick={()=>setCompare(false)}>시간표 작성</button><button aria-pressed={compare} onClick={()=>setCompare(true)}>두 시간표 나란히 보기</button></div>{compare?<ScheduleComparison/>:<Source index={12}/>}</>;}
export function Respect(){return <><p className="scenario">교류 상황 · 중국 학생과 서로의 학교생활을 소개하다가 생각의 차이를 만났습니다.</p><Source index={13}/><p className="reflection-hint">내 경험 말하기 → 상대의 경험 묻기 → 차이의 배경 듣기</p></>;}
export function Reflection(){return <Source index={14}/>;}
export const slideComponents=[Welcome,LearningRoute,MySchool,Assumptions,NewYear,Predict,Nap,EntranceExam,EyeExercise,ChinaSchedule,CompareExam,CompareRest,OurSchedule,Respect,Reflection];

