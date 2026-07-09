import { useState, useEffect, useRef, useCallback } from "react";

const SK = {
  routines:"gt_r3", plan:"gt_p5", history:"gt_h3",
  nutrition:"gt_n5", planMode:"gt_pm4",
};
const load = k => { try { return JSON.parse(localStorage.getItem(k)) ?? null; } catch { return null; } };
const save = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} };

const MG_LIST = ["Pecho","Espalda","Piernas","Hombros","Biceps","Triceps","Core","Cardio","Rest"];
const MG_COLORS = {
  Pecho:"#ef4444",Espalda:"#f97316",Piernas:"#eab308",Hombros:"#22c55e",
  Biceps:"#06b6d4",Triceps:"#8b5cf6",Core:"#ec4899",Cardio:"#f43f5e",Rest:"#334155",
};
const WEEK_DAYS = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"];
const uid = () => Math.random().toString(36).slice(2,9);

const DC = [
  {id:uid(),food:"Salmas",portion:"3 tostadas",carbs:10,fat:4},
  {id:uid(),food:"Avena",portion:"3 cucharadas",carbs:20,fat:9},
  {id:uid(),food:"Arroz cocido",portion:"1/2 taza",carbs:22,fat:1},
  {id:uid(),food:"Pasta cocida",portion:"1/2 plato",carbs:40,fat:2},
  {id:uid(),food:"Tortilla de nopal",portion:"1 pieza",carbs:3,fat:13},
  {id:uid(),food:"Tortilla de maiz",portion:"1 pieza",carbs:12,fat:7},
  {id:uid(),food:"Pan Bimbo Cero Cero",portion:"1 rebanada",carbs:12,fat:6},
  {id:uid(),food:"Platano mediano",portion:"1 pieza",carbs:27,fat:1},
];
const DP = [
  {id:uid(),food:"Huevo entero",portion:"1 pieza",protein:6,fat:63},
  {id:uid(),food:"Clara de huevo",portion:"1 pieza",protein:3.5,fat:0},
  {id:uid(),food:"Pechuga de pollo",portion:"100 g",protein:31,fat:10},
  {id:uid(),food:"Filete de pescado",portion:"100 g",protein:22,fat:8},
  {id:uid(),food:"Atun Tuny",portion:"125 g",protein:28,fat:3},
  {id:uid(),food:"Atun en cubos",portion:"200 g",protein:44,fat:4},
  {id:uid(),food:"Queso Oaxaca",portion:"30 g",protein:7,fat:60},
  {id:uid(),food:"Queso Panela",portion:"30 g",protein:6,fat:46},
  {id:uid(),food:"Yogurt griego",portion:"3 cucharadas",protein:4.5,fat:0},
];

function Icon({ name, size=20, color="currentColor" }) {
  const P = { fill:"none", stroke:color, strokeWidth:"2", width:size, height:size, viewBox:"0 0 24 24" };
  const B = { ...P, strokeWidth:"2.5" };
  const map = {
    calendar:<svg {...P}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    dumbbell:<svg {...P}><path d="M6.5 6.5h11M6.5 17.5h11M4 8.5v7M8 6v12M16 6v12M20 8.5v7"/></svg>,
    play:<svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M5 3l14 9-14 9V3z"/></svg>,
    plus:<svg {...B}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash:<svg {...P}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    check:<svg {...B}><polyline points="20 6 9 17 4 12"/></svg>,
    back:<svg {...P}><polyline points="15 18 9 12 15 6"/></svg>,
    up:<svg {...P}><polyline points="18 15 12 9 6 15"/></svg>,
    down:<svg {...P}><polyline points="6 9 12 15 18 9"/></svg>,
    timer:<svg {...P}><circle cx="12" cy="13" r="8"/><polyline points="12 9 12 13 14 15"/><path d="M9 3h6M12 3v2"/></svg>,
    fire:<svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2C12 2 8 6 8 10c0 1.5.6 2.9 1.6 4C8 13 7 11 7 10c0 0-3 3-3 7a8 8 0 0016 0c0-4.4-4-9-8-15z"/></svg>,
    edit:<svg {...P}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    close:<svg {...B}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    trophy:<svg {...P}><path d="M8 21h8M12 17v4M7 4H4l1 7a4 4 0 007 0 4 4 0 007 0l1-7h-3"/><path d="M6 4v.5A5.5 5.5 0 0017.5 4.5V4"/></svg>,
    history:<svg {...P}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
    food:<svg {...P}><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
    trend:<svg {...P}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    chart:<svg {...P}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  };
  return map[name] || null;
}

const fmtTime = s => { const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60; return h>0?`${h}h ${m}m`:`${m}m ${String(ss).padStart(2,"0")}s`; };
const fmtDate = iso => new Date(iso).toLocaleDateString("es-MX",{day:"2-digit",month:"short"});
const fmtDateFull = iso => new Date(iso).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"});
const calcEst = exs => exs.reduce((t,ex)=>t+ex.sets*(Math.round((parseInt(ex.repsMax)||10)*3)+(parseInt(ex.rest)||90)),0);
const calcVol = sets => sets.reduce((v,s)=>v+(parseFloat(s.weight)||0)*(parseInt(s.reps)||0),0);

