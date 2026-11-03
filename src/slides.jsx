import React,{useState} from 'react';
import data from './data/slides.json';
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
export function EyeExercise(){const [step,setStep]=useState(0);const cards=walk(data[8],n=>n.attrs.class==='eye-step-card');const card=cards[step];const img=walk(card,n=>n.tag==='img')[0];return <main className="content eye-content"><div className="hero">눈 보호 체조 방법을 살펴보고, 체험 후 느낌을 정리해 봅시다.</div><div className="eye-layout"><div className="panel eye-view"><h2>교과서 51쪽 | 눈 보호 체조 방법</h2><div className="step-tabs" role="group" aria-label="눈 보호 체조 단계">{cards.map((_,i)=><button key={i} aria-pressed={step===i} onClick={()=>setStep(i)}>{i+1}단계</button>)}</div><div className="step-detail"><Photo src={img.attrs.src} alt={img.attrs.alt}/><div><span className="eyebrow">STEP 0{step+1} / 06</span><p>{plain(walk(card,n=>n.tag==='p')[0])}</p><div className="step-controls"><button disabled={!step} onClick={()=>setStep(step-1)}>← 이전 단계</button><button disabled={step===5} onClick={()=>setStep(step+1)}>다음 단계 →</button></div></div></div></div><div className="panel eye-response"><span className="eyebrow">생각 나누기</span><h2>눈 보호 체조를 체험한 뒤 어떤 느낌이 들었나요?</h2><Field id="eyeAnswer" placeholder="체험한 뒤 느낀 점을 적어 보세요."/><Complete id="eyeAnswer"/></div></div></main>;}
export function ChinaSchedule(){return <Source index={9}/>;}
export function CompareExam(){return <><Source index={10}/><div className="below"><Complete id="d10d"/><Timer/></div></>;}
export function CompareRest(){return <><Source index={11}/><div className="below"><Complete id="d11d"/><Timer/></div></>;}
export function OurSchedule(){const [compare,setCompare]=useState(false);return <><div className="view-switch"><button aria-pressed={!compare} onClick={()=>setCompare(false)}>시간표 작성</button><button aria-pressed={compare} onClick={()=>setCompare(true)}>두 시간표 나란히 보기</button></div>{compare?<ScheduleComparison/>:<Source index={12}/>}</>;}
export function Respect(){return <><p className="scenario">교류 상황 · 중국 학생과 서로의 학교생활을 소개하다가 생각의 차이를 만났습니다.</p><Source index={13}/><p className="reflection-hint">내 경험 말하기 → 상대의 경험 묻기 → 차이의 배경 듣기</p></>;}
export function Reflection(){return <Source index={14}/>;}
export const slideComponents=[Welcome,LearningRoute,MySchool,Assumptions,NewYear,Predict,Nap,EntranceExam,EyeExercise,ChinaSchedule,CompareExam,CompareRest,OurSchedule,Respect,Reflection];
