import { useState, useEffect, useRef } from "react";

const B = {
  orange:"#FF8F1C", dark:"#101820", cream:"#FBFAF7",
  sky:"#00A7E1", blue:"#0474BA", navy:"#005194",
  gray:"#F2F2F2", peach:"#FCECDC", steel:"#EFF4F7",
};

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body,input,button,select,textarea{font-family:'Manrope',sans-serif;}
  @keyframes floatLine{0%{transform:translateY(0) scaleX(1);}50%{transform:translateY(-18px) scaleX(1.04);}100%{transform:translateY(0) scaleX(1);}}
  @keyframes floatLineSlow{0%{transform:translateY(0) scaleX(1);}50%{transform:translateY(12px) scaleX(0.97);}100%{transform:translateY(0) scaleX(1);}}
  @keyframes fadeUp{0%{opacity:0;transform:translateY(24px);}100%{opacity:1;transform:translateY(0);}}
`;

const LOGO_URL = "https://test.uniuni.com/wp-content/uploads/2026/03/uniunilogo.png";
// white version for dark backgrounds
const LOGO_URL_WHITE = "https://test.uniuni.com/wp-content/uploads/2026/03/uniunilogo.png";

const COUNTRIES = {
  Canada:{ provinces:{"British Columbia":["Burnaby","Vancouver","Richmond","Surrey"],"Ontario":["Toronto","Ottawa","Mississauga","Hamilton"],"Alberta":["Calgary","Edmonton","Red Deer"],"Quebec":["Montreal","Quebec City","Laval"],"Manitoba":["Winnipeg","Brandon"]}},
  USA:{ provinces:{"Florida":["Miami","Orlando","Tampa"],"New York":["New York City","Buffalo","Albany"],"California":["Los Angeles","San Francisco","San Diego"],"Georgia":["Atlanta","Savannah"],"Illinois":["Chicago","Aurora"],"Texas":["Dallas","Houston","Austin"],"Washington":["Seattle","Spokane"],"Arizona":["Phoenix","Tucson"],"Colorado":["Denver","Colorado Springs"]}},
};

const WAREHOUSE_PLANS = [
  {id:"small", label:"Small", sqft:"< 5,000 sq ft", emoji:"🏠", desc:"Local depot or last-mile hub.", signCount:"15–25", estCAD:"$800–$1,800",
    recommended:["go-slow","pedestrian-walkway","sorting-area-small","waste-disposal","cardboard-only","receiving","shipping","office-area","whse-caution","sanitizing-station","workstation","aisle-medium","charging-station","driver-pickup","empty-pallets"]},
  {id:"medium",label:"Medium",sqft:"5,000–20,000 sq ft",emoji:"🏢",desc:"Regional sort facility.",signCount:"30–50",estCAD:"$2,000–$4,500",
    recommended:["go-slow","pedestrian-walkway","forklift-parking","sorting-area-small","sorting-area-large","pre-sorting-small","pre-sorting-large","waste-disposal","cardboard-only","cardboard-compactor","receiving","shipping","dock-sign-interior","office-area","whse-caution","sanitizing-station","workstation","aisle-medium","aisle-small","charging-station","driver-pickup","empty-pallets","mhe-parking","minivan-parking","whse-supply-large","video-surveillance","no-photography"]},
  {id:"large", label:"Large", sqft:"20,000–50,000 sq ft",emoji:"🏭",desc:"Major distribution center.",signCount:"55–90",estCAD:"$5,000–$10,000",
    recommended:["go-slow","pedestrian-walkway","forklift-parking","propane-tank","sorting-area-small","sorting-area-large","pre-sorting-small","pre-sorting-large","big-boxes-pickup","big-boxes-storage","waste-disposal","cardboard-only","cardboard-compactor","receiving","shipping","shipping-receiving","dock-sign-interior","dock-sign-exterior","dock-sign-aluminum","office-area","whse-caution","sanitizing-station","workstation","aisle-medium","aisle-small","charging-station","driver-pickup","empty-pallets","mhe-parking","minivan-parking","whse-supply-large","video-surveillance","no-photography","gaylord-assembly","canada-post","sorting-counter","whiteboard-ops","whiteboard-safety"]},
  {id:"mega",  label:"Mega",  sqft:"> 50,000 sq ft",   emoji:"🌆",desc:"Fulfillment mega-hub.",  signCount:"100+",estCAD:"$12,000–$25,000+",recommended:null},
];

const CAT_PREVIEWS = {
  "Distribution":["https://placehold.co/180x100/101820/FF8F1C?text=Sorting","https://placehold.co/180x100/1a1a2e/fff?text=Aisle","https://placehold.co/180x100/0d1b2a/FF8F1C?text=Station"],
  "Safety":["https://placehold.co/180x100/1a0a00/FF8F1C?text=Go+Slow","https://placehold.co/180x100/101820/fff?text=Forklift","https://placehold.co/180x100/0a1a0a/FF8F1C?text=Walkway"],
  "Dock":["https://placehold.co/180x100/101820/FF8F1C?text=Dock+Sign","https://placehold.co/180x100/1a1a2e/fff?text=Receiving","https://placehold.co/180x100/0d1b2a/FF8F1C?text=Shipping"],
  "Outdoor":["https://placehold.co/180x100/0a1a0a/FF8F1C?text=Building","https://placehold.co/180x100/101820/fff?text=Entrance","https://placehold.co/180x100/1a0a00/FF8F1C?text=Parking"],
  "Office Branding":["https://placehold.co/180x100/1a1a2e/FF8F1C?text=Vision","https://placehold.co/180x100/101820/fff?text=Mission","https://placehold.co/180x100/0d1b2a/FF8F1C?text=Together"],
};

const GO_SLOW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="#F9A825"/><circle cx="200" cy="106" r="76" fill="white" stroke="#CC0000" stroke-width="12"/><text x="200" y="76" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#101820">SPEED LIMIT</text><text x="200" y="128" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="56" fill="#101820">10</text><text x="200" y="151" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#101820">km/h</text><text x="200" y="222" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="40" fill="#101820">GO SLOW</text></svg>`;

const PEDESTRIAN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><defs><pattern id="hp" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#F9A825"/><line x1="0" y1="28" x2="28" y2="0" stroke="#101820" stroke-width="13"/></pattern></defs><rect width="400" height="260" fill="url(#hp)"/><rect x="24" y="24" width="352" height="212" fill="#F9A825"/><circle cx="200" cy="60" r="16" fill="#101820"/><line x1="200" y1="76" x2="200" y2="128" stroke="#101820" stroke-width="9" stroke-linecap="round"/><line x1="200" y1="97" x2="176" y2="114" stroke="#101820" stroke-width="8" stroke-linecap="round"/><line x1="200" y1="97" x2="224" y2="112" stroke="#101820" stroke-width="8" stroke-linecap="round"/><line x1="200" y1="128" x2="182" y2="160" stroke="#101820" stroke-width="9" stroke-linecap="round"/><line x1="200" y1="128" x2="218" y2="160" stroke="#101820" stroke-width="9" stroke-linecap="round"/><text x="200" y="190" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="26" fill="#101820">PEDESTRIAN</text><text x="200" y="216" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="26" fill="#101820">WALKWAY</text><text x="200" y="240" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="17" fill="#101820">KEEP CLEAR</text></svg>`;

