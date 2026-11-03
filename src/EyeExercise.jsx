import React,{useState} from 'react';
import data from './data/slides.json';
import {walk,plain,Field,Complete,Photo} from './components';

export const EYE_VIDEO_URL='https://www.bilibili.com/video/BV1Ab2XBTEww/';
export const EYE_PLAYER_URL='https://player.bilibili.com/player.html?bvid=BV1Ab2XBTEww&p=1&autoplay=0&danmaku=0';

export default function EyeExercise(){
 const [step,setStep]=useState(0),[video,setVideo]=useState(false);
 const cards=walk(data[8],n=>n.attrs.class==='eye-step-card'),card=cards[step],img=walk(card,n=>n.tag==='img')[0];
 return <main className="content eye-content">
  <div className="hero">눈 보호 체조 방법을 살펴보고, 체험 후 느낌을 정리해 봅시다.</div>
  <div className="eye-layout">
   <div className="panel eye-view">
    <h2>{video?'눈 보호 체조 · 영상자료':'교과서 51쪽 | 눈 보호 체조 방법'}</h2>
    <div className="step-tabs" role="group" aria-label="눈 보호 체조 단계">{cards.map((_,i)=><button key={i} aria-pressed={!video&&step===i} onClick={()=>{setStep(i);setVideo(false);}}>{i+1}단계</button>)}</div>
    {video?<div className="eye-video">
     <div className="video-frame"><iframe title="눈 보호 체조 영상 · bilibili" src={EYE_PLAYER_URL} allow="fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div>
     <div className="video-actions"><button onClick={()=>setVideo(false)}>← 설명으로 돌아가기</button><a href={EYE_VIDEO_URL} target="_blank" rel="noopener noreferrer">bilibili에서 영상 열기 ↗</a></div>
     <p className="muted">외부 영상 · 인터넷 연결이 필요합니다. 재생이 안 되면 위의 원본 링크를 이용하세요.</p>
    </div>:<div className="step-detail">
     <Photo src={img.attrs.src} alt={img.attrs.alt}/>
     <div><span className="eyebrow">STEP 0{step+1} / 06</span><p>{plain(walk(card,n=>n.tag==='p')[0])}</p>
      <div className="step-controls"><button disabled={!step} onClick={()=>setStep(step-1)}>← 이전 단계</button>{step<5?<button onClick={()=>setStep(step+1)}>다음 단계 →</button>:<button className="primary" onClick={()=>setVideo(true)}>영상자료 보기 →</button>}</div>
     </div>
    </div>}
   </div>
   <div className="panel eye-response"><span className="eyebrow">생각 나누기</span><h2>눈 보호 체조를 체험한 뒤 어떤 느낌이 들었나요?</h2><Field id="eyeAnswer" placeholder="체험한 뒤 느낀 점을 적어 보세요."/><Complete id="eyeAnswer"/></div>
  </div>
 </main>;
}
