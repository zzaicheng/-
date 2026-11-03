import React,{useLayoutEffect,useRef,useState} from 'react';

// Fit the actual content, including revealed answers, to the available lesson area.
export default function FitSlide({children,className}){
 const host=useRef(null),content=useRef(null);
 const [layout,setLayout]=useState({width:1200,scale:1});
 useLayoutEffect(()=>{
  let frame;
  const update=()=>{
   const box=host.current,node=content.current;if(!box||!node)return;
   const width=Math.max(1100,box.clientWidth);
   if(node.offsetWidth!==width){setLayout(v=>({...v,width}));return;}
   const scale=Math.min(1,box.clientWidth/width,box.clientHeight/Math.max(1,node.scrollHeight+4));
   setLayout(v=>v.width===width&&Math.abs(v.scale-scale)<.0001?v:{width,scale});
  };
  const measure=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);};
  const observer=new ResizeObserver(measure);observer.observe(host.current);observer.observe(content.current);
  const mutations=new MutationObserver(measure);mutations.observe(content.current,{subtree:true,childList:true,attributes:true});
  window.addEventListener('resize',measure);update();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();mutations.disconnect();window.removeEventListener('resize',measure);};
 },[layout.width]);
 return <div className="fit-viewport" ref={host}><div ref={content} className={'slide-body fit-slide '+className} style={{width:layout.width,transform:`translateX(-50%) scale(${layout.scale})`}}>{children}</div></div>;
}