const PROPANE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="white"/><rect x="3" y="3" width="394" height="254" fill="none" stroke="#101820" stroke-width="5"/><rect x="18" y="30" width="128" height="168" rx="6" fill="#e2e2e2" stroke="#bbb" stroke-width="1"/><rect x="52" y="45" width="54" height="84" rx="10" fill="#999" stroke="#555" stroke-width="2"/><ellipse cx="79" cy="45" rx="27" ry="9" fill="#bbb" stroke="#666" stroke-width="1"/><rect x="68" y="33" width="22" height="14" rx="4" fill="#666"/><path d="M112 116 Q120 97 117 83 Q128 98 124 114 Q132 102 130 91 Q139 106 134 120 Q139 112 137 101 Q146 116 139 129 Q133 140 119 140 Q102 140 104 123 Q100 114 112 116Z" fill="#FF6B00"/><rect x="32" y="170" width="100" height="22" rx="3" fill="#101820"/><text x="82" y="186" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="13" fill="white" font-weight="900">GAS</text><text x="274" y="104" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="30" font-weight="900" fill="#101820">PROPANE</text><text x="274" y="146" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="30" font-weight="900" fill="#101820">TANK</text><text x="274" y="188" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="30" font-weight="900" fill="#101820">STORAGE</text></svg>`;

const FORKLIFT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><defs><pattern id="hf" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#F9A825"/><line x1="0" y1="28" x2="28" y2="0" stroke="#101820" stroke-width="13"/></pattern></defs><rect width="400" height="260" fill="url(#hf)"/><rect x="24" y="24" width="352" height="212" fill="#F9A825"/><rect x="136" y="76" width="11" height="102" fill="#101820"/><rect x="147" y="56" width="13" height="60" fill="#101820"/><rect x="155" y="93" width="92" height="58" rx="3" fill="#101820"/><rect x="187" y="70" width="60" height="25" rx="3" fill="#101820"/><rect x="88" y="146" width="58" height="8" rx="2" fill="#101820"/><rect x="88" y="159" width="58" height="8" rx="2" fill="#101820"/><circle cx="162" cy="162" r="18" fill="#F9A825" stroke="#101820" stroke-width="6"/><circle cx="162" cy="162" r="6" fill="#101820"/><circle cx="233" cy="162" r="18" fill="#F9A825" stroke="#101820" stroke-width="6"/><circle cx="233" cy="162" r="6" fill="#101820"/><text x="200" y="202" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="26" fill="#101820">FORKLIFT</text><text x="200" y="228" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="26" fill="#101820">PARKING AREA</text></svg>`;

const mk=(id,cat,name,mat,size,hv,vt,vl,cad,usd,note,vec)=>({id,category:cat,name,material:mat,size,hasVariants:hv,variantType:vt,variantLabel:vl,priceCAD:cad,priceUSD:usd,installNote:note,
  vectorImg:vec?(vec.startsWith("http")?vec:`data:image/svg+xml,${encodeURIComponent(vec)}`):`https://placehold.co/400x260/101820/FF8F1C?text=${encodeURIComponent(name)}`,
  realImg:`https://placehold.co/400x260/1a2e1a/ffffff?text=Installed+Photo`});

const SIGN_CATALOG=[
  mk("aisle-small","Distribution","Aisle Number (Small)","Coroplast","20×20in",true,"range","Aisle number range",18,13,"Tape to rack face at eye level at aisle entrance."),
  mk("aisle-medium","Distribution","Aisle Number (Medium)","Coroplast","36×24in",true,"range","Aisle number range",32,24,"Mount high on rack or wall, visible from aisle end."),
  mk("pre-sorting-small","Distribution","Pre-Sorting Area","Coroplast","36×24in",true,"count","Number of areas",32,24,"Tape on wall at beginning of pre-sort line."),
  mk("sorting-area-small","Distribution","Sorting Area","Coroplast","36×24in",false,null,null,32,24,"Place at start of sorting line, carpet tape to wall."),
  mk("mhe-parking","Distribution","MHE Parking","Coroplast","36×24in",false,null,null,32,24,"Mount on wall or pillar near designated MHE zone."),
  mk("minivan-parking","Distribution","Mini Van Parking","Coroplast","36×24in",false,null,null,32,24,"Mount near designated parking area."),
  mk("sorting-counter","Distribution","Sorting Counter","Coroplast","11.7×8.3in",true,"count","Number of counters",14,10,"Tape to front face of sorting counter."),
  mk("pre-sorting-large","Distribution","Pre-Sorting (Large)","Coroplast","72×48in",false,null,null,85,63,"Install high on wall via scissor lift."),
  mk("big-boxes-pickup","Distribution","Big Boxes Pick-Up","Coroplast","72×48in",false,null,null,85,63,"Mount high, visible from main floor."),
  mk("cardboard-compactor","Distribution","Cardboard Compactor","Coroplast","72×48in",false,null,null,85,63,"Mount directly above or beside compactor unit."),
  mk("big-boxes-storage","Distribution","Big Boxes Storage","Coroplast","72×48in",false,null,null,85,63,"Mount above storage zone, scissor lift required."),
  mk("charging-station","Distribution","Charging Station","Coroplast","72×48in",false,null,null,85,63,"Mount above or beside charging rack."),
  mk("whse-supply-large","Distribution","WHSE Supply Storage (Large)","Coroplast","72×48in",false,null,null,85,63,"Mount high on wall above supply storage area."),
  mk("sorting-area-large","Distribution","Sorting Area (Numbered)","Coroplast","36×24in",true,"count","Number of sorting areas",32,24,"Tape on wall at each sorting area entrance."),
  mk("sanitizing-station","Distribution","Sanitizing Station","Coroplast","48×12in",true,"count","Number of stations",40,30,"Tape on rack in sanitizing area."),
  mk("driver-pickup","Distribution","Driver Pick-Up Area","Coroplast","36×24in",true,"letters","Pick-up zones (e.g. A, B, C)",32,24,"Mount high on wall above each pick-up zone."),
  mk("workstation","Distribution","Work Station","Coroplast","36×24in",true,"count","Number of workstations",32,24,"Mount on wall above or behind each workstation."),
  mk("waste-disposal","Distribution","Waste Disposal","Coroplast","36×24in",false,null,null,32,24,"Mount on wall above waste disposal area."),
  mk("empty-pallets","Distribution","Empty Pallets Storage","Coroplast","36×24in",false,null,null,32,24,"Mount on wall above pallet storage zone."),
  mk("cardboard-only","Distribution","Cardboard Only","Coroplast","36×24in",false,null,null,32,24,"Mount above designated cardboard-only bin or zone."),
  mk("go-slow","Safety","Go Slow / Speed Limit","Coroplast","12×18in",false,null,null,20,15,"Tape on stall or pillar in main forklift aisle.","https://images.weserv.nl/?url=i.ibb.co/zTmZCVk8/go-slow.jpg"),
  mk("pedestrian-walkway","Safety","Pedestrian Walkway","Coroplast","12×18in",false,null,null,20,15,"Place at each pedestrian walkway entrance.","https://images.weserv.nl/?url=i.ibb.co/vCmvK04X/pedestrian-walkway.jpg"),
  mk("propane-tank","Safety","Propane Tank Storage","Coroplast","36×24in",false,null,null,32,24,"Mount on wall above propane storage cage.","https://images.weserv.nl/?url=i.ibb.co/yFh18Jh1/propane-tank.jpg"),
  mk("forklift-parking","Safety","Forklift Parking Area","Coroplast","24×36in",false,null,null,38,28,"Tape on stall or pillar near forklift parking.","https://images.weserv.nl/?url=i.ibb.co/q36Th0Jj/forklift-parking-area.jpg"),
  mk("whiteboard-ops","Safety","Whiteboard – Ops Excellence","Vinyl","69×8.5in",false,null,null,65,48,"Apply directly on whiteboard surface in a straight line."),
  mk("whiteboard-safety","Safety","Whiteboard – 5S & Safety Board","Vinyl","69×8.5in",false,null,null,65,48,"Apply directly on whiteboard surface in a straight line."),
  mk("office-area","Safety","Office Area – Authorized Only","Sticker","16.5×11.7in",false,null,null,15,11,"Apply on office door or adjacent wall."),
  mk("whse-caution","Safety","Warehouse Caution","Sticker","16.5×11.7in",false,null,null,15,11,"Apply on door leading into warehouse from office."),
  mk("video-surveillance","Safety","Video Surveillance","Sticker","7.87×7.87in",false,null,null,8,6,"Apply near camera or at zone entrance."),
  mk("no-photography","Safety","No Photography / No Video","Sticker","7.87×7.87in",false,null,null,8,6,"Apply at restricted zone entry points."),
  mk("canada-post","Safety","Canada Post Storage","Coroplast","36×24in",false,null,null,32,24,"Mount on wall above Canada Post staging area."),
  mk("gaylord-assembly","Safety","Gaylord Assembly Area","Coroplast","36×24in",false,null,null,32,24,"Mount high on wall above gaylord assembly zone."),
  mk("dock-sign-interior","Dock","Dock Sign (Interior)","Coroplast","108×24in",true,"custom","Dock names (e.g. Dock 0, Dock 1)",95,70,"Tape on wall above dock door, scissor lift required."),
  mk("dock-sign-exterior","Dock","Dock Sign (Exterior, Aluminum)","Aluminum alloy","72×48in",true,"custom","Dock names/numbers",180,135,"Drill 4 holes, mount on exterior building wall."),
  mk("dock-sign-aluminum","Dock","Dock Sign (Aluminum 72x24)","Aluminum alloy","72×24in",true,"custom","Dock names/numbers",120,90,"Drill 6 holes, scissor lift required."),
  mk("dock-vinyl-number","Dock","Dock Number (Vinyl Cut-out)","Vinyl","TBD",true,"range","Dock number range",25,18,"Measure and centre vinyl number on dock door face."),
  mk("receiving","Dock","Receiving","Coroplast","72×18in",false,null,null,60,45,"Install above receiving dock, scissor lift required."),
  mk("shipping","Dock","Shipping","Coroplast","72×18in",false,null,null,60,45,"Install above shipping dock, scissor lift required."),
  mk("shipping-receiving","Dock","Shipping & Receiving (Aluminum)","Aluminum alloy","72×24in",false,null,null,130,97,"Drill 6 holes, mount on exterior wall."),
  mk("grade-dock","Dock","Grade Dock (Aluminum)","Aluminum alloy","72×24in",false,null,null,130,97,"Drill 6 holes, scissor lift required."),
  mk("outdoor-building","Outdoor","Building / Company Name Sign","Aluminum alloy","120×36in",false,null,null,450,335,"Mount on building facade, professional installer required."),
  mk("outdoor-entrance","Outdoor","Main Entrance Sign","Aluminum alloy","96×24in",false,null,null,280,210,"Mount above main entrance door on exterior wall."),
  mk("outdoor-visitor","Outdoor","Visitor Parking","Aluminum alloy","24×36in",true,"count","Number of signs",95,70,"Post-mount in parking lot or attach to exterior wall."),
  mk("outdoor-truck","Outdoor","Truck / Freight Entrance","Aluminum alloy","96×24in",false,null,null,280,210,"Mount above truck entrance gate or on building exterior."),
  mk("outdoor-no-entry","Outdoor","No Unauthorized Entry","Aluminum alloy","18×24in",true,"count","Number of signs",75,56,"Attach to fence, gate, or exterior wall."),
  mk("outdoor-cctv","Outdoor","CCTV / Security Warning","Aluminum alloy","12×18in",true,"count","Number of signs",55,41,"Mount near each outdoor camera."),
  mk("opening-hour","Office Branding","Opening Hours","Vinyl","12×18in",false,null,null,35,26,"Apply on front entrance door or glass panel."),
  mk("vision","Office Branding","Our Vision","Vinyl","136×31in",false,null,null,180,135,"Apply on feature wall in open space or meeting room."),
  mk("mission","Office Branding","Our Mission","Vinyl","100×34in",false,null,null,150,112,"Apply on open space feature wall, keep level."),
  mk("together-we-can","Office Branding","Together We Can","Vinyl","74×11.79in",false,null,null,90,67,"Apply on open space wall, centred and level."),
  mk("office-name","Office Branding","Office / Room Name","Vinyl","23.62×11.81in",true,"custom","Room names (e.g. Miami, Boardroom)",28,21,"Apply on glass panel or wall beside each room entrance."),
  mk("headline","Office Branding","We Deliver The Goods","Vinyl","140×27.81in",false,null,null,200,150,"Apply on main lobby or warehouse entrance wall."),
];