const S = {
  app:{minHeight:"100vh",background:"#0F0F14",color:"#f8f8ff",fontFamily:"Inter,system-ui,sans-serif",display:"flex",flexDirection:"column"},
  card:{background:"#1e1e2e",borderRadius:16,padding:16,marginBottom:12},
  csm:{background:"#1e1e2e",borderRadius:12,padding:12,marginBottom:8},
  tag:c=>({background:`${c}22`,color:c,border:`1px solid ${c}44`,borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:600}),
  badge:(c="#7C3AED")=>({background:c,color:"#fff",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700}),
  inp:{background:"#0f0f14",border:"1px solid #2d2d3d",borderRadius:10,padding:"10px 12px",color:"#f8f8ff",fontSize:14,width:"100%",boxSizing:"border-box",outline:"none"},
  lbl:{fontSize:11,color:"#64748b",marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.08em"},
  h1:{fontSize:22,fontWeight:800,margin:0,letterSpacing:"-0.03em"},
  h2:{fontSize:17,fontWeight:700,margin:"0 0 12px"},
  nav:{display:"flex",background:"#12121a",borderTop:"1px solid #1e1e2e",position:"fixed",bottom:0,left:0,right:0,zIndex:100},
};
const B = (bg="#7C3AED",color="#fff") => ({background:bg,color,border:"none",borderRadius:12,padding:"12px 20px",fontWeight:700,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,fontFamily:"inherit"});

function NavBtn({icon,label,active,onClick}) {
  return (
    <button onClick={onClick} style={{flex:1,padding:"10px 0 14px",background:"transparent",border:"none",color:active?"#7C3AED":"#475569",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontFamily:"inherit"}}>
      <Icon name={icon} size={22} color={active?"#7C3AED":"#475569"}/>
      <span style={{fontSize:10,fontWeight:active?700:500}}>{label}</span>
    </button>
  );
}

function NumInput({value,onChange,min,max,style,placeholder}) {
  const [raw,setRaw] = useState(String(value??0));
  useEffect(()=>{setRaw(String(value??0));},[value]);
  return (
    <input type="text" inputMode="decimal" value={raw} placeholder={placeholder} style={style}
      onFocus={e=>e.target.select()}
      onChange={e=>{const v=e.target.value;if(v===""||/^-?\d*\.?\d*$/.test(v)){setRaw(v);const n=parseFloat(v);if(!isNaN(n))onChange(n);}}}
      onBlur={()=>{const n=parseFloat(raw);const f=isNaN(n)?(min??0):Math.max(min??-Infinity,Math.min(max??Infinity,n));setRaw(String(f));onChange(f);}}
    />
  );
}

function LineChart({data,color="#7C3AED"}) {
  if(!data||data.length<2) return <div style={{height:80,display:"flex",alignItems:"center",justifyContent:"center",color:"#475569",fontSize:12,textAlign:"center",padding:"0 8px"}}>Necesitas al menos 2 sesiones para ver la grafica</div>;
  const vals=data.map(d=>d.value);
  const minV=Math.min(...vals),maxV=Math.max(...vals),range=maxV-minV||1;
  const W=300,H=100,pX=36,pY=14;
  const iw=W-pX*2,ih=H-pY*2;
  const px=i=>pX+(i/(data.length-1))*iw;
  const py=v=>H-pY-((v-minV)/range)*ih;
  const pts=data.map((d,i)=>`${px(i)},${py(d.value)}`).join(" ");
  const gid=`g${color.replace("#","")}`;
  return (
    <div style={{overflowX:"auto"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",minWidth:220,height:H}}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0,0.5,1].map(t=>{
          const y=pY+t*ih,v=maxV-t*range;
          return (<g key={t}><line x1={pX} y1={y} x2={W-pX} y2={y} stroke="#2d2d3d" strokeWidth="1" strokeDasharray="3"/><text x={pX-4} y={y+4} fontSize="8" fill="#475569" textAnchor="end">{v.toFixed(0)}</text></g>);
        })}
        <polygon fill={`url(#${gid})`} points={`${pX},${H-pY} ${pts} ${W-pX},${H-pY}`}/>
        <polyline fill="none" stroke={color} strokeWidth="2.5" points={pts} strokeLinecap="round" strokeLinejoin="round"/>
        {data.map((d,i)=>{
          const x=px(i),y=py(d.value),last=i===data.length-1;
          return (<g key={i}><circle cx={x} cy={y} r={last?5:3} fill={last?"#fff":color} stroke={color} strokeWidth={last?2:0}/>{(last||data.length<=5)&&<text x={x} y={y-8} fontSize="9" fill={last?"#f8f8ff":color} textAnchor="middle" fontFamily="monospace">{d.value.toFixed(0)}</text>}</g>);
        })}
        {data.map((d,i)=>{
          if(data.length>7&&i%2!==0&&i!==data.length-1) return null;
          return <text key={`x${i}`} x={px(i)} y={H-1} fontSize="7" fill="#475569" textAnchor="middle">{fmtDate(d.date)}</text>;
        })}
      </svg>
    </div>
  );
}

function RestTimer({seconds,onDone}) {
  const [left,setLeft] = useState(seconds);
  useEffect(()=>{if(left<=0){onDone();return;}const t=setTimeout(()=>setLeft(l=>l-1),1000);return()=>clearTimeout(t);},[left]);
  const pct=(left/seconds)*100;
  const r=54,circ=2*Math.PI*r;
  return (
    <div style={{textAlign:"center",padding:"20px 0"}}>
      <div style={{position:"relative",width:120,height:120,margin:"0 auto 14px"}}>
        <svg viewBox="0 0 120 120" style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8"/>
          <circle cx="60" cy="60" r={r} fill="none" stroke="#7C3AED" strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
            strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:"monospace",fontSize:28,fontWeight:700,color:"#f8f8ff"}}>{left}</span>
          <span style={{fontSize:11,color:"#64748b"}}>seg</span>
        </div>
      </div>
      <button onClick={onDone} style={{...B("#1e1e2e"),fontSize:13}}>Saltar descanso</button>
    </div>
  );
}

function EditCell({value,onSave,type,width}) {
  const [ed,setEd] = useState(false);
  const [tmp,setTmp] = useState(String(value??""));
  const commit = () => { onSave(type==="number"?(parseFloat(tmp)||0):tmp); setEd(false); };
  if(ed) return <input autoFocus value={tmp} onChange={e=>setTmp(e.target.value)} onFocus={e=>e.target.select()} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")e.target.blur();}} style={{background:"#2d2d3d",border:"1px solid #7C3AED",borderRadius:6,padding:"2px 6px",color:"#f8f8ff",fontSize:12,width:width||"auto",fontFamily:"inherit",outline:"none"}}/>;
  return <span onClick={()=>{setTmp(String(value??""));setEd(true);}} style={{cursor:"pointer",borderBottom:"1px dashed #2d2d3d",fontSize:12,padding:"1px 2px",display:"inline-block",minWidth:20}}>{value??"-"}</span>;
}

