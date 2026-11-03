import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {percentages} from './state.mjs';
import {Schedule,ScheduleComparison} from './PagedSchedules';
export {Schedule,ScheduleComparison};
export const LessonContext=createContext(null);
export const useLesson=()=>useContext(LessonContext);
export function walk(node,predicate){if(typeof node==='string')return [];return [...(predicate(node)?[node]:[]),...node.children.flatMap(c=>walk(c,predicate))];}
export const plain=n=>typeof n==='string'?n:n.children.map(plain).join('');
export function Field({id,placeholder,label,small=false}){const {state,setField}=useLesson();return <textarea id={id} aria-label={label||placeholder||'생각 나누기 답변'} className={'answer '+(small?'small':'')} placeholder={placeholder} value={state.fields[id]||''} onChange={e=>setField(id,e.target.value)}/>;}
export function Complete({id,requires,children='작성 완료'}){const {state,patch}=useLesson();const [error,setError]=useState('');const finish=()=>{if(!(state.fields[id]||'').trim()||(requires&&!state.choices[requires])){setError(requires?'두 질문에 모두 답한 뒤 눌러 주세요.':'생각을 작성한 뒤 눌러 주세요.');return;}patch('done',id,true);setError('');};return <div className="completion"><span role="status">{error||(state.done[id]?'작성 완료!':'')}</span><button className="primary" onClick={finish}>{children}</button></div>;}
export function Photo({src,alt}){const {setImage}=useLesson();return <button className="photo-button" onClick={()=>setImage({src,alt})} aria-label={`${alt} 확대`}><img src={src} alt={alt}/><span>확대 보기 ↗</span></button>;}
export function Choices({id,options}){const {state,patch}=useLesson();return <div className={options.length>2?'monthgrid':'ox'} role="group" aria-label={id==='month'?'새 학년 시작 시기':'O/X 선택'}>{options.map(value=><button key={value} className={state.choices[id]===value?'chosen':''} aria-pressed={state.choices[id]===value} onClick={()=>patch('choices',id,value)}>{value}</button>)}</div>;}
export function Poll({node,id}){const {state,patch,setField}=useLesson();const cards=walk(node,n=>n.attrs.class==='pollcard');const values=state.polls[id]||cards.map(()=>0);const pct=percentages(values);return <><div className="poll">{cards.map((card,i)=>{const label=plain(walk(card,n=>n.tag==='span')[0]);return <div className="pollcard" key={i}><button className={'poll-choice '+(state.choices[id]?.split(',').includes(String(i))?'selected':'')} aria-pressed={state.choices[id]?.split(',').includes(String(i))||false} onClick={()=>{const a=new Set((state.choices[id]||'').split(',').filter(Boolean));a.has(String(i))?a.delete(String(i)):a.add(String(i));patch('choices',id,[...a].join(','));}}>{label}</button><label>우리 반 인원 <input aria-label={`${label} 선택 인원`} type="number" min="0" max="999" value={values[i]} onChange={e=>{const v=[...values];v[i]=Math.min(999,Math.max(0,Number(e.target.value)||0));patch('polls',id,v);}}/></label><div className="bar" role="img" aria-label={`${values[i]}명, ${Math.round(pct[i])}%`}><div style={{width:pct[i]+'%'}}/></div></div>;})}</div><div className="poll-foot"><span>문장을 눌러 내 경험을 선택하세요. 인원은 교사가 직접 집계합니다.</span><input aria-label="다른 경험 한 줄" placeholder="다른 경험이 있다면 한 줄로 적어 보세요." value={state.fields[id+'-experience']||''} onChange={e=>setField(id+'-experience',e.target.value)}/></div></>;}
export function Timer({seconds=180}){const [left,setLeft]=useState(seconds),[running,run]=useState(false);const end=useRef(0);useEffect(()=>{if(!running)return;end.current=Date.now()+left*1000;const t=setInterval(()=>{const s=Math.max(0,Math.ceil((end.current-Date.now())/1000));setLeft(s);if(!s)run(false);},200);return()=>clearInterval(t);},[running]);return <div className="timer"><b>짝과 이야기하기</b><output aria-label="남은 시간">{String(Math.floor(left/60)).padStart(2,'0')}:{String(left%60).padStart(2,'0')}</output><button onClick={()=>left&&run(true)} disabled={running||!left}>시작</button><button onClick={()=>run(false)} disabled={!running}>일시정지</button><button onClick={()=>{run(false);setLeft(seconds);}}>초기화</button>{!left&&<span role="status">토의 시간이 끝났습니다.</span>}</div>;}
// Source nodes are data, never executable HTML. Preserve source wording; replace controls with React components.
export function SourceNode({node,path='0',slide}){const ctx=useLesson();if(typeof node==='string')return node;const {tag,attrs:a,children}=node;const cls=a.class||'';const render=()=>children.map((n,i)=><SourceNode key={i} node={n} path={path+'.'+i} slide={slide}/>);
 if(tag==='header'||cls==='titlebar'||cls==='emoji')return null;
 if(cls.split(' ').includes('timer'))return <Timer seconds={Number(a['data-seconds'])}/>;
 if(cls==='poll')return <Poll node={node} id={'poll-'+slide}/>;
 if(tag==='img')return <Photo src={a.src} alt={a.alt}/>;
 if(cls==='zoom'||cls==='bar'||a.id?.startsWith('msg-')||a.id==='q6msg')return null;
 if(tag==='textarea')return <Field id={a.id} placeholder={a.placeholder} label={a['aria-label']}/>;
 if(tag==='input'){const id=a.id||path;return <input id={id} aria-label={a['aria-label']||a.placeholder} placeholder={a.placeholder} value={ctx.state.fields[id]||''} onChange={e=>ctx.setField(id,e.target.value)}/>;}
 if(cls==='monthgrid')return <Choices id="month" options={Array.from({length:12},(_,i)=>(i+1)+'月')}/>;
 if(a.id==='monthReveal'&&!ctx.state.choices.month)return null;
 if(cls.split(' ').includes('ox'))return <Choices id={slide===6?'nap':'class'} options={['O','X']}/>;
 if(a.id==='q6placeholder'&&ctx.state.done.q6text)return null;
 if(a.id==='q6reveal'&&!ctx.state.done.q6text)return null;
 if(cls==='nap-placeholder'&&ctx.state.choices.nap)return null;
 if(a.id==='napContent'&&!ctx.state.choices.nap)return null;
 if(a.id==='q6done')return <Complete id="q6text" requires="class"/>;
 if(cls.split(' ').includes('complete'))return <Complete id={a['data-target']}/>;
 if(tag==='table'&&a.id)return <Schedule id={a.id}/>;
 if(cls.split(' ').includes('schedule-scroll'))return <div>{render()}</div>;
 if(a.id==='chinaAdd'||a.id==='oursAdd')return null;
 const props={className:cls.replace(/\bhidden\b|\bnap-hidden\b/g,''),id:a.id};
 if(tag==='label')props.htmlFor=a.for;
 if(tag==='a'){props.href=a.href?.replace(/\s/g,'');props.target='_blank';props.rel='noopener noreferrer';}
 if(tag==='br')return <br/>;
 return React.createElement(tag,props,render());
}

