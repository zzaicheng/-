import React,{useState} from 'react';
import {useLesson} from './components';
const SIZE=4;
function Pager({page,total,onChange,label}){return <div role="group" aria-label={label} className="table-pager"><button disabled={page===0} onClick={()=>onChange(page-1)}>이전 행</button><span>{page+1} / {total}</span><button disabled={page+1>=total} onClick={()=>onChange(page+1)}>다음 행</button></div>;}
export function Schedule({id}){
 const {state,patch}=useLesson(),rows=state.tables[id];const [selected,select]=useState(0);
 const total=Math.max(1,Math.ceil(rows.length/SIZE)),page=Math.min(selected,total-1),start=page*SIZE;
 const update=(i,key,value)=>patch('tables',id,rows.map((r,j)=>i===j?{...r,[key]:value}:r));
 return <div className="schedule-editor"><div className="schedule-scroll"><table className="schedule"><thead><tr><th>순서</th><th>시간</th><th>활동</th><th>삭제</th></tr></thead><tbody>{rows.slice(start,start+SIZE).map((r,j)=>{const i=start+j;return <tr key={r.id}><td>{i+1}</td><td><input aria-label={`${id} 시간 ${i+1}`} value={r.time} placeholder="시간 입력" onChange={e=>update(i,'time',e.target.value)}/></td><td><input aria-label={`${id} 활동 ${i+1}`} list="activities" value={r.activity} placeholder="1교시, 점심시간 등" onChange={e=>update(i,'activity',e.target.value)}/></td><td><button aria-label={`${i+1}행 삭제`} onClick={()=>patch('tables',id,rows.filter((_,j)=>i!==j))}>×</button></td></tr>;})}</tbody></table>{!rows.length&&<p>행을 추가해 일과를 작성하세요.</p>}</div><div className="table-pager"><button className="secondary" disabled={rows.length>=200} onClick={()=>{patch('tables',id,[...rows,{id:crypto.randomUUID(),time:'',activity:''}]);select(Math.floor(rows.length/SIZE));}}>＋ 행 추가</button><span>전체 {rows.length}행</span></div><Pager page={page} total={total} onChange={select} label="시간표 행 넘기기"/></div>;
}
export function ScheduleComparison(){
 const {state}=useLesson();const [selected,select]=useState(0);const total=Math.max(1,...Object.values(state.tables).map(r=>Math.ceil(r.length/SIZE))),page=Math.min(selected,total-1);
 return <><div className="schedule-comparison">{[['oursSchedule','내가 경험한 우리 학교'],['chinaSchedule','조사한 중국 학교']].map(([id,title])=><div className="panel" key={id}><h3>{title}</h3>{id==='chinaSchedule'&&<p className="muted">자료: {state.fields.chinaSource||'학교명 또는 링크 미입력'}</p>}<ol start={page*SIZE+1}>{state.tables[id].slice(page*SIZE,(page+1)*SIZE).map(r=><li key={r.id}><b>{r.time||'시각 미확인'}</b><span>{r.activity||'활동 미입력'}</span></li>)}</ol>{!state.tables[id].length&&<p className="muted">시간표에 작성한 내용이 여기에 표시됩니다.</p>}</div>)}</div><Pager page={page} total={total} onChange={select} label="비교 시간표 행 넘기기"/></>;
}