// ── PLAN ──────────────────────────────────────────────────────────────────────
function PlanScreen({routines,plan,setPlan,planMode,setPlanMode,onStartWorkout}) {
  const [editing,setEditing] = useState(null);
  const [selMgs,setSelMgs] = useState([]);
  const [selRoutine,setSelRoutine] = useState("");
  const todayIdx = planMode==="week"?(new Date().getDay()+6)%7:null;

  const days = planMode==="week"
    ? WEEK_DAYS.map((d,i)=>({label:d,short:d.slice(0,3).toUpperCase(),...(plan[i]||{})}))
    : plan.map((p,i)=>({label:`Dia ${i+1}`,short:`D${i+1}`,...p}));

  const getColor = d => { const mgs=d.mgs?.length?d.mgs:(d.mg?[d.mg]:[]); return mgs.length?MG_COLORS[mgs[0]]||"#334155":"#1e1e2e"; };

  const openEdit = i => { setEditing(i); setSelMgs(days[i]?.mgs||(days[i]?.mg?[days[i].mg]:[])); setSelRoutine(days[i]?.routineId||""); };
  const doSave = () => { const n=[...plan]; while(n.length<=editing)n.push({}); n[editing]={mgs:selMgs,routineId:selRoutine}; setPlan(n); setEditing(null); };
  const toggleMg = mg => setSelMgs(prev=>prev.includes(mg)?prev.filter(x=>x!==mg):prev.length>=3?prev:[...prev,mg]);

  const switchMode = mode => {
    setPlanMode(mode);
    if(mode==="week") setPlan(Array(7).fill(null).map((_,i)=>plan[i]||{}));
    else { const c=Math.max(plan.length,4); setPlan(Array(c).fill(null).map((_,i)=>plan[i]||{})); }
  };
  const adjDays = d => setPlan(prev=>{ const n=Math.max(1,Math.min(14,prev.length+d)); return n>prev.length?[...prev,...Array(n-prev.length).fill({})]:prev.slice(0,n); });

  return (
    <div style={{padding:"0 16px 100px"}}>
      <div style={{padding:"20px 0 12px",display:"flex",alignItems:"center",gap:10}}>
        <Icon name="calendar" size={24} color="#7C3AED"/>
        <span style={S.h1}>Plan</span>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,background:"#12121a",borderRadius:12,padding:4}}>
        {[["week","Semana"],["days","Dia 1, 2, 3..."]].map(([k,l])=>(
          <button key={k} onClick={()=>switchMode(k)} style={{flex:1,padding:"8px 6px",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:planMode===k?"#7C3AED":"transparent",color:planMode===k?"#fff":"#64748b",fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>
      {planMode==="days"&&(
        <div style={{...S.csm,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <span style={{fontSize:13,color:"#94a3b8"}}>Dias en el ciclo</span>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>adjDays(-1)} style={{width:30,height:30,borderRadius:8,background:"#2d2d3d",border:"none",color:"#f8f8ff",fontWeight:700,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
            <span style={{fontFamily:"monospace",fontWeight:800,fontSize:20,minWidth:28,textAlign:"center"}}>{days.length}</span>
            <button onClick={()=>adjDays(1)} style={{width:30,height:30,borderRadius:8,background:"#7C3AED",border:"none",color:"#fff",fontWeight:700,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {days.map((d,i)=>{
          const mgs=d.mgs?.length?d.mgs:(d.mg?[d.mg]:[]);
          const color=getColor(d), isToday=i===todayIdx;
          const routine=routines.find(r=>r.id===d.routineId);
          return (
            <div key={i} onClick={()=>openEdit(i)} style={{...S.card,borderLeft:`3px solid ${color}`,cursor:"pointer",boxShadow:isToday?"0 0 0 1.5px #7C3AED44":"none",background:isToday?"#1e1e2e":"#181825"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:11,fontWeight:700,color:isToday?"#7C3AED":"#64748b",letterSpacing:"0.06em"}}>{d.label.toUpperCase()}</span>
                {isToday&&<span style={{fontSize:9,background:"#7C3AED22",color:"#7C3AED",borderRadius:6,padding:"1px 6px",fontWeight:700}}>HOY</span>}
              </div>
              {mgs.length>0?(
                <>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:4}}>{mgs.map(mg=><div key={mg} style={S.tag(MG_COLORS[mg]||"#475569")}>{mg}</div>)}</div>
                  {routine&&<div style={{fontSize:11,color:"#94a3b8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4}}>{routine.name}</div>}
                  {isToday&&d.routineId&&<button onClick={e=>{e.stopPropagation();onStartWorkout(d.routineId);}} style={{...B("#7C3AED"),marginTop:6,padding:"7px 14px",fontSize:12,width:"100%",justifyContent:"center"}}><Icon name="play" size={13}/> Iniciar</button>}
                </>
              ):<div style={{color:"#334155",fontSize:12}}>+ Asignar</div>}
            </div>
          );
        })}
      </div>
      {editing!==null&&(
        <div style={{position:"fixed",inset:0,background:"#000a",zIndex:200,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:"#1e1e2e",borderRadius:"20px 20px 0 0",padding:20,width:"100%",boxSizing:"border-box",maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <span style={{fontWeight:700,fontSize:16}}>{days[editing]?.label}</span>
              <button onClick={()=>setEditing(null)} style={{background:"#2d2d3d",border:"none",borderRadius:8,padding:6,cursor:"pointer"}}><Icon name="close" size={16} color="#94a3b8"/></button>
            </div>
            <label style={S.lbl}>Grupo muscular (max. 3)</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
              {MG_LIST.map(mg=>{
                const active=selMgs.includes(mg), disabled=!active&&selMgs.length>=3;
                return <button key={mg} onClick={()=>!disabled&&toggleMg(mg)} style={{background:active?MG_COLORS[mg]:"#12121a",color:active?"#fff":disabled?"#334155":MG_COLORS[mg],border:`1px solid ${disabled?"#2d2d3d":MG_COLORS[mg]}`,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1}}>{mg}</button>;
              })}
            </div>
            {selMgs.length>0&&<div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>{selMgs.map(mg=><span key={mg} style={S.tag(MG_COLORS[mg]||"#475569")}>{mg}</span>)}<span style={{fontSize:11,color:"#475569"}}>{3-selMgs.length} restantes</span></div>}
            <label style={S.lbl}>Rutina (opcional)</label>
            <select value={selRoutine} onChange={e=>setSelRoutine(e.target.value)} style={{...S.inp,marginBottom:16}}>
              <option value="">Sin rutina especifica</option>
              {routines.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{const n=[...plan];if(n[editing])n[editing]={};setPlan(n);setEditing(null);}} style={{...B("#2d2d3d","#94a3b8"),flex:1,justifyContent:"center"}}>Limpiar</button>
              <button onClick={doSave} style={{...B(),flex:2,justifyContent:"center"}}><Icon name="check" size={16}/> Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ROUTINES ──────────────────────────────────────────────────────────────────
function RoutinesScreen({routines,setRoutines,onStartWorkout}) {
  const [editing,setEditing] = useState(null);
  const [showForm,setShowForm] = useState(false);
  const emptyEx = () => ({id:uid(),name:"",sets:3,repsMin:8,repsMax:12,rest:90,weight:0});
  const openNew = () => { setEditing({id:uid(),name:"",exercises:[]}); setShowForm(true); };
  const openEdit = r => { setEditing(JSON.parse(JSON.stringify(r))); setShowForm(true); };
  const saveRoutine = () => {
    if(!editing.name.trim()) return;
    setRoutines(prev=>{const idx=prev.findIndex(r=>r.id===editing.id);if(idx>=0){const n=[...prev];n[idx]=editing;return n;}return[...prev,editing];});
    setShowForm(false);
  };
  const addEx = () => setEditing(e=>({...e,exercises:[...e.exercises,emptyEx()]}));
  const updEx = (eid,field,val) => setEditing(e=>({...e,exercises:e.exercises.map(ex=>ex.id===eid?{...ex,[field]:val}:ex)}));
  const moveEx = (idx,dir) => {
    const n=[...editing.exercises],t=idx+dir;
    if(t<0||t>=n.length) return;
    [n[idx],n[t]]=[n[t],n[idx]];
    setEditing(e=>({...e,exercises:n}));
  };

  if(showForm&&editing) return (
    <div style={{padding:"0 16px 140px"}}>
      <div style={{padding:"20px 0 16px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setShowForm(false)} style={{background:"#1e1e2e",border:"none",borderRadius:10,padding:8,cursor:"pointer"}}><Icon name="back" size={20} color="#94a3b8"/></button>
        <span style={S.h1}>{routines.find(r=>r.id===editing.id)?"Editar":"Nueva"} Rutina</span>
      </div>
      <div style={S.card}>
        <label style={S.lbl}>Nombre de la rutina</label>
        <input style={S.inp} value={editing.name} placeholder="Ej: Push Day A" onChange={e=>setEditing(r=>({...r,name:e.target.value}))}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={S.h2}>Ejercicios ({editing.exercises.length})</span>
      </div>
      {editing.exercises.length===0&&<div style={{...S.card,textAlign:"center",color:"#475569",padding:40}}><Icon name="dumbbell" size={36} color="#334155"/><p style={{margin:"10px 0 0"}}>Toca el + para anadir un ejercicio</p></div>}
      {editing.exercises.map((ex,idx)=>(
        <div key={ex.id} style={{...S.card,border:"1px solid #2d2d3d"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontWeight:700,fontSize:13,color:"#7C3AED"}}>Ejercicio {idx+1}</span>
            <div style={{display:"flex",gap:4}}>
              <button onClick={()=>moveEx(idx,-1)} disabled={idx===0} style={{background:"#2d2d3d",border:"none",borderRadius:7,padding:5,cursor:idx===0?"not-allowed":"pointer",opacity:idx===0?0.3:1}}><Icon name="up" size={13} color="#94a3b8"/></button>
              <button onClick={()=>moveEx(idx,1)} disabled={idx===editing.exercises.length-1} style={{background:"#2d2d3d",border:"none",borderRadius:7,padding:5,cursor:idx===editing.exercises.length-1?"not-allowed":"pointer",opacity:idx===editing.exercises.length-1?0.3:1}}><Icon name="down" size={13} color="#94a3b8"/></button>
              <button onClick={()=>setEditing(e=>({...e,exercises:e.exercises.filter(x=>x.id!==ex.id)}))} style={{background:"#ef444422",border:"none",borderRadius:7,padding:5,cursor:"pointer"}}><Icon name="trash" size={13} color="#ef4444"/></button>
            </div>
          </div>
          <label style={S.lbl}>Nombre</label>
          <input style={{...S.inp,marginBottom:10}} value={ex.name} placeholder="Ej: Press Banca" onChange={e=>updEx(ex.id,"name",e.target.value)}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div><label style={S.lbl}>Series</label><NumInput style={S.inp} value={ex.sets} min={1} max={20} onChange={v=>updEx(ex.id,"sets",Math.round(v))}/></div>
            <div><label style={S.lbl}>Descanso (seg)</label><NumInput style={S.inp} value={ex.rest} min={0} onChange={v=>updEx(ex.id,"rest",Math.round(v))}/></div>
            <div><label style={S.lbl}>Reps min</label><NumInput style={S.inp} value={ex.repsMin} min={1} onChange={v=>updEx(ex.id,"repsMin",Math.round(v))}/></div>
            <div><label style={S.lbl}>Reps max</label><NumInput style={S.inp} value={ex.repsMax} min={1} onChange={v=>updEx(ex.id,"repsMax",Math.round(v))}/></div>
          </div>
          <label style={S.lbl}>Peso base (lb)</label>
          <NumInput style={S.inp} value={ex.weight||0} min={0} onChange={v=>updEx(ex.id,"weight",v)} placeholder="0"/>
        </div>
      ))}
      {editing.exercises.length>0&&<div style={{...S.csm,background:"#0f0f14",display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{color:"#64748b",fontSize:13}}>Tiempo estimado</span><span style={{fontFamily:"monospace",color:"#a3e635",fontWeight:700}}>{fmtTime(calcEst(editing.exercises))}</span></div>}
      <button onClick={saveRoutine} style={{...B(),width:"100%",justifyContent:"center",padding:14,fontSize:15,marginBottom:8}}><Icon name="check" size={18}/> Guardar Rutina</button>
      <button onClick={addEx} style={{position:"fixed",bottom:24,right:20,width:56,height:56,borderRadius:"50%",background:"#7C3AED",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 24px #7C3AED77",zIndex:50}}>
        <Icon name="plus" size={28} color="#fff"/>
      </button>
    </div>
  );

  return (
    <div style={{padding:"0 16px 100px"}}>
      <div style={{padding:"20px 0 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Icon name="dumbbell" size={24} color="#7C3AED"/><span style={S.h1}>Rutinas</span></div>
        <button onClick={openNew} style={{...B(),padding:"10px 16px",fontSize:13}}><Icon name="plus" size={15}/> Nueva</button>
      </div>
      {routines.length===0&&<div style={{...S.card,textAlign:"center",padding:40,color:"#475569"}}><Icon name="dumbbell" size={40} color="#2d2d3d"/><p style={{margin:"12px 0 4px",fontWeight:600,color:"#64748b"}}>Sin rutinas aun</p></div>}
      {routines.map(r=>(
        <div key={r.id} style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div><div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{r.name}</div><div style={{color:"#64748b",fontSize:13}}>{r.exercises.length} ejercicios</div></div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>openEdit(r)} style={{background:"#2d2d3d",border:"none",borderRadius:8,padding:8,cursor:"pointer"}}><Icon name="edit" size={15} color="#94a3b8"/></button>
              <button onClick={()=>setRoutines(p=>p.filter(x=>x.id!==r.id))} style={{background:"#ef444415",border:"none",borderRadius:8,padding:8,cursor:"pointer"}}><Icon name="trash" size={15} color="#ef4444"/></button>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            {r.exercises.slice(0,4).map(ex=><span key={ex.id} style={{background:"#12121a",borderRadius:8,padding:"3px 8px",fontSize:11,color:"#94a3b8"}}>{ex.name||"Sin nombre"}</span>)}
            {r.exercises.length>4&&<span style={{fontSize:11,color:"#475569"}}>+{r.exercises.length-4} mas</span>}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"monospace",fontSize:13,color:"#a3e635"}}>~{fmtTime(calcEst(r.exercises))}</span>
            <button onClick={()=>onStartWorkout(r.id)} style={{...B(),padding:"9px 16px",fontSize:13}}><Icon name="play" size={13}/> Iniciar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── WORKOUT ───────────────────────────────────────────────────────────────────
function WorkoutScreen({routine,history,onFinish,onCancel}) {
  const [exIdx,setExIdx] = useState(0);
  const [setIdx,setSetIdx] = useState(0);
  const [logged,setLogged] = useState(routine.exercises.map(ex=>Array.from({length:ex.sets},()=>({weight:"",reps:"",done:false}))));
  const [resting,setResting] = useState(false);
  const [restSecs,setRestSecs] = useState(0);
  const [elapsed,setElapsed] = useState(0);
  const [t0] = useState(Date.now());
  const tmr = useRef();
  useEffect(()=>{tmr.current=setInterval(()=>setElapsed(Math.floor((Date.now()-t0)/1000)),1000);return()=>clearInterval(tmr.current);},[]);

  const ex = routine.exercises[exIdx];
  const cur = logged[exIdx]?.[setIdx];
  const lastS = history.slice().reverse().find(h=>h.routineId===routine.id&&h.exercises?.some(e=>e.name===ex?.name));
  const lastEx = lastS?.exercises?.find(e=>e.name===ex?.name);
  const lastW = lastEx?.sets?.find(s=>s.done)?.weight;
  const lastR = lastEx?.sets?.find(s=>s.done)?.reps;
  const lastV = lastEx?calcVol(lastEx.sets.filter(s=>s.done)):null;
  const totalVol = logged.reduce((t,sets)=>t+calcVol(sets),0);
  const totalSets = routine.exercises.reduce((t,e)=>t+e.sets,0);
  const doneSets = logged.reduce((t,sets)=>t+sets.filter(s=>s.done).length,0);
  const prog = (doneSets/totalSets)*100;

  const updCur = (field,val) => setLogged(prev=>{const n=prev.map(s=>[...s]);n[exIdx][setIdx]={...n[exIdx][setIdx],[field]:val};return n;});
  const completeSet = () => {
    setLogged(prev=>{const n=prev.map(s=>[...s]);n[exIdx][setIdx]={...n[exIdx][setIdx],done:true};return n;});
    if(setIdx+1<ex.sets){setResting(true);setRestSecs(parseInt(ex.rest)||90);}
    else if(exIdx+1<routine.exercises.length){setExIdx(e=>e+1);setSetIdx(0);}
  };
  const finish = () => onFinish({id:uid(),date:new Date().toISOString(),routineId:routine.id,routineName:routine.name,duration:elapsed,totalVolume:totalVol,exercises:routine.exercises.map((ex,i)=>({name:ex.name,sets:logged[i]}))});

  return (
    <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
      <div style={{padding:"16px 0 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:11,color:"#64748b",fontWeight:600,letterSpacing:"0.06em"}}>ENTRENANDO</div><div style={{fontWeight:800,fontSize:17}}>{routine.name}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontFamily:"monospace",fontSize:20,fontWeight:700,color:"#a3e635"}}>{fmtTime(elapsed)}</div><div style={{fontSize:11,color:"#64748b"}}>{doneSets}/{totalSets} series</div></div>
      </div>
      <div style={{height:4,background:"#1e1e2e",borderRadius:4,marginBottom:16,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${prog}%`,background:"linear-gradient(90deg,#7C3AED,#a3e635)",borderRadius:4,transition:"width .3s"}}/>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {routine.exercises.map((e,i)=>{const done=logged[i].every(s=>s.done),active=i===exIdx;return(<button key={e.id} onClick={()=>{setExIdx(i);const fi=logged[i].findIndex(s=>!s.done);setSetIdx(fi<0?0:fi);}} style={{flexShrink:0,padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,background:done?"#a3e63522":active?"#7C3AED":"#1e1e2e",color:done?"#a3e635":active?"#fff":"#64748b",border:`1px solid ${done?"#a3e63544":active?"#7C3AED":"#2d2d3d"}`,cursor:"pointer"}}>{done?"+ ":""}{e.name||`Ej ${i+1}`}</button>);})}
      </div>
      {resting?(
        <div style={S.card}><div style={{textAlign:"center",marginBottom:8,fontWeight:700,color:"#7C3AED"}}>Descansa</div><RestTimer seconds={restSecs} onDone={()=>{setResting(false);setSetIdx(s=>s+1);}}/></div>
      ):(
        <>
          <div style={{...S.card,background:"linear-gradient(135deg,#1e1e2e,#16162a)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div><div style={{fontWeight:800,fontSize:20,marginBottom:4}}>{ex.name||"Ejercicio"}</div><div style={{color:"#64748b",fontSize:13}}>{ex.repsMin}-{ex.repsMax} reps, {ex.rest}s descanso</div></div>
              <span style={S.badge()}>Serie {setIdx+1}/{ex.sets}</span>
            </div>
            {lastW&&<div style={{background:"#a3e63510",border:"1px solid #a3e63330",borderRadius:10,padding:"8px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}><Icon name="history" size={14} color="#a3e635"/><span style={{fontSize:12,color:"#a3e635"}}>Ultima vez: <strong>{lastW}lb x {lastR} reps</strong>{lastV?` (vol: ${lastV.toFixed(0)})`:""}</span></div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div><label style={S.lbl}>Peso (lb)</label><input style={{...S.inp,fontFamily:"monospace",fontSize:22,fontWeight:700,textAlign:"center",padding:"14px 12px"}} type="number" step="2.5" min="0" value={cur?.weight} placeholder={lastW||ex.weight||"0"} onChange={e=>updCur("weight",e.target.value)}/></div>
              <div><label style={S.lbl}>Reps</label><input style={{...S.inp,fontFamily:"monospace",fontSize:22,fontWeight:700,textAlign:"center",padding:"14px 12px"}} type="number" min="0" value={cur?.reps} placeholder={String(ex.repsMax||10)} onChange={e=>updCur("reps",e.target.value)}/></div>
            </div>
            <button onClick={completeSet} style={{...B("#a3e635","#0F0F14"),width:"100%",justifyContent:"center",padding:14,fontSize:15,fontWeight:800}}><Icon name="check" size={18} color="#0F0F14"/> Completar Serie</button>
          </div>
          <div style={S.card}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:8}}>Series completadas</div>
            {logged[exIdx].map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<ex.sets-1?"1px solid #2d2d3d":"none"}}>
                <span style={{color:s.done?"#a3e635":"#334155",fontSize:13,fontWeight:600}}>{s.done?"v":"o"} Serie {i+1}</span>
                {s.done?<span style={{fontFamily:"monospace",fontSize:13}}>{s.weight||"-"}lb x {s.reps||"-"}</span>:<span style={{fontSize:12,color:"#334155"}}>Pendiente</span>}
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <button onClick={onCancel} style={{...B("#1e1e2e","#64748b"),flex:1,justifyContent:"center"}}>Cancelar</button>
        <button onClick={finish} style={{...B(doneSets===totalSets?"#a3e635":"#7C3AED",doneSets===totalSets?"#0F0F14":"#fff"),flex:2,justifyContent:"center"}}><Icon name="trophy" size={16} color={doneSets===totalSets?"#0F0F14":"#fff"}/>{doneSets===totalSets?"Finalizar!":"Terminar ahora"}</button>
      </div>
    </div>
  );
}

// ── HISTORY ───────────────────────────────────────────────────────────────────
function HistoryScreen({history}) {
  const [detail,setDetail] = useState(null);
  if(detail) return (
    <div style={{padding:"0 16px 100px"}}>
      <div style={{padding:"20px 0 16px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setDetail(null)} style={{background:"#1e1e2e",border:"none",borderRadius:10,padding:8,cursor:"pointer"}}><Icon name="back" size={20} color="#94a3b8"/></button>
        <div><div style={S.h1}>{detail.routineName}</div><div style={{fontSize:12,color:"#64748b"}}>{fmtDateFull(detail.date)}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
        {[["Duracion",fmtTime(detail.duration),"timer"],["Volumen",`${(detail.totalVolume||0).toFixed(0)}`,"fire"],["Ejercicios",detail.exercises?.length||0,"dumbbell"]].map(([l,v,ic])=>(
          <div key={l} style={{...S.card,textAlign:"center",padding:12}}><Icon name={ic} size={18} color="#7C3AED"/><div style={{fontFamily:"monospace",fontWeight:700,fontSize:18,margin:"4px 0"}}>{v}</div><div style={{fontSize:10,color:"#64748b"}}>{l}</div></div>
        ))}
      </div>
      {detail.exercises?.map((ex,i)=>(
        <div key={i} style={S.card}>
          <div style={{fontWeight:700,marginBottom:8}}>{ex.name}</div>
          {ex.sets?.filter(s=>s.done).map((set,j)=>(
            <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #12121a"}}>
              <span style={{fontSize:12,color:"#64748b"}}>Serie {j+1}</span>
              <span style={{fontFamily:"monospace",fontSize:13}}>{set.weight||"-"}lb x {set.reps||"-"} = {((parseFloat(set.weight)||0)*(parseInt(set.reps)||0)).toFixed(0)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  return (
    <div style={{padding:"0 16px 100px"}}>
      <div style={{padding:"20px 0 16px",display:"flex",alignItems:"center",gap:10}}><Icon name="history" size={24} color="#7C3AED"/><span style={S.h1}>Historial</span></div>
      {history.length===0&&<div style={{...S.card,textAlign:"center",padding:40,color:"#475569"}}><Icon name="history" size={40} color="#2d2d3d"/><p style={{margin:"12px 0 4px",fontWeight:600,color:"#64748b"}}>Sin sesiones aun</p></div>}
      {[...history].reverse().map(s=>(
        <div key={s.id} onClick={()=>setDetail(s)} style={{...S.card,cursor:"pointer",borderLeft:"3px solid #7C3AED33"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}><div style={{fontWeight:700,fontSize:15}}>{s.routineName}</div><div style={{fontFamily:"monospace",fontSize:12,color:"#a3e635"}}>{fmtTime(s.duration)}</div></div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>{fmtDateFull(s.date)}</div>
          <div style={{display:"flex",gap:12}}><span style={{fontSize:12,color:"#94a3b8"}}>{s.exercises?.length||0} ejercicios</span><span style={{fontSize:12,color:"#94a3b8"}}>Vol: {(s.totalVolume||0).toFixed(0)}</span></div>
        </div>
      ))}
    </div>
  );
}

// ── PROGRESS ──────────────────────────────────────────────────────────────────
function ProgressScreen({history}) {
  const [selEx,setSelEx] = useState("");
  const allEx = [...new Set(history.flatMap(s=>(s.exercises||[]).map(e=>e.name)))].filter(Boolean).sort();

  const series = selEx ? history
    .filter(s=>(s.exercises||[]).some(e=>e.name===selEx))
    .map(s=>{
      const ex=(s.exercises||[]).find(e=>e.name===selEx);
      const done=(ex?.sets||[]).filter(st=>st.done);
      const maxW=done.length?Math.max(...done.map(st=>parseFloat(st.weight)||0)):0;
      const maxR=done.length?Math.max(...done.map(st=>parseInt(st.reps)||0)):0;
      const bestV=done.length?Math.max(...done.map(st=>(parseFloat(st.weight)||0)*(parseInt(st.reps)||0))):0;
      return {date:s.date,maxW,maxR,bestV,cnt:done.length};
    }).filter(d=>d.cnt>0) : [];

  const insights = (()=>{
    if(!selEx||series.length<2) return [];
    const msgs=[], first=series[0], last=series[series.length-1];
    const bestW=Math.max(...series.map(d=>d.maxW));
    const wDiff=last.maxW-first.maxW, rDiff=last.maxR-first.maxR;
    if(wDiff>0) msgs.push({icon:"up",text:`Has aumentado ${wDiff.toFixed(1)} lb en ${selEx} desde que empezaste.`,color:"#a3e635"});
    else if(wDiff<0) msgs.push({icon:"down",text:`El peso en ${selEx} bajo ${Math.abs(wDiff).toFixed(1)} lb desde tu primera sesion.`,color:"#f97316"});
    else msgs.push({icon:"ok",text:`Mantienes el mismo peso maximo en ${selEx}.`,color:"#64748b"});
    if(rDiff>0){const pct=first.maxR>0?Math.round((rDiff/first.maxR)*100):0;msgs.push({icon:"rep",text:`Tus repeticiones en ${selEx} aumentaron un ${pct}% (${first.maxR} a ${last.maxR} reps).`,color:"#7C3AED"});}
    else if(rDiff<0) msgs.push({icon:"warn",text:`Tus repeticiones en ${selEx} bajaron de ${first.maxR} a ${last.maxR}.`,color:"#f97316"});
    msgs.push({icon:"pr",text:`Tu mejor marca en ${selEx} es ${bestW.toFixed(1)} lb.`,color:"#eab308"});
    const rec=series.slice(-3);
    if(rec.length>=2){const up=rec[rec.length-1].bestV>=rec[0].bestV;msgs.push({icon:up?"fire":"warn",text:up?`Tu rendimiento reciente en ${selEx} va en tendencia positiva.`:`Tu rendimiento reciente en ${selEx} muestra senales de estancamiento.`,color:up?"#a3e635":"#f97316"});}
    return msgs;
  })();

  const iconMap = {up:"📈",down:"📉",ok:"➡️",rep:"💪",warn:"⚠️",pr:"🏆",fire:"🔥"};
  const totSess = history.length;
  const totSets = history.reduce((t,s)=>t+(s.exercises||[]).reduce((tt,e)=>tt+(e.sets||[]).filter(st=>st.done).length,0),0);

  return (
    <div style={{padding:"0 16px 100px"}}>
      <div style={{padding:"20px 0 16px",display:"flex",alignItems:"center",gap:10}}><Icon name="trend" size={24} color="#7C3AED"/><span style={S.h1}>Progreso</span></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {[["Sesiones",totSess,"#7C3AED"],["Series totales",totSets,"#a3e635"]].map(([l,v,c])=>(
          <div key={l} style={{...S.card,textAlign:"center",padding:14}}><div style={{fontFamily:"monospace",fontWeight:900,fontSize:32,color:c}}>{v}</div><div style={{fontSize:11,color:"#64748b"}}>{l}</div></div>
        ))}
      </div>
      <div style={{...S.card,border:"1px solid #2d2d3d",marginBottom:12}}>
        <label style={S.lbl}>Ejercicio</label>
        <select value={selEx} onChange={e=>setSelEx(e.target.value)} style={S.inp}>
          <option value="">-- Elige un ejercicio --</option>
          {allEx.map(e=><option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      {selEx&&series.length===0&&<div style={{...S.card,textAlign:"center",padding:32,color:"#475569"}}>Sin datos para este ejercicio aun</div>}
      {selEx&&series.length>0&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            {[["Mejor peso",`${Math.max(...series.map(d=>d.maxW)).toFixed(1)} lb`,"#eab308"],["Mejor vol.",Math.max(...series.map(d=>d.bestV)).toFixed(0),"#7C3AED"],["Sesiones",series.length,"#a3e635"]].map(([l,v,c])=>(
              <div key={l} style={{...S.card,padding:10,textAlign:"center"}}><div style={{fontFamily:"monospace",fontWeight:800,fontSize:18,color:c}}>{v}</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>{l}</div></div>
            ))}
          </div>
          <div style={S.card}><div style={{fontWeight:700,fontSize:14,marginBottom:2}}>Rendimiento (lb x reps)</div><div style={{fontSize:11,color:"#64748b",marginBottom:10}}>Mejor serie por sesion</div><LineChart data={series.map(d=>({date:d.date,value:d.bestV}))} color="#7C3AED"/></div>
          <div style={S.card}><div style={{fontWeight:700,fontSize:14,marginBottom:2}}>Evolucion del peso</div><div style={{fontSize:11,color:"#64748b",marginBottom:10}}>Peso maximo por sesion (lb)</div><LineChart data={series.map(d=>({date:d.date,value:d.maxW}))} color="#a3e635"/></div>
          <div style={S.card}><div style={{fontWeight:700,fontSize:14,marginBottom:2}}>Evolucion de repeticiones</div><div style={{fontSize:11,color:"#64748b",marginBottom:10}}>Reps maximas por sesion</div><LineChart data={series.map(d=>({date:d.date,value:d.maxR}))} color="#f97316"/></div>
          {insights.length>0&&(
            <div style={S.card}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Analisis automatico</div>
              {insights.map((ins,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:i<insights.length-1?"1px solid #12121a":"none",alignItems:"flex-start"}}>
                  <span style={{fontSize:18,flexShrink:0}}>{iconMap[ins.icon]||"•"}</span>
                  <span style={{fontSize:13,color:ins.color,lineHeight:1.5}}>{ins.text}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {history.length===0&&<div style={{...S.card,textAlign:"center",padding:40,color:"#475569"}}><Icon name="trend" size={40} color="#2d2d3d"/><p style={{margin:"12px 0 4px",fontWeight:600,color:"#64748b"}}>Completa entrenamientos para ver tu progreso</p></div>}
    </div>
  );
}

// ── NUTRITION ─────────────────────────────────────────────────────────────────
function NutritionScreen({nutrition,setNutrition}) {
  const [sub,setSub] = useState("macros");
  const [weight,setWeight] = useState(nutrition.weight||"");
  const [addingTo,setAddingTo] = useState(null);
  const [newRow,setNewRow] = useState({});

  const pGoal = weight?(parseFloat(weight)*2.2).toFixed(1):null;
  const cGoal = weight?(parseFloat(weight)*5).toFixed(1):null;

  const updW = v => { setWeight(v); setNutrition(n=>({...n,weight:v})); };
  const updCell = (table,id,field,val) => setNutrition(n=>({...n,[table]:n[table].map(row=>row.id===id?{...row,[field]:val}:row)}));
  const delRow = (table,id) => setNutrition(n=>({...n,[table]:n[table].filter(r=>r.id!==id)}));
  const addRow = () => { setNutrition(n=>({...n,[addingTo]:[...n[addingTo],{...newRow,id:uid()}]})); setAddingTo(null); };

  const thS = {padding:"10px 12px",fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:700,textAlign:"left",whiteSpace:"nowrap",background:"#12121a"};
  const tdS = {padding:"9px 12px",borderTop:"1px solid #12121a",fontSize:12,verticalAlign:"middle"};

  const Table = ({table,mainField,mainLabel,mainColor}) => (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div><div style={{fontWeight:700,fontSize:15}}>Referencias de {table==="carbs"?"Carbohidratos":"Proteinas"}</div><div style={{fontSize:11,color:"#64748b"}}>Toca cualquier valor para editar</div></div>
        <button onClick={()=>{setAddingTo(table);setNewRow(table==="carbs"?{food:"",portion:"",carbs:"",fat:""}:{food:"",portion:"",protein:"",fat:""}); }} style={{...B("#7C3AED33","#7C3AED"),padding:"8px 12px",fontSize:12}}><Icon name="plus" size={13}/> Anadir</button>
      </div>
      <div style={{...S.card,overflowX:"auto",padding:0}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:340}}>
          <thead><tr><th style={thS}>Alimento</th><th style={thS}>Porcion</th><th style={{...thS,color:mainColor}}>{mainLabel}</th><th style={{...thS,color:"#f97316"}}>% Grasa</th><th style={thS}></th></tr></thead>
          <tbody>
            {nutrition[table].map(row=>(
              <tr key={row.id}>
                <td style={tdS}><EditCell value={row.food} onSave={v=>updCell(table,row.id,"food",v)} width="90px"/></td>
                <td style={tdS}><EditCell value={row.portion} onSave={v=>updCell(table,row.id,"portion",v)} width="80px"/></td>
                <td style={{...tdS,textAlign:"center"}}><EditCell value={row[mainField]} type="number" onSave={v=>updCell(table,row.id,mainField,v)} width="36px"/></td>
                <td style={{...tdS,textAlign:"center"}}><EditCell value={row.fat} type="number" onSave={v=>updCell(table,row.id,"fat",v)} width="36px"/></td>
                <td style={{...tdS,textAlign:"center"}}><button onClick={()=>delRow(table,row.id)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Icon name="trash" size={13} color="#ef4444"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <div style={{padding:"0 16px 100px"}}>
      <div style={{padding:"20px 0 12px",display:"flex",alignItems:"center",gap:10}}><Icon name="food" size={24} color="#7C3AED"/><span style={S.h1}>Nutricion</span></div>
      <div style={{display:"flex",gap:6,marginBottom:16,background:"#12121a",borderRadius:12,padding:4}}>
        {[["macros","Macros"],["carbs","Carbohidratos"],["proteins","Proteinas"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSub(k)} style={{flex:1,padding:"8px 4px",borderRadius:9,fontSize:11,fontWeight:700,cursor:"pointer",border:"none",background:sub===k?"#7C3AED":"transparent",color:sub===k?"#fff":"#64748b",fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>
      {sub==="macros"&&(
        <>
          <div style={{...S.card,border:"1px solid #2d2d3d"}}>
            <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Calculadora de Macros</div>
            <div style={{fontSize:12,color:"#64748b",marginBottom:14}}>Ingresa tu peso para ver tus requerimientos diarios</div>
            <label style={S.lbl}>Tu peso corporal (kg)</label>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <input type="number" min="30" max="250" step="0.5" value={weight} placeholder="Ej: 80" onChange={e=>updW(e.target.value)} style={{...S.inp,fontFamily:"monospace",fontSize:24,fontWeight:800,textAlign:"center",padding:"14px",maxWidth:140}}/>
              <span style={{fontSize:16,color:"#64748b"}}>kg</span>
            </div>
          </div>
          {weight&&parseFloat(weight)>0?(
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div style={{...S.card,background:"linear-gradient(135deg,#7C3AED22,#7C3AED08)",border:"1px solid #7C3AED33",textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#7C3AED",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>PROTEINA / DIA</div>
                  <div style={{fontFamily:"monospace",fontWeight:900,fontSize:36,color:"#7C3AED",lineHeight:1}}>{pGoal}</div>
                  <div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>gramos</div>
                  <div style={{fontSize:11,color:"#475569",marginTop:6}}>{parseFloat(weight)} x 2.2</div>
                </div>
                <div style={{...S.card,background:"linear-gradient(135deg,#a3e63522,#a3e63508)",border:"1px solid #a3e63533",textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#a3e635",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>CARBOHIDRATOS / DIA</div>
                  <div style={{fontFamily:"monospace",fontWeight:900,fontSize:36,color:"#a3e635",lineHeight:1}}>{cGoal}</div>
                  <div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>gramos</div>
                  <div style={{fontSize:11,color:"#475569",marginTop:6}}>{parseFloat(weight)} x 5</div>
                </div>
              </div>
              <div style={{...S.card,background:"#12121a"}}>
                <div style={{fontWeight:700,marginBottom:10}}>Distribucion diaria</div>
                {[["Proteina",pGoal,"#7C3AED"],["Carbohidratos",cGoal,"#a3e635"]].map(([label,val,color])=>(
                  <div key={label} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"#94a3b8"}}>{label}</span><span style={{fontFamily:"monospace",fontSize:12,color}}>{val}g</span></div>
                    <div style={{height:6,background:"#1e1e2e",borderRadius:4}}><div style={{height:"100%",width:`${Math.min(100,(parseFloat(val)/(parseFloat(cGoal)+parseFloat(pGoal)))*100)}%`,background:color,borderRadius:4}}/></div>
                  </div>
                ))}
              </div>
            </>
          ):<div style={{...S.card,textAlign:"center",padding:32,color:"#475569"}}><div style={{fontSize:36,marginBottom:8}}>X</div><div style={{fontWeight:600,color:"#64748b"}}>Ingresa tu peso para calcular tus macros</div></div>}
        </>
      )}
      {sub==="carbs"&&<Table table="carbs" mainField="carbs" mainLabel="Carbs (g)" mainColor="#a3e635"/>}
      {sub==="proteins"&&<Table table="proteins" mainField="protein" mainLabel="Proteina (g)" mainColor="#7C3AED"/>}
      {addingTo&&(
        <div style={{position:"fixed",inset:0,background:"#000b",zIndex:200,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:"#1e1e2e",borderRadius:"20px 20px 0 0",padding:20,width:"100%",boxSizing:"border-box"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <span style={{fontWeight:700,fontSize:16}}>Nuevo {addingTo==="carbs"?"Carbohidrato":"Proteina"}</span>
              <button onClick={()=>setAddingTo(null)} style={{background:"#2d2d3d",border:"none",borderRadius:8,padding:6,cursor:"pointer"}}><Icon name="close" size={16} color="#94a3b8"/></button>
            </div>
            {["food","portion",...(addingTo==="carbs"?["carbs"]:["protein"]),"fat"].map(field=>(
              <div key={field} style={{marginBottom:10}}>
                <label style={S.lbl}>{field==="food"?"Alimento":field==="portion"?"Porcion":field==="carbs"?"Carbohidratos (g)":field==="protein"?"Proteina (g)":"% Grasa"}</label>
                <input style={S.inp} type={["carbs","protein","fat"].includes(field)?"number":"text"} value={newRow[field]||""} onChange={e=>setNewRow(r=>({...r,[field]:e.target.value}))} placeholder={field==="food"?"Ej: Arroz integral":field==="portion"?"Ej: 1/2 taza":"0"}/>
              </div>
            ))}
            <button onClick={addRow} style={{...B(),width:"100%",justifyContent:"center",padding:13}}><Icon name="check" size={16}/> Agregar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,setTab] = useState("plan");
  const [routines,setRoutines] = useState(()=>load(SK.routines)||[]);
  const [plan,setPlan] = useState(()=>load(SK.plan)||Array(7).fill({}));
  const [planMode,setPlanMode] = useState(()=>load(SK.planMode)||"week");
  const [history,setHistory] = useState(()=>load(SK.history)||[]);
  const [nutrition,setNutrition] = useState(()=>load(SK.nutrition)||{weight:"",carbs:DC,proteins:DP});
  const [activeId,setActiveId] = useState(null);
  const [showFinish,setShowFinish] = useState(null);

  useEffect(()=>save(SK.routines,routines),[routines]);
  useEffect(()=>save(SK.plan,plan),[plan]);
  useEffect(()=>save(SK.planMode,planMode),[planMode]);
  useEffect(()=>save(SK.history,history),[history]);
  useEffect(()=>save(SK.nutrition,nutrition),[nutrition]);

  const startWorkout = rid => { setActiveId(rid); setTab("workout"); };
  const finishWorkout = session => { setHistory(h=>[...h,session]); setActiveId(null); setShowFinish(session); setTab("history"); };
  const cancelWorkout = () => { setActiveId(null); setTab("plan"); };
  const activeRoutine = routines.find(r=>r.id===activeId);

  if(tab==="workout"&&activeRoutine) return (
    <div style={S.app}><WorkoutScreen routine={activeRoutine} history={history} onFinish={finishWorkout} onCancel={cancelWorkout}/></div>
  );

  return (
    <div style={S.app}>
      {showFinish&&(
        <div style={{position:"fixed",inset:0,background:"#000c",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#1e1e2e",borderRadius:20,padding:28,maxWidth:340,width:"100%",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:8}}>&#127942;</div>
            <div style={{fontWeight:800,fontSize:22,marginBottom:4}}>Sesion completa!</div>
            <div style={{color:"#64748b",marginBottom:20}}>{showFinish.routineName}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              <div style={{background:"#12121a",borderRadius:12,padding:12}}><div style={{fontFamily:"monospace",fontWeight:800,fontSize:20,color:"#a3e635"}}>{fmtTime(showFinish.duration)}</div><div style={{fontSize:11,color:"#64748b"}}>Duracion</div></div>
              <div style={{background:"#12121a",borderRadius:12,padding:12}}><div style={{fontFamily:"monospace",fontWeight:800,fontSize:20,color:"#7C3AED"}}>{(showFinish.totalVolume||0).toFixed(0)}</div><div style={{fontSize:11,color:"#64748b"}}>Volumen</div></div>
            </div>
            <button onClick={()=>setShowFinish(null)} style={{...B(),width:"100%",justifyContent:"center",padding:14,fontSize:15}}>Ver historial</button>
          </div>
        </div>
      )}
      <div style={{flex:1,overflowY:"auto"}}>
        {tab==="plan"&&<PlanScreen routines={routines} plan={plan} setPlan={setPlan} planMode={planMode} setPlanMode={setPlanMode} onStartWorkout={startWorkout}/>}
        {tab==="routines"&&<RoutinesScreen routines={routines} setRoutines={setRoutines} onStartWorkout={startWorkout}/>}
        {tab==="history"&&<HistoryScreen history={history}/>}
        {tab==="progress"&&<ProgressScreen history={history}/>}
        {tab==="nutrition"&&<NutritionScreen nutrition={nutrition} setNutrition={setNutrition}/>}
      </div>
      <nav style={S.nav}>
        <NavBtn icon="calendar" label="Plan" active={tab==="plan"} onClick={()=>setTab("plan")}/>
        <NavBtn icon="dumbbell" label="Rutinas" active={tab==="routines"} onClick={()=>setTab("routines")}/>
        <NavBtn icon="history" label="Historial" active={tab==="history"} onClick={()=>setTab("history")}/>
        <NavBtn icon="trend" label="Progreso" active={tab==="progress"} onClick={()=>setTab("progress")}/>
        <NavBtn icon="food" label="Nutricion" active={tab==="nutrition"} onClick={()=>setTab("nutrition")}/>
      </nav>
    </div>
  );
}