const CATEGORIES=["Distribution","Safety","Dock","Outdoor","Office Branding"];
const MATERIAL_BADGE={Coroplast:B.blue,"Aluminum alloy":"#6b7280",Vinyl:B.orange,Sticker:"#10b981","Vinyl Banner":B.navy};

function getQty(s,v){
  if(!s.hasVariants||!v)return 1;
  if(s.variantType==="range"&&v.start&&v.end)return Math.max(1,parseInt(v.end)-parseInt(v.start)+1);
  if(s.variantType==="count"&&v.count)return parseInt(v.count)||1;
  if(v.custom)return v.custom.split(",").filter(x=>x.trim()).length||1;
  return 1;
}
function getVS(s,v){
  if(!s.hasVariants||!v)return "";
  if(s.variantType==="range"&&v.start&&v.end)return `#${v.start}–${v.end}`;
  if(s.variantType==="count"&&v.count)return `x${v.count}`;
  if(v.custom)return v.custom;
  return "";
}

// ── HERO LINES ANIMATION (inspired by fluid line art) ─────────────────────────
function HeroLines(){
  const cvs = useRef();
  const mouse = useRef({x:0.5, y:0.5});
  const raf = useRef();
  const t = useRef(0);

  useEffect(()=>{
    const c = cvs.current;
    const ctx = c.getContext("2d");
    let W, H;

    const resize = ()=>{ W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; };

    const onMove = e => {
      const r = c.getBoundingClientRect();
      mouse.current = { x:(e.clientX-r.left)/W, y:(e.clientY-r.top)/H };
    };

    // Each "flow line" is a horizontal wave that reacts to mouse
    const LINES = Array.from({length:14}, (_,i)=>({
      yBase: (i/13)*1.0,
      speed: 0.0008 + i*0.00006,
      amp:   8 + i*1.4,
      freq:  0.35 + i*0.055,
      phase: i * 0.55,
      opacity: i < 3 ? 0.03 : i < 7 ? 0.05 : i < 11 ? 0.07 : 0.09,
      width:  i < 5 ? 0.5 : i < 10 ? 0.75 : 1.0,
    }));

    const draw = ()=>{
      t.current += 1;
      ctx.clearRect(0,0,W,H);
      const mx = mouse.current.x;
      const my = mouse.current.y;

      LINES.forEach(line=>{
        const yCenter = line.yBase * H;
        ctx.beginPath();
        ctx.moveTo(0, yCenter);

        for(let x=0; x<=W; x+=3){
          const xn = x/W;
          // base sine wave
          const wave = Math.sin(xn * Math.PI * 2 * line.freq + t.current * line.speed + line.phase) * line.amp;
          // mouse influence: pulls lines toward cursor based on proximity
          const dx = xn - mx;
          const dy = (yCenter/H) - my;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const pull = Math.max(0, 1 - dist/0.35) * 28;
          const pullY = (my - yCenter/H) * pull * H * 0.4;
          ctx.lineTo(x, yCenter + wave + pullY);
        }

        ctx.strokeStyle = `rgba(255,143,28,${line.opacity})`;
        ctx.lineWidth = line.width;
        ctx.stroke();
      });

      raf.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    c.addEventListener("mousemove", onMove);
    return ()=>{ cancelAnimationFrame(raf.current); window.removeEventListener("resize",resize); };
  },[]);

  return <canvas ref={cvs} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>;
}

// ── CATEGORY CARD ─────────────────────────────────────────────────────────────
function CatCard({cat}){
  const [hov,setHov]=useState(false);
  const count=SIGN_CATALOG.filter(s=>s.category===cat).length;
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?B.orange:"white",border:`1.5px solid ${hov?B.orange:"#e8e8e8"}`,borderRadius:12,cursor:"default",transition:"all 0.18s",boxShadow:hov?"0 4px 16px rgba(255,143,28,0.22)":"0 1px 3px rgba(0,0,0,0.05)",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
      <p style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:13,color:hov?"#fff":B.dark,margin:0,transition:"color 0.18s",whiteSpace:"nowrap"}}>{cat}</p>
      <span style={{fontFamily:"Manrope,sans-serif",fontSize:11,color:hov?"rgba(255,255,255,0.75)":"#bbb",flexShrink:0,transition:"color 0.18s"}}>{count}</span>
    </div>
  );
}

