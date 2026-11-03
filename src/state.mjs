export const STORAGE_KEY='school-life:v1';
export const blankRows=(count)=>Array.from({length:count},(_,i)=>({id:`initial-${i}`,time:'',activity:''}));
export const initialState=()=>({version:1,fields:{},choices:{},done:{},polls:{},tables:{chinaSchedule:blankRows(5),oursSchedule:blankRows(6)}});
export function validateState(v){
 if(!v||v.version!==1) throw Error('지원하지 않는 수업 파일입니다.');
 for(const k of ['fields','choices','done','polls','tables']) if(!v[k]||typeof v[k]!=='object'||Array.isArray(v[k])) throw Error('파일 구조를 확인해 주세요.');
 for(const x of Object.values(v.fields)) if(typeof x!=='string'||x.length>100000) throw Error('답변 형식이 올바르지 않습니다.');
 for(const x of Object.values(v.choices)) if(typeof x!=='string') throw Error('선택 형식이 올바르지 않습니다.');
 for(const x of Object.values(v.done)) if(typeof x!=='boolean') throw Error('완료 형식이 올바르지 않습니다.');
 for(const p of Object.values(v.polls)) if(!Array.isArray(p)||p.some(x=>!Number.isFinite(x)||x<0||x>999)) throw Error('인원 수가 올바르지 않습니다.');
 for(const id of ['chinaSchedule','oursSchedule']){
  const rows=v.tables[id]; if(!Array.isArray(rows)||rows.length>200||rows.some(r=>!r||['id','time','activity'].some(k=>typeof r[k]!=='string'))||new Set(rows.map(r=>r.id)).size!==rows.length) throw Error('시간표 형식이 올바르지 않습니다.');
 }
 return v;
}
export function isEditing(target){return !!target?.closest?.('input,textarea,select,button,a,[contenteditable], [role="dialog"]');}
export function percentages(values){const total=values.reduce((a,b)=>a+b,0);return values.map(v=>total?100*v/total:0);}