// ── SIGN CARD ─────────────────────────────────────────────────────────────────
function SignCard({sign,isSelected,onToggle,variantVal,onVariantChange,noteVal,onNoteChange,customSize,onCustomSize,currency}){
  const [expanded,setExpanded]=useState(false);
  const [imgTab,setImgTab]=useState("vector");
  const qty=getQty(sign,variantVal);
  const price=currency==="CAD"?sign.priceCAD:sign.priceUSD;
  const sym=currency==="CAD"?"CA$":"US$";
  const si={border:"1px solid #ddd",borderRadius:10,padding:"8px 12px",fontSize:13,width:"100%",fontFamily:"Manrope,sans-serif",background:"white"};
  const varInput=()=>{
    if(!sign.hasVariants)return null;
    const lbl=(t,el)=><div><label style={{fontSize:11,color:"#888"}}>{t}</label>{el}</div>;
    if(sign.variantType==="range")return <div style={{display:"flex",gap:8}}>
      {lbl("Start",<input type="number" style={si} placeholder="1" value={variantVal?.start||""} onChange={e=>onVariantChange({...variantVal,start:e.target.value})}/>)}
      {lbl("End",<input type="number" style={si} placeholder="10" value={variantVal?.end||""} onChange={e=>onVariantChange({...variantVal,end:e.target.value})}/>)}
    </div>;
    if(sign.variantType==="count")return lbl(sign.variantLabel,<input type="number" min="1" style={si} value={variantVal?.count||""} onChange={e=>onVariantChange({...variantVal,count:e.target.value})}/>);
    return lbl(sign.variantLabel,<input type="text" style={si} placeholder="e.g. A, B, C" value={variantVal?.custom||""} onChange={e=>onVariantChange({...variantVal,custom:e.target.value})}/>);
  };
  return(
    <div style={{borderRadius:18,border:`2px solid ${isSelected?B.orange:"#e5e7eb"}`,background:B.cream,overflow:"hidden",transition:"all 0.18s",boxShadow:isSelected?"0 4px 20px rgba(255,143,28,0.18)":"none"}}>
      <div style={{background:B.dark}}>
        <div style={{display:"flex",borderBottom:"1px solid #1e1e1e"}}>
          {["vector","real"].map(t=><button key={t} onClick={()=>setImgTab(t)} style={{flex:1,padding:"7px",fontSize:11,fontFamily:"Manrope,sans-serif",fontWeight:600,border:"none",cursor:"pointer",background:imgTab===t?B.orange:B.dark,color:imgTab===t?"#fff":"#666",transition:"all 0.15s"}}>{t==="vector"?"Vector Design":"Real-Life Photo"}</button>)}
        </div>
        <img src={imgTab==="vector"?sign.vectorImg:sign.realImg} alt={sign.name}
          style={{width:"100%",height:118,objectFit:"cover",display:"block"}}
          onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}/> 
        <div style={{display:"none",height:118,alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4,background:"#1a1a2e"}}>
          <span style={{fontSize:22}}>🖼️</span>
          <span style={{fontSize:11,color:"#555",fontFamily:"Manrope,sans-serif"}}>Image unavailable</span>
        </div>
      </div>
      <div style={{padding:"12px",cursor:"pointer"}} onClick={onToggle}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
          <div style={{flex:1}}><p style={{fontFamily:"Poppins,sans-serif",fontWeight:600,fontSize:13,color:B.dark,margin:0,lineHeight:1.35}}>{sign.name}</p><p style={{fontFamily:"Manrope,sans-serif",fontSize:11,color:"#aaa",margin:"3px 0 0"}}>{customSize||sign.size}</p></div>
          <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${isSelected?B.orange:"#d1d5db"}`,background:isSelected?B.orange:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,transition:"all 0.18s"}}>
            {isSelected&&<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
          <span style={{fontSize:11,padding:"2px 8px",borderRadius:999,color:"#fff",fontFamily:"Manrope,sans-serif",fontWeight:600,background:MATERIAL_BADGE[sign.material]||"#888"}}>{sign.material}</span>
          <span style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:13,color:B.orange}}>{sym}{(price*qty).toLocaleString()}</span>
        </div>
      </div>
      <div style={{borderTop:`1px solid ${B.gray}`}}>
        <button onClick={()=>setExpanded(e=>!e)} style={{width:"100%",padding:"8px",fontSize:11,fontFamily:"Manrope,sans-serif",color:B.blue,background:"none",border:"none",cursor:"pointer"}}>{expanded?"▲ Collapse":"▼ Details & specs"}</button>
      </div>
      {expanded&&(
        <div style={{padding:"12px",background:B.steel,display:"flex",flexDirection:"column",gap:8}}>
          <div style={{background:B.peach,borderRadius:10,padding:"10px 12px"}}><p style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:B.navy,margin:0}}><strong>📌 Install:</strong> {sign.installNote}</p></div>
          {isSelected&&<div style={{display:"flex",flexDirection:"column",gap:8}} onClick={e=>e.stopPropagation()}>
            {varInput()}
            <div><label style={{fontSize:11,color:"#888",fontFamily:"Manrope,sans-serif"}}>Custom size override</label><input type="text" style={si} placeholder={sign.size} value={customSize||""} onChange={e=>onCustomSize(e.target.value)}/></div>
            <div><label style={{fontSize:11,color:"#888",fontFamily:"Manrope,sans-serif"}}>Notes for designer</label><input type="text" style={si} placeholder="double-sided, specific location..." value={noteVal||""} onChange={e=>onNoteChange(e.target.value)}/></div>
          </div>}
        </div>
      )}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({name:"",position:"",email:"",country:"Canada",province:"",city:"",currency:"CAD"});
  const [activeCategory,setActiveCategory]=useState("Distribution");
  const [selected,setSelected]=useState({});
  const [activePlan,setActivePlan]=useState(null);
  const [variants,setVariants]=useState({});
  const [notes,setNotes]=useState({});
  const [customSizes,setCustomSizes]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [catTabHov,setCatTabHov]=useState(null);

  const setF=(k,v)=>setForm(p=>({...p,[k]:v}));
  const provinces=COUNTRIES[form.country]?.provinces||{};
  const cities=form.province?(provinces[form.province]||[]):[];
  const formComplete=form.name&&form.position&&form.email&&form.city;

  const toggleSign=id=>setSelected(p=>{const n={...p};if(n[id])delete n[id];else n[id]=true;return n;});
  const applyPlan=plan=>{
    if(activePlan===plan.id){setActivePlan(null);setSelected({});return;}
    setActivePlan(plan.id);
    const ids=plan.recommended||SIGN_CATALOG.map(s=>s.id);
    const ns={};ids.forEach(id=>{ns[id]=true;});setSelected(ns);
  };

  const selectedSigns=SIGN_CATALOG.filter(s=>selected[s.id]);
  const totalItems=selectedSigns.reduce((a,s)=>a+getQty(s,variants[s.id]),0);
  const sym=form.currency==="CAD"?"CA$":"US$";
  const rate=form.currency==="CAD"?1:0.74;
  const getPrice=s=>Math.round(s.priceCAD*rate);
  const totalCost=selectedSigns.reduce((a,s)=>a+getPrice(s)*getQty(s,variants[s.id]),0);

  const buildBrief=()=>{
    let b=`UNIUNI WAREHOUSE SIGNAGE BRIEF\nSubmitted: ${new Date().toLocaleString()}\nFrom: ${form.name} (${form.position}) — ${form.email}\nLocation: ${form.city}, ${form.province}, ${form.country}\nCurrency: ${form.currency}\n\nSIGN SUMMARY\n${"─".repeat(40)}\n`;
    CATEGORIES.forEach(cat=>{const cs=selectedSigns.filter(s=>s.category===cat);if(!cs.length)return;b+=`\n[${cat}]\n`;cs.forEach(s=>{const qty=getQty(s,variants[s.id]),vs=getVS(s,variants[s.id]);b+=`• ${s.name} | ${s.material} | ${customSizes[s.id]||s.size} | Qty: ${qty} | ${sym}${getPrice(s)*qty}${vs?` | ${vs}`:""}\n`;if(notes[s.id])b+=`  Notes: ${notes[s.id]}\n`;});});
    b+=`\n${"─".repeat(40)}\nTOTAL: ${totalItems} items | ${sym}${totalCost.toLocaleString()} (estimated)\n\n* Average quotes only. Actual costs confirmed by design team.`;
    return b;
  };

  const handleSubmit=()=>{
    const sub=encodeURIComponent(`Signage Brief — ${form.city}, ${form.country} — ${form.name}`);
    window.open(`mailto:rosa.zhang@uniuni.com?subject=${sub}&body=${encodeURIComponent(buildBrief())}`, "_blank");
    setSubmitted(true);
  };

  const exportBrief=()=>{
    const blob=new Blob([buildBrief()],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`signage-brief-${Date.now()}.txt`;a.click();URL.revokeObjectURL(url);
  };

  const reset=()=>{setSubmitted(false);setStep(0);setForm({name:"",position:"",email:"",country:"Canada",province:"",city:"",currency:"CAD"});setSelected({});setVariants({});setNotes({});setCustomSizes({});setActivePlan(null);};

  const darkInput={background:"white",border:"1px solid #e0e0e0",borderRadius:12,padding:"12px 16px",fontFamily:"Manrope,sans-serif",fontSize:13,color:B.dark,width:"100%"};
  const lbl={fontFamily:"Manrope,sans-serif",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"#aaa",display:"block",marginBottom:6};

  // ── SUBMITTED ──
  if(submitted) return(
    <div style={{fontFamily:"Manrope,sans-serif",background:B.cream,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{fontStyle}</style>
      <div style={{background:"white",borderRadius:24,boxShadow:"0 8px 40px rgba(0,0,0,0.1)",padding:40,maxWidth:560,width:"100%",textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:B.peach,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:30}}>✅</div>
        <h2 style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:24,color:B.dark,marginBottom:6}}>Brief Submitted!</h2>
        <p style={{color:"#888",fontSize:14,marginBottom:4}}>{form.city}, {form.country} · {form.name}</p>
        <p style={{color:"#888",fontSize:14,marginBottom:16}}><strong>{totalItems} sign items</strong> · <strong>{sym}{totalCost.toLocaleString()}</strong> estimated</p>
        <div style={{background:B.peach,borderRadius:12,padding:"10px 16px",marginBottom:20,textAlign:"left"}}>
          <p style={{fontFamily:"Manrope,sans-serif",fontSize:13,color:"#7a4a10",margin:0}}>📧 An email draft has been opened to <strong>rosa.zhang@uniuni.com</strong>. Please review and send it from your email client.</p>
        </div>
        <div style={{background:B.steel,borderRadius:16,padding:16,textAlign:"left",marginBottom:20,maxHeight:200,overflowY:"auto"}}>
          {CATEGORIES.map(cat=>{const cs=selectedSigns.filter(s=>s.category===cat);if(!cs.length)return null;return(
            <div key={cat} style={{marginBottom:10}}>
              <p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:B.orange,marginBottom:4,fontFamily:"Poppins,sans-serif"}}>{cat}</p>
              {cs.map(s=><p key={s.id} style={{fontSize:13,color:B.dark,margin:"2px 0",fontFamily:"Manrope,sans-serif"}}>{s.name} — {getQty(s,variants[s.id])} item(s) · {sym}{getPrice(s)*getQty(s,variants[s.id])}</p>)}
            </div>);})}
        </div>
        <button onClick={exportBrief} style={{width:"100%",background:B.orange,color:"#fff",border:"none",borderRadius:14,padding:14,fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:15,cursor:"pointer",marginBottom:10}}>⬇ Download Brief (.txt)</button>
        <button onClick={reset} style={{width:"100%",background:"white",color:B.dark,border:"1px solid #e5e7eb",borderRadius:14,padding:14,fontFamily:"Manrope,sans-serif",fontWeight:600,fontSize:14,cursor:"pointer"}}>Start New Submission</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:B.cream}}>
      <style>{fontStyle}</style>

      {/* ── NAV — clean, no animation ── */}
      <div style={{position:"sticky",top:0,zIndex:40,background:B.dark,padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <img src={LOGO_URL} alt="UniUni" style={{height:28}} onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="block";}}/>
          <span style={{display:"none",fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:18,color:B.orange}}>UniUni</span>
          <div style={{width:1,height:16,background:"rgba(255,255,255,0.15)"}}/>
          <span style={{fontFamily:"Manrope,sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,143,28,0.8)",border:"1px solid rgba(255,143,28,0.25)",borderRadius:6,padding:"3px 8px",background:"rgba(255,143,28,0.08)"}}>Internal Tool</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {step>0&&[{l:"Details",s:1},{l:"Signs",s:2},{l:"Summary",s:3}].map(({l,s})=>(
            <button key={s} onClick={()=>step>=s&&setStep(s)} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,fontFamily:"Manrope,sans-serif",color:step===s?B.orange:"#666",fontWeight:step===s?700:500,padding:"4px 8px",borderBottom:step===s?`2px solid ${B.orange}`:"2px solid transparent",transition:"all 0.15s"}}>{l}</button>
          ))}
          {step>=2&&<span style={{background:B.orange,color:"#fff",borderRadius:999,padding:"4px 14px",fontSize:12,fontFamily:"Poppins,sans-serif",fontWeight:700}}>{totalItems} · {sym}{totalCost.toLocaleString()}</span>}
        </div>
      </div>

      {/* ── STEP 0: WELCOME ── */}
      {step===0&&(
        <div>
          {/* HERO — cream bg with flowing orange lines */}
          <div style={{position:"relative",overflow:"hidden",background:B.cream,minHeight:520,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <HeroLines/>
            {/* dark top + bottom edge gradient to blend with sections */}
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:`linear-gradient(to bottom,transparent,${B.cream})`,pointerEvents:"none",zIndex:2}}/>
            <div style={{position:"relative",zIndex:3,textAlign:"center",padding:"80px 24px 80px"}}>
              <div style={{display:"inline-block",background:"rgba(255,143,28,0.1)",border:`1px solid rgba(255,143,28,0.35)`,borderRadius:999,padding:"5px 18px",fontSize:11,fontFamily:"Manrope,sans-serif",fontWeight:700,color:B.orange,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:28,animation:"fadeUp 0.6s ease both"}}>
                Warehouse Operations
              </div>
              <h1 style={{fontFamily:"Poppins,sans-serif",fontWeight:800,fontSize:"clamp(34px,6vw,62px)",color:B.dark,lineHeight:1.12,marginBottom:18,animation:"fadeUp 0.7s ease 0.1s both"}}>
                Warehouse<br/><span style={{color:B.orange}}>Signage Request</span>
              </h1>
              <p style={{color:"#666",maxWidth:500,margin:"0 auto 38px",fontSize:16,fontFamily:"Manrope,sans-serif",lineHeight:1.75,animation:"fadeUp 0.7s ease 0.2s both"}}>
                Select your signs, fill in the specs, and send a production-ready brief directly to the design team.
              </p>
              <button onClick={()=>setStep(1)}
                style={{background:B.orange,color:"#fff",border:"none",borderRadius:16,padding:"16px 44px",fontSize:16,fontFamily:"Poppins,sans-serif",fontWeight:700,cursor:"pointer",boxShadow:"0 8px 28px rgba(255,143,28,0.3)",animation:"fadeUp 0.7s ease 0.3s both",transition:"transform 0.15s,box-shadow 0.15s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(255,143,28,0.4)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 8px 28px rgba(255,143,28,0.3)";}}>
                Start a Request →
              </button>
            </div>
          </div>

          {/* HOW IT WORKS — light cream bg */}
          <div style={{background:"white",padding:"72px 24px 64px"}}>
            <div style={{maxWidth:960,margin:"0 auto"}}>
              <p style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:B.orange,marginBottom:10}}>How it works</p>
              <h2 style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:"clamp(22px,4vw,34px)",color:B.dark,textAlign:"center",marginBottom:56}}>Four steps to a production brief</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24,position:"relative"}}>
                {/* orange line behind boxes */}
                <div style={{position:"absolute",top:40,left:"10%",right:"10%",height:3,background:`linear-gradient(to right,transparent,${B.orange} 15%,${B.orange} 85%,transparent)`,borderRadius:999,zIndex:0}}/>
                {[{n:"1",icon:"👤",label:"Your details",desc:"Name, role, and warehouse location"},{n:"2",icon:"🔍",label:"Pick your signs",desc:"Browse categories or apply a size plan"},{n:"3",icon:"✏️",label:"Set the specs",desc:"Quantities, numbering, sizes, notes"},{n:"4",icon:"📤",label:"Submit",desc:"Brief lands directly with the designer"}].map(s=>(
                  <div key={s.n} style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",position:"relative",zIndex:1}}>
                    <div style={{width:80,height:80,borderRadius:20,background:B.dark,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:16,boxShadow:`0 0 0 5px white, 0 8px 24px rgba(255,143,28,0.18)`}}>
                      {s.icon}
                    </div>
                    <p style={{fontFamily:"Poppins,sans-serif",fontWeight:600,fontSize:14,color:B.dark,marginBottom:4}}>{s.n}. {s.label}</p>
                    <p style={{fontFamily:"Manrope,sans-serif",fontSize:13,color:"#888",lineHeight:1.5,margin:0}}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIGN CATEGORIES — light steel bg */}
          <div style={{background:B.steel,padding:"64px 24px 72px"}}>
            <div style={{maxWidth:960,margin:"0 auto"}}>
              <p style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:B.orange,marginBottom:10}}>What's covered</p>
              <h2 style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:"clamp(22px,4vw,34px)",color:B.dark,textAlign:"center",marginBottom:32}}>Sign categories</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
                {CATEGORIES.map(cat=><CatCard key={cat} cat={cat}/>)}
              </div>
            </div>
          </div>

          {/* FOOTER — dark */}
          <div style={{background:B.dark,padding:"44px 28px 36px"}}>
            <div style={{maxWidth:960,margin:"0 auto"}}>
              <div style={{display:"flex",flexWrap:"wrap",alignItems:"flex-start",justifyContent:"space-between",gap:24,marginBottom:32}}>
                <div>
                  <img src={LOGO_URL_WHITE} alt="UniUni" style={{height:26,marginBottom:12}}
                    onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="block";}}/>
                  <span style={{display:"none",fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:18,color:B.orange}}>UniUni</span>
                  <p style={{fontFamily:"Poppins,sans-serif",fontSize:14,color:B.cream,margin:"0 0 4px",lineHeight:1.6}}>Warehouse Signage Request System</p>
                  <p style={{fontFamily:"Poppins,sans-serif",fontSize:13,color:"rgba(251,250,247,0.45)",margin:0}}>Internal Use Only</p>
                </div>
                <div>
                  <p style={{fontFamily:"Poppins,sans-serif",fontSize:12,fontWeight:700,color:"rgba(251,250,247,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Sign Categories</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {CATEGORIES.map(c=><span key={c} style={{fontFamily:"Poppins,sans-serif",fontSize:14,color:B.cream}}>{c}</span>)}
                  </div>
                </div>
                <div>
                  <p style={{fontFamily:"Poppins,sans-serif",fontSize:12,fontWeight:700,color:"rgba(251,250,247,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Contact</p>
                  <p style={{fontFamily:"Poppins,sans-serif",fontSize:14,color:B.cream,margin:0}}>rosa.zhang@uniuni.com</p>
                  <p style={{fontFamily:"Poppins,sans-serif",fontSize:14,color:"rgba(251,250,247,0.45)",margin:"6px 0 0"}}>Design Team</p>
                </div>
              </div>
              <div style={{borderTop:"1px solid rgba(251,250,247,0.08)",paddingTop:20,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <p style={{fontFamily:"Poppins,sans-serif",fontSize:13,color:"rgba(251,250,247,0.35)",margin:0}}>© {new Date().getFullYear()} UniUni. All rights reserved.</p>
                <p style={{fontFamily:"Poppins,sans-serif",fontSize:13,color:"rgba(251,250,247,0.2)",margin:0}}>We deliver the goods.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: DETAILS ── */}
      {step===1&&(
        <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px 80px"}}>
          <button onClick={()=>setStep(0)} style={{background:"none",border:"none",color:"#888",fontFamily:"Manrope,sans-serif",fontSize:13,cursor:"pointer",marginBottom:20}}>← Back</button>
          <h1 style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:28,color:B.dark,marginBottom:6}}>Your Details</h1>
          <p style={{fontFamily:"Manrope,sans-serif",fontSize:14,color:"#888",marginBottom:32}}>The designer will use this to identify the request and reach you if needed.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {/* Basic Info */}
            <div style={{background:B.cream,borderRadius:24,padding:28,display:"flex",flexDirection:"column",gap:16,border:`1px solid #e8e4dc`,gridRow:"span 2"}}>
              <div>
                <div style={{width:36,height:36,borderRadius:10,background:B.peach,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginBottom:12}}>👤</div>
                <p style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:16,color:B.dark,marginBottom:4}}>Basic Info</p>
                <p style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#aaa",marginBottom:20}}>Who is submitting this request?</p>
              </div>
              {[{k:"name",label:"Full Name",ph:"e.g. Sarah Chen",t:"text"},{k:"position",label:"Position / Role",ph:"e.g. Operations Assistant",t:"text"},{k:"email",label:"Email Address",ph:"e.g. sarah@uniuni.com",t:"email"}].map(f=>(
                <div key={f.k}><label style={lbl}>{f.label}</label><input type={f.t} style={darkInput} placeholder={f.ph} value={form[f.k]} onChange={e=>setF(f.k,e.target.value)}/></div>
              ))}
            </div>
            {/* Location */}
            <div style={{background:B.steel,borderRadius:24,padding:28,border:`1px solid #dde`}}>
              <div style={{width:36,height:36,borderRadius:10,background:B.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginBottom:12}}>📍</div>
              <p style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:16,color:B.dark,marginBottom:4}}>Location</p>
              <p style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#aaa",marginBottom:16}}>Which warehouse is this for?</p>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {Object.keys(COUNTRIES).map(c=>(
                  <button key={c} onClick={()=>{setF("country",c);setF("province","");setF("city","");}} style={{flex:1,padding:"10px",borderRadius:12,border:`1.5px solid ${form.country===c?B.blue:"#ccd"}`,background:form.country===c?B.blue:"white",color:form.country===c?"#fff":B.dark,fontFamily:"Manrope,sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>
                    {c==="Canada"?"🇨🇦":c==="USA"?"🇺🇸":""} {c}
                  </button>
                ))}
              </div>
              <div style={{marginBottom:12}}>
                <label style={lbl}>Province / State</label>
                <select value={form.province} onChange={e=>{setF("province",e.target.value);setF("city","");}} style={{...darkInput,cursor:"pointer"}}>
                  <option value="">Select province / state</option>
                  {Object.keys(provinces).map(p=><option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              {form.province&&(
                <div><label style={lbl}>City</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {cities.map(c=><button key={c} onClick={()=>setF("city",c)} style={{padding:"8px 14px",borderRadius:10,border:`1.5px solid ${form.city===c?B.orange:"#ccd"}`,background:form.city===c?B.orange:"white",color:form.city===c?"#fff":B.dark,fontFamily:"Manrope,sans-serif",fontWeight:600,fontSize:12,cursor:"pointer"}}>{c}</button>)}
                  </div>
                </div>
              )}
            </div>
            {/* Currency */}
            <div style={{background:B.peach,borderRadius:24,padding:28}}>
              <div style={{width:36,height:36,borderRadius:10,background:B.orange,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginBottom:12}}>💱</div>
              <p style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:16,color:B.dark,marginBottom:4}}>Currency</p>
              <p style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#a07050",marginBottom:16}}>Estimates will be shown in your chosen currency.</p>
              <div style={{display:"flex",gap:10}}>
                {["CAD","USD"].map(c=>(
                  <button key={c} onClick={()=>setF("currency",c)} style={{flex:1,padding:"16px",borderRadius:14,border:`2px solid ${form.currency===c?B.orange:"#e8d0b8"}`,background:form.currency===c?B.orange:"white",color:form.currency===c?"#fff":B.dark,fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:15,cursor:"pointer",transition:"all 0.15s"}}>
                    {c==="CAD"?"🇨🇦 CAD":"🇺🇸 USD"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button disabled={!formComplete} onClick={()=>setStep(2)}
            style={{marginTop:20,width:"100%",background:formComplete?"#374151":"#e5e7eb",color:formComplete?"#fff":"#9ca3af",border:"none",borderRadius:16,padding:"16px",fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:16,cursor:formComplete?"pointer":"not-allowed",transition:"background 0.2s, color 0.2s"}}
            onMouseEnter={e=>{if(formComplete){e.currentTarget.style.background=B.dark;e.currentTarget.style.color="#fff";}}}
            onMouseLeave={e=>{if(formComplete){e.currentTarget.style.background="#374151";e.currentTarget.style.color="#fff";}}}>
            Next Step →
          </button>
        </div>
      )}

      {/* ── STEP 2: SELECT ── */}
      {step===2&&(
        <div style={{maxWidth:1280,margin:"0 auto",padding:"32px 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <button onClick={()=>setStep(1)} style={{background:"none",border:"none",color:"#888",fontFamily:"Manrope,sans-serif",fontSize:13,cursor:"pointer"}}>← Back</button>
            <h2 style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:22,color:B.dark,margin:0}}>Select Signs — {form.city}</h2>
          </div>
          {/* Bento row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:12,marginBottom:20}}>
            <div style={{background:B.dark,borderRadius:20,padding:20,display:"flex",flexDirection:"column",justifyContent:"space-between",minHeight:140,transition:"all 0.18s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 28px rgba(0,0,0,0.25)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
              <div>
                <p style={{fontFamily:"Manrope,sans-serif",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:B.orange,marginBottom:6}}>Custom</p>
                <p style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:15,color:"#fff",marginBottom:4}}>Build your own</p>
                <p style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#666",lineHeight:1.5}}>Browse every category and pick exactly what you need.</p>
              </div>
              <div style={{background:B.orange,borderRadius:10,padding:"7px 12px",marginTop:12,textAlign:"center"}}>
                <span style={{fontFamily:"Poppins,sans-serif",fontSize:13,fontWeight:700,color:"#fff"}}>{Object.keys(selected).length} selected</span>
              </div>
            </div>
            {WAREHOUSE_PLANS.map(plan=>{
              const isActive=activePlan===plan.id;
              return(
                <div key={plan.id} onClick={()=>applyPlan(plan)}
                  style={{background:isActive?B.orange:B.steel,borderRadius:20,padding:20,cursor:"pointer",minHeight:140,display:"flex",flexDirection:"column",justifyContent:"space-between",transition:"all 0.18s",border:`2px solid ${isActive?B.orange:"transparent"}`,boxShadow:isActive?"0 12px 28px rgba(255,143,28,0.28)":"none"}}
                  onMouseEnter={e=>{if(!isActive){e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.background=B.orange;e.currentTarget.style.boxShadow="0 12px 28px rgba(255,143,28,0.22)";e.currentTarget.querySelectorAll("p").forEach(el=>el.style.color="#fff");}}}
                  onMouseLeave={e=>{if(!isActive){e.currentTarget.style.transform="none";e.currentTarget.style.background=B.steel;e.currentTarget.style.boxShadow="none";e.currentTarget.querySelectorAll("p").forEach(el=>el.style.color="");}}}>
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <span style={{fontSize:22}}>{plan.emoji}</span>
                      {isActive&&<span style={{fontSize:10,background:"rgba(255,255,255,0.25)",color:"#fff",borderRadius:999,padding:"2px 8px",fontFamily:"Manrope,sans-serif",fontWeight:700}}>✓ Active</span>}
                    </div>
                    <p style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:14,color:isActive?"#fff":B.dark,marginBottom:2}}>{plan.label}</p>
                    <p style={{fontFamily:"Manrope,sans-serif",fontSize:11,color:isActive?"rgba(255,255,255,0.8)":"#888",marginBottom:2}}>{plan.sqft}</p>
                    <p style={{fontFamily:"Manrope,sans-serif",fontSize:11,color:isActive?"rgba(255,255,255,0.7)":"#aaa"}}>{plan.signCount} signs</p>
                  </div>
                  <p style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:13,color:isActive?"#fff":B.orange,marginTop:8}}>{plan.estCAD}</p>
                  {isActive&&<p style={{fontFamily:"Manrope,sans-serif",fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:2}}>Click to deselect</p>}
                </div>
              );
            })}
          </div>
          {/* Category tabs */}
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            {CATEGORIES.map(cat=>{
              const count=SIGN_CATALOG.filter(s=>s.category===cat&&selected[s.id]).length;
              const isActive=activeCategory===cat;
              const isHov=catTabHov===cat;
              return(
                <button key={cat} onClick={()=>setActiveCategory(cat)} onMouseEnter={()=>setCatTabHov(cat)} onMouseLeave={()=>setCatTabHov(null)}
                  style={{padding:"8px 18px",borderRadius:999,border:`1px solid ${isActive||isHov?B.orange:"#e0e0e0"}`,background:isActive||isHov?B.orange:"white",color:isActive||isHov?"#fff":B.dark,fontFamily:"Manrope,sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",gap:6}}>
                  {cat}{count>0&&<span style={{background:"rgba(255,255,255,0.3)",color:"#fff",borderRadius:999,padding:"1px 7px",fontSize:11,fontWeight:700}}>{count}</span>}
                </button>
              );
            })}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14,marginBottom:120}}>
            {SIGN_CATALOG.filter(s=>s.category===activeCategory).map(sign=>(
              <SignCard key={sign.id} sign={sign} isSelected={!!selected[sign.id]} onToggle={()=>toggleSign(sign.id)}
                variantVal={variants[sign.id]} onVariantChange={v=>setVariants(p=>({...p,[sign.id]:v}))}
                noteVal={notes[sign.id]} onNoteChange={v=>setNotes(p=>({...p,[sign.id]:v}))}
                customSize={customSizes[sign.id]} onCustomSize={v=>setCustomSizes(p=>({...p,[sign.id]:v}))}
                currency={form.currency}/>
            ))}
          </div>
          {Object.keys(selected).length>0&&(
            <div style={{position:"fixed",bottom:0,left:0,right:0,background:"white",borderTop:`1px solid ${B.gray}`,padding:"14px 28px",zIndex:40,boxShadow:"0 -4px 20px rgba(0,0,0,0.07)"}}>
              <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <p style={{fontFamily:"Poppins,sans-serif",fontWeight:600,fontSize:14,color:B.dark,margin:0}}>{selectedSigns.length} sign types · {totalItems} total items</p>
                  <p style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:13,color:B.orange,margin:0}}>{sym}{totalCost.toLocaleString()} estimated</p>
                </div>
                <button onClick={()=>setStep(3)} style={{background:B.orange,color:"#fff",border:"none",borderRadius:14,padding:"13px 28px",fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:15,cursor:"pointer"}}>Review & Submit →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: SUMMARY ── */}
      {step===3&&(
        <div style={{maxWidth:860,margin:"0 auto",padding:"40px 24px 80px"}}>
          <button onClick={()=>setStep(2)} style={{background:"none",border:"none",color:"#888",fontFamily:"Manrope,sans-serif",fontSize:13,cursor:"pointer",marginBottom:20}}>← Back to selection</button>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <h2 style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:26,color:B.dark,margin:0}}>Summary</h2>
            <span style={{background:B.peach,color:B.orange,borderRadius:999,padding:"4px 14px",fontSize:12,fontFamily:"Manrope,sans-serif",fontWeight:700}}>Pending designer review</span>
          </div>
          <div style={{background:"white",borderRadius:24,boxShadow:"0 4px 24px rgba(0,0,0,0.06)",padding:28,marginBottom:16}}>
            <div style={{background:B.steel,borderRadius:16,padding:16,marginBottom:24}}>
              <p style={{fontFamily:"Manrope,sans-serif",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:B.navy,marginBottom:8}}>Submitted by</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:"4px 24px",fontSize:13,color:B.dark,fontFamily:"Manrope,sans-serif"}}>
                <span><strong>{form.name}</strong></span><span>{form.position}</span><span>{form.email}</span><span>{form.city}, {form.province}, {form.country}</span><span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            {CATEGORIES.map(cat=>{const cs=selectedSigns.filter(s=>s.category===cat);if(!cs.length)return null;return(
              <div key={cat} style={{marginBottom:24}}>
                <p style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",color:B.orange,borderBottom:`1px solid ${B.gray}`,paddingBottom:8,marginBottom:12}}>{cat}</p>
                <table style={{width:"100%",fontSize:13,fontFamily:"Manrope,sans-serif",borderCollapse:"collapse"}}>
                  <thead><tr style={{color:"#bbb",fontSize:11}}>
                    <th style={{textAlign:"left",paddingBottom:6,fontWeight:600}}>Sign</th>
                    <th style={{textAlign:"left",paddingBottom:6,fontWeight:600}}>Material</th>
                    <th style={{textAlign:"left",paddingBottom:6,fontWeight:600}}>Size</th>
                    <th style={{textAlign:"center",paddingBottom:6,fontWeight:600}}>Qty</th>
                    <th style={{textAlign:"right",paddingBottom:6,fontWeight:600}}>Est.</th>
                  </tr></thead>
                  <tbody>{cs.map(s=>{const qty=getQty(s,variants[s.id]),vs=getVS(s,variants[s.id]);return(
                    <tr key={s.id} style={{borderTop:`1px solid ${B.gray}`}}>
                      <td style={{padding:"10px 0",color:B.dark,fontWeight:500}}>{s.name}{vs&&<span style={{color:"#bbb",fontSize:11,marginLeft:6}}>({vs})</span>}{notes[s.id]&&<p style={{fontSize:11,color:"#bbb",margin:0}}>Note: {notes[s.id]}</p>}</td>
                      <td style={{padding:"10px 8px",color:"#999"}}>{s.material}</td>
                      <td style={{padding:"10px 8px",color:"#999"}}>{customSizes[s.id]||s.size}</td>
                      <td style={{textAlign:"center",fontWeight:700,color:B.dark}}>{qty}</td>
                      <td style={{textAlign:"right",fontWeight:700,color:B.orange,fontFamily:"Poppins,sans-serif"}}>{sym}{(getPrice(s)*qty).toLocaleString()}</td>
                    </tr>);})}</tbody>
                </table>
              </div>);})}
            <div style={{borderTop:`2px solid ${B.gray}`,paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <p style={{fontFamily:"Manrope,sans-serif",fontSize:13,color:"#aaa",margin:0}}>{totalItems} items · {selectedSigns.length} sign types</p>
              <div style={{textAlign:"right"}}>
                <p style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#bbb",margin:0}}>Estimated Total</p>
                <p style={{fontFamily:"Poppins,sans-serif",fontWeight:800,fontSize:28,color:B.orange,margin:0}}>{sym}{totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div style={{background:B.peach,borderRadius:16,padding:"16px 20px",marginBottom:12,display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{fontSize:18,flexShrink:0}}>📋</span>
            <div>
              <p style={{fontFamily:"Poppins,sans-serif",fontWeight:600,fontSize:13,color:B.dark,margin:"0 0 4px"}}>About these estimates</p>
              <p style={{fontFamily:"Manrope,sans-serif",fontSize:13,color:"#7a4a10",margin:0,lineHeight:1.6}}>These are <strong>average quotes</strong> based on standard print pricing. Actual costs will vary by vendor, quantity, shipping, and installation. <strong>Final pricing confirmed by the design team</strong> after reviewing this brief.</p>
            </div>
          </div>
          <div style={{background:B.steel,borderRadius:16,padding:"14px 20px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:16}}>📧</span>
            <p style={{fontFamily:"Manrope,sans-serif",fontSize:13,color:"#555",margin:0}}>Submitting will open an email draft to <strong>rosa.zhang@uniuni.com</strong> with your full brief.</p>
          </div>
          <button onClick={handleSubmit} style={{width:"100%",background:B.dark,color:"#fff",border:"none",borderRadius:18,padding:"18px",fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:17,cursor:"pointer",marginBottom:10,transition:"background 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background=B.orange}
            onMouseLeave={e=>e.currentTarget.style.background=B.dark}>
            Submit to Design Team →
          </button>
          <p style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:12,color:"#bbb"}}>Brief download also available after submitting.</p>
        </div>
      )}
    </div>
  );
}
