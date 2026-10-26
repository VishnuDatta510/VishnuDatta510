// Night-city header: every week of the last year is a building, every day a window.
import { rng, SANS, RM, fmt, SVG_NS } from "./util.mjs";

/** cal comes from prepareCalendar(); returns a standalone animated SVG string. */
export function renderScene(cal, { name, tagline }) {
  const { grid, total, wk, maxWk, peakW, lbl, RD } = cal;
  const catWeek = (pw) => (pw + 3 <= 52 ? pw + 3 : pw - 3); // cat sits behind the developer
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const NAME = esc(name), TAGLINE = esc(tagline);

// Base night-city scene: one building per week, one window per day, a developer and a cat on the tallest recent tower.
function baseScene(){
  const bx=26,gy=372,pitch=16,W=14,win=['#1a2147','#8a6a4c','#e0a448','#ffc857','#fff4c2'];
  let b='';
  const roofY=w=>gy-(84+Math.round(wk[w]/maxWk*104)); let pw=43;for(let w=43;w<53;w++)if(wk[w]>wk[pw])pw=w; const cw=catWeek(pw), bcx=w=>bx+w*pitch+7, py=roofY(pw), antW=Math.abs(peakW-pw)<3?peakW-5:peakW;
  for(let w=0;w<53;w++){
    const H=7*10+14+Math.round(wk[w]/maxWk*104), x=bx+w*pitch, y=gy-H, dl=(0.3+w*0.04).toFixed(2);
    let ws='';
    for(let d=0;d<7;d++){const g=grid[w][d];const l=g?g.l:0;
      ws+=`<rect class="r-w${l?' r-on':''}" x="${x+3}" y="${y+8+d*10}" width="8" height="6" rx="1" fill="${win[l]}"${l?` style="animation-delay:${(+dl+0.7+d*0.07).toFixed(2)}s"`:''}/>`;}
    const ant='';
    b+=`<g class="r-b" style="animation-delay:${dl}s"><rect x="${x}" y="${y}" width="${W}" height="${H}" rx="2" fill="${w%3==0?'#241d4a':w%3==1?'#2a2252':'#1f1943'}"/><rect x="${x}" y="${y}" width="${W}" height="2.5" fill="#3a2f70"/>${ws}</g>`}
  
  let stars='';for(let k=0;k<40;k++){stars+=`<circle class="r-s" cx="${(RD()*880+10).toFixed(1)}" cy="${(RD()*150+6).toFixed(1)}" r="${(.5+RD()*.9).toFixed(1)}" fill="#fff" style="animation-delay:${(RD()*4).toFixed(2)}s"/>`}
  return `<svg class="Rf" viewBox="0 0 900 430" role="img" aria-label="Night city scene where each week of contributions is a building, with a developer and a cat on the tallest roof">
<style>
.Rf text{font-family:${SANS}}
.Rf .r-n{fill:#fff;font-size:28px;font-weight:650;letter-spacing:-.4px}.Rf .r-d{fill:#b9a9e8;font-size:13.5px}.Rf .r-l{fill:#8c7bc4;font-size:11px}.Rf .r-t{fill:#d8ccf5;font-size:13px}
.Rf .r-b{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(0);animation:r-rise 1s cubic-bezier(.2,.85,.25,1) forwards}
.Rf .r-on{opacity:0;animation:r-on .5s ease-out forwards}
.Rf .r-w{opacity:1}.Rf .r-on{opacity:0}
.Rf .r-s{opacity:.2;animation:r-tw 3s ease-in-out infinite alternate}
.Rf .r-fade{opacity:0;animation:r-fade .9s ease-out forwards}
.Rf .r-blink{animation:r-bl 2s steps(1) infinite}
.Rf .r-cloud{animation:r-cl 60s linear infinite}
.Rf .r-plane{animation:r-pl 34s linear 5s infinite;transform:translateX(-300px)}
.Rf .r-car{animation:r-car 14s linear 3s infinite;transform:translateX(-30px)}
.Rf .r-type{animation:r-ty .5s ease-in-out infinite alternate}
.Rf .r-tail{transform-box:fill-box;transform-origin:0% 100%;animation:r-tailw 2.6s ease-in-out infinite alternate}
.Rf .r-steam{opacity:0;animation:r-st 3s ease-out infinite}
.Rf .r-eye{transform-box:fill-box;transform-origin:center;animation:r-eye 5s infinite}
.Rf .r-neon{filter:drop-shadow(0 0 4px rgba(255,200,87,.7));animation:r-flk 6s steps(1) 4s infinite}
.Rf .r-char{opacity:0;animation:r-fade .9s ease-out 3.3s forwards}
@keyframes r-flk{0%,100%{opacity:1}92%{opacity:.35}94%{opacity:1}96%{opacity:.5}98%{opacity:1}}
@keyframes r-rise{to{transform:scaleY(1)}}
@keyframes r-on{to{opacity:1}}
@keyframes r-tw{to{opacity:.9}}
@keyframes r-fade{to{opacity:1}}
@keyframes r-bl{0%{opacity:1}50%{opacity:.15}}
@keyframes r-cl{from{transform:translateX(-120px)}to{transform:translateX(1020px)}}
@keyframes r-pl{from{transform:translateX(-300px)}to{transform:translateX(1200px)}}
@keyframes r-car{from{transform:translateX(-30px)}to{transform:translateX(930px)}}
@keyframes r-ty{from{transform:translateY(0)}to{transform:translateY(-1.5px)}}
@keyframes r-tailw{from{transform:rotate(-10deg)}to{transform:rotate(14deg)}}
@keyframes r-st{0%{opacity:0;transform:translateY(0)}30%{opacity:.7}100%{opacity:0;transform:translateY(-12px)}}
@keyframes r-eye{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}
${RM('.Rf .r-b{transform:none;animation:none}.Rf .r-on,.Rf .r-fade,.Rf .r-char{opacity:1;animation:none}.Rf .r-s{animation:none;opacity:.6}.Rf .r-cloud,.Rf .r-plane,.Rf .r-car,.Rf .r-type,.Rf .r-tail,.Rf .r-steam,.Rf .r-eye,.Rf .r-blink{animation:none}')}
</style>
<defs><linearGradient id="rSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0a24"/><stop offset=".55" stop-color="#2a1f5c"/><stop offset=".85" stop-color="#7a3f7a"/><stop offset="1" stop-color="#e0805e"/></linearGradient>
<radialGradient id="rMoon"><stop offset="0" stop-color="#fff0d0" stop-opacity=".45"/><stop offset="1" stop-color="#fff0d0" stop-opacity="0"/></radialGradient>
<linearGradient id="rScr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8bffd8" stop-opacity=".0"/><stop offset="1" stop-color="#8bffd8" stop-opacity=".25"/></linearGradient>
<clipPath id="rClip"><rect width="900" height="430" rx="14"/></clipPath></defs>
<g clip-path="url(#rClip)">
<rect width="900" height="430" fill="url(#rSky)"/>${stars}
<circle cx="820" cy="76" r="74" fill="url(#rMoon)"/><circle cx="820" cy="76" r="19" fill="#fbf1d6"/><circle cx="813" cy="70" r="4" fill="#efe2bd"/><circle cx="827" cy="83" r="2.6" fill="#efe2bd"/>
<g opacity=".35"><g class="r-cloud"><ellipse cx="0" cy="120" rx="46" ry="9" fill="#d9a8d6"/><ellipse cx="22" cy="113" rx="26" ry="8" fill="#d9a8d6"/></g><g class="r-cloud" style="animation-delay:-30s"><ellipse cx="0" cy="168" rx="58" ry="10" fill="#d9a8d6"/><ellipse cx="-24" cy="162" rx="30" ry="8" fill="#d9a8d6"/></g></g>
<g class="r-plane"><g transform="translate(0 150)"><path d="M0 0l22 -4 6 4-6 4z" fill="#f2e9ff"/><path d="M8 0l-6 -9h5l8 7z" fill="#cdbdf0"/><rect x="-2" y="-0.6" width="3" height="1.2" fill="#ffc857"/><path d="M-2 0H-58" stroke="#f2e9ff" stroke-opacity=".5" stroke-dasharray="2 3"/>
<rect x="-132" y="-8" width="72" height="16" rx="3" fill="#ffc857"/><path d="M-60 -8l8 8-8 8z" fill="#ffc857"/><text x="-96" y="3.5" text-anchor="middle" style="font-size:9.5px;font-weight:800;letter-spacing:1.5px;fill:#2a1f5c">SHIP IT</text></g></g>
<text class="r-n r-fade" x="34" y="58" style="animation-delay:.2s">${NAME}</text>
<text class="r-d r-fade" x="34" y="82" style="animation-delay:.4s">${TAGLINE}</text>
<path d="M0 372 0 340Q80 322 150 336T300 330T470 340T640 326T780 338T900 330V372Z" fill="#1a1440" opacity=".7"/>
${b}
<rect y="${gy}" width="900" height="58" fill="#0d0a22"/><rect y="${gy}" width="900" height="2" fill="#2a2252"/>
<g class="r-car"><rect x="0" y="${gy+12}" width="16" height="5" rx="2" fill="#3a2f70"/><circle cx="14" cy="${gy+14.5}" r="1.6" fill="#ffe9a8"/><path d="M15 ${gy+14.5}h22" stroke="#ffe9a8" stroke-opacity=".25" stroke-width="3"/></g>
${lbl(bx,gy+20,pitch,'r-l r-fade')}
<g class="r-char" transform="translate(${bcx(cw)} ${roofY(cw)}) scale(-1.5 1.5)"><ellipse cx="0" cy="-6" rx="8.5" ry="6" fill="#0c0a1c"/><circle cx="8" cy="-12" r="5.2" fill="#0c0a1c"/><path d="M4.6 -15.6l.4-4.6 3 2.6zM11.4 -15.6l-.4-4.6-3 2.6z" fill="#0c0a1c"/>
 <g class="r-eye"><ellipse cx="6.4" cy="-12.6" rx="1" ry="1.4" fill="#ffd66b"/><ellipse cx="9.8" cy="-12.6" rx="1" ry="1.4" fill="#ffd66b"/></g>
 <path class="r-tail" d="M-8 -4q-9 2-9 -8" fill="none" stroke="#0c0a1c" stroke-width="2.6" stroke-linecap="round"/></g>
<g class="r-char" transform="translate(${bcx(pw)-7.5} ${py}) scale(-1.5 1.5)">
  <!-- developer, seated on the roof edge -->
  <g transform="translate(0 0)">
   <path d="M-14 0v-12q0 -4 4 -4h14q4 0 4 4v12z" fill="#2c3a7a"/>
   <rect x="-4" y="-2" width="22" height="5" rx="2.5" fill="#35459a"/><rect x="14" y="-2" width="5" height="12" rx="2.5" fill="#35459a"/><rect x="14" y="8" width="8" height="3.5" rx="1.7" fill="#e8e1ff"/>
   <path d="M-12 -14q-1 -17 12 -18q13 1 12 18z" fill="#3a4cb0"/>
   <circle cx="-1" cy="-35" r="7.5" fill="#f1c9a5"/><path d="M-9 -36q1 -9 9 -9q8 0 8 8q-4 -5 -10 -4q-4 1 -7 5z" fill="#1d2150"/><path d="M-9 -34q-3 3 -1 8l3 -3z" fill="#1d2150"/>
   <circle cx="3.2" cy="-35" r="1" fill="#241a3c"/>
   <g class="r-type"><path d="M2 -18q8 2 11 6" fill="none" stroke="#3a4cb0" stroke-width="5" stroke-linecap="round"/><circle cx="14" cy="-12" r="2.2" fill="#f1c9a5"/></g>
   <path d="M10 -9l16 -1 -1 -1.8 -15 1z" fill="#b5b9d6"/><path d="M24.5 -10.5l1.5 -17 2 .4 -1.2 17z" fill="#8f94b8"/><path d="M26 -11.6l1.4 -15 -.2 -.3z" fill="url(#rScr)"/><rect x="25.6" y="-28" width="2.2" height="16" fill="#8bffd8" opacity=".35"/>
   <circle cx="26" cy="-19" r="9" fill="#8bffd8" opacity=".08"/>
   
  </g>
</g>
<text class="r-t r-fade" x="34" y="${gy+50}" style="animation-delay:3.2s"><tspan fill="#ffc857" font-weight="700">${fmt(total)}</tspan> contributions in the last year · each building is a week, each window a day</text>
</g></svg>`}


// Detail pass: beacon, fairy lights, flickering windows, street life, headphones and the like.
function detailLayers(){
  const bx=26,gy=372,pitch=16;
  const roofY=w=>gy-(84+Math.round(wk[w]/maxWk*104)), bcx=w=>bx+w*pitch+7;
  let pw=43;for(let w=43;w<53;w++)if(wk[w]>wk[pw])pw=w;
  const cw=catWeek(pw), py=roofY(pw), antW=Math.abs(peakW-pw)<3?(peakW>=5?peakW-5:peakW+5):peakW, ant2=Math.max(2,pw-9);
  const Q=rng(2026); let s=baseScene();
  /* style + defs */
  s=s.replace('</style>',`
.Rf .r-late{opacity:0;animation:r-fade 1s ease-out 2.7s forwards}
.Rf .r-beam{transform-box:fill-box;transform-origin:100% 50%;animation:r-sweep 9s ease-in-out infinite alternate}
.Rf .r-halo{transform-box:fill-box;transform-origin:center;animation:r-halo 2s ease-out infinite}
.Rf .r-off{opacity:0;animation:r-offw 11s ease-in-out infinite}
.Rf .r-sat{animation:r-sat 70s linear 8s infinite;transform:translate(-20px,70px)}
.Rf .r-satb{animation:r-bl 1.6s steps(1) infinite}
.Rf .r-bird{animation:r-bird 46s linear infinite;transform:translate(-80px,0)}
.Rf .r-wing{transform-box:fill-box;transform-origin:50% 100%;animation:r-flap .55s ease-in-out infinite alternate}
.Rf .r-bulb{animation:r-bulb 3.2s ease-in-out infinite alternate}
.Rf .r-note{opacity:0;animation:r-note 6s ease-out infinite}
.Rf .r-pulse{animation:r-scr 2.4s ease-in-out infinite alternate}
.Rf .r-moonb{animation:r-moon 9s ease-in-out infinite alternate}
.Rf .r-mist{animation:r-mist 70s linear infinite}
.Rf .r-car2{animation:r-car2 19s linear 9s infinite;transform:translateX(930px)}
.Rf .r-dist{animation:r-tw 5s ease-in-out infinite alternate}
@keyframes r-sweep{from{transform:rotate(-16deg)}to{transform:rotate(14deg)}}
@keyframes r-halo{0%{opacity:.55;transform:scale(.6)}100%{opacity:0;transform:scale(3)}}
@keyframes r-offw{0%,86%,100%{opacity:0}90%,95%{opacity:1}}
@keyframes r-sat{from{transform:translate(-20px,70px)}to{transform:translate(930px,22px)}}
@keyframes r-bird{from{transform:translate(-80px,0)}to{transform:translate(1000px,-26px)}}
@keyframes r-flap{from{transform:scaleY(1)}to{transform:scaleY(-.5)}}
@keyframes r-bulb{from{opacity:.35}to{opacity:1}}
@keyframes r-note{0%{opacity:0;transform:translate(0,0)}15%{opacity:.85}100%{opacity:0;transform:translate(10px,-34px)}}
@keyframes r-scr{from{opacity:.05}to{opacity:.22}}
@keyframes r-moon{from{opacity:.75}to{opacity:1}}
@keyframes r-mist{from{transform:translateX(-200px)}to{transform:translateX(1100px)}}
@keyframes r-car2{from{transform:translateX(930px)}to{transform:translateX(-40px)}}
${RM('.Rf .r-late{opacity:1;animation:none}.Rf .r-off,.Rf .r-sat,.Rf .r-bird,.Rf .r-note,.Rf .r-halo,.Rf .r-car2,.Rf .r-mist{display:none}.Rf .r-beam,.Rf .r-bulb,.Rf .r-pulse,.Rf .r-moonb,.Rf .r-wing,.Rf .r-dist{animation:none}')}
</style>`,1);
  s=s.replace('</defs>',`<linearGradient id="rBeam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffd0d6" stop-opacity=".16"/><stop offset="1" stop-color="#ffd0d6" stop-opacity="0"/></linearGradient>
<radialGradient id="rLamp"><stop offset="0" stop-color="#ffd98a" stop-opacity=".5"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
<linearGradient id="rMist" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e0805e" stop-opacity=".16"/><stop offset="1" stop-color="#e0805e" stop-opacity="0"/></linearGradient>
<linearGradient id="rRef" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc857" stop-opacity=".10"/><stop offset="1" stop-color="#ffc857" stop-opacity="0"/></linearGradient></defs>`,1);
  /* moon breathes */
  s=s.replace('<circle cx="820" cy="76" r="74" fill="url(#rMoon)"/>','<circle class="r-moonb" cx="820" cy="76" r="74" fill="url(#rMoon)"/>');
  /* sky layer: satellite, birds, distant skyline */
  let dist='',x=0;while(x<900){const w=10+Q()*16,h=28+Q()*46;dist+=`<rect x="${x.toFixed(1)}" y="${(gy-h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="#1c1546" opacity=".55"/>`;
    if(Q()<.45)dist+=`<rect class="r-dist" x="${(x+3).toFixed(1)}" y="${(gy-h+6+Q()*h*.5).toFixed(1)}" width="2" height="2" fill="#ffc857" opacity=".7" style="animation-delay:${(Q()*5).toFixed(1)}s"/>`;x+=w+Q()*4}
  const bird=(dx,dy,dl)=>`<g class="r-bird" style="animation-delay:${dl}s"><g transform="translate(${dx} ${dy})"><path class="r-wing" d="M-4 0Q-2 -3.2 0 0Q2 -3.2 4 0" fill="none" stroke="#d9c9ff" stroke-opacity=".7" stroke-width="1.1" stroke-linecap="round"/></g></g>`;
  const sky=`<g class="r-late">${dist}</g>
<g class="r-sat"><circle r="1.4" fill="#fff"/><circle class="r-satb" r="3.4" fill="#fff" opacity=".35"/></g>
${bird(0,170,12)}${bird(16,160,12.4)}${bird(30,176,12.9)}${bird(8,186,13.3)}`;
  s=s.replace(/(<path d="M0 372 0 340)/,sky+'$1');
  /* roof furniture, beacon, antennas, window flicker, fairy lights: one delayed layer above the buildings */
  let ex='',off='';
  for(let w=0;w<53;w++){if(w===pw||w===cw||w===antW||w===ant2)continue;const x0=bx+w*pitch,y0=roofY(w);
    if(w%7===3)ex+=`<g fill="#2c2358"><rect x="${x0+2}" y="${y0-9}" width="10" height="9" rx="1.5"/><path d="M${x0+1} ${y0-9}L${x0+7} ${y0-14}L${x0+13} ${y0-9}z" fill="#3a2f70"/><path d="M${x0+3} ${y0}v3M${x0+11} ${y0}v3" stroke="#2c2358" stroke-width="1.2"/></g>`;
    else if(w%5===2)ex+=`<rect x="${x0+3}" y="${y0-5}" width="8" height="5" rx="1" fill="#33296a"/><path d="M${x0+5} ${y0-3}h4" stroke="#4a3d8a"/>`;
    for(let d=0;d<7;d++){const g=grid[w][d];if(g&&g.l>=1&&g.l<=3&&Q()<.05)off+=`<rect class="r-off" x="${x0+3}" y="${y0+8+d*10}" width="8" height="6" rx="1" fill="#241d4a" style="animation-delay:${(Q()*11).toFixed(1)}s;animation-duration:${(9+Q()*7).toFixed(1)}s"/>`}}
  const beacon=(w,main)=>{const ax=bcx(w),ay=roofY(w)-15;return `<path d="M${ax} ${ay+15}V${ay}" stroke="#51406b" stroke-width="1.5"/>${main?`<g transform="translate(${ax} ${ay})"><path class="r-beam" d="M0 0L-120 -16L-120 16z" fill="url(#rBeam)"/></g>`:''}<circle class="r-halo" cx="${ax}" cy="${ay}" r="3" fill="#ff5d6c"/><circle class="r-blink" cx="${ax}" cy="${ay}" r="2" fill="#ff5d6c"/>`};
  const fx0=bcx(pw-6),fy0=roofY(pw-6)-2,fx1=bcx(pw-2),fy1=roofY(pw-2)-2,mx=(fx0+fx1)/2,my=Math.max(fy0,fy1)+16;
  let bulbs='';for(let k=1;k<=6;k++){const t=k/7,bxp=(1-t)*(1-t)*fx0+2*t*(1-t)*mx+t*t*fx1,byp=(1-t)*(1-t)*fy0+2*t*(1-t)*my+t*t*fy1;
    bulbs+=`<circle class="r-bulb" cx="${bxp.toFixed(1)}" cy="${byp.toFixed(1)}" r="2.4" fill="${k%2?'#ffc857':'#ff9ecb'}" style="animation-delay:${(k*.45).toFixed(2)}s"/>`}
  const fairy=`<path d="M${fx0} ${fy0}Q${mx} ${my} ${fx1} ${fy1}" fill="none" stroke="#8a78c8" stroke-width="1"/>${bulbs}`;
  const layer=`<g class="r-late">${ex}${beacon(antW,true)}${beacon(ant2,false)}${fairy}</g><g class="r-late" style="animation-delay:3s">${off}</g>`;
  s=s.replace('<rect y="372" width="900" height="58" fill="#0d0a22"/>',layer+'<rect y="372" width="900" height="58" fill="#0d0a22"/>',1);
  /* street: reflections, mist, lamps, second car */
  let lamps='';for(let k=0;k<7;k++){const lx=60+k*136;lamps+=`<circle cx="${lx}" cy="${gy-3}" r="15" fill="url(#rLamp)" class="r-dist" style="animation-delay:${k*.7}s"/><path d="M${lx} ${gy+1}V${gy-17}q0 -3 -4 -3" fill="none" stroke="#3a2f70" stroke-width="1.4"/><circle cx="${lx-4}" cy="${gy-19}" r="1.5" fill="#ffd98a"/><ellipse cx="${lx-3}" cy="${gy+8}" rx="16" ry="2.5" fill="#ffc857" opacity=".08"/>`}
  const street=`<rect y="${gy+2}" width="900" height="24" fill="url(#rRef)"/><rect y="${gy-34}" width="900" height="34" fill="url(#rMist)"/><g opacity=".5"><ellipse class="r-mist" cx="0" cy="${gy-6}" rx="120" ry="7" fill="#e7a8c0" opacity=".12"/><ellipse class="r-mist" style="animation-delay:-35s" cx="0" cy="${gy-2}" rx="90" ry="5" fill="#e7a8c0" opacity=".1"/></g>
<g class="r-late">${lamps}</g>
<g class="r-car2"><rect x="0" y="${gy+17}" width="16" height="5" rx="2" fill="#3a2f70"/><circle cx="2" cy="${gy+19.5}" r="1.5" fill="#ff7a7a"/><circle cx="14" cy="${gy+19.5}" r="1.3" fill="#fff4c2"/></g>`;
  s=s.replace(/(<g class="r-car">)/,street+'$1',1);
  /* dev: headphones, screen pulse, floating notes */
  s=s.replace('<circle cx="26" cy="-19" r="9" fill="#8bffd8" opacity=".08"/>','<circle class="r-pulse" cx="26" cy="-19" r="9" fill="#8bffd8"/>');
  s=s.replace('<circle cx="3.2" cy="-35" r="1" fill="#241a3c"/>','<circle cx="3.2" cy="-35" r="1" fill="#241a3c"/><path d="M-8.4 -36Q-1 -48 6.6 -36" fill="none" stroke="#ffc857" stroke-width="1.5" stroke-linecap="round"/><rect x="-10.6" y="-37" width="3.4" height="6" rx="1.7" fill="#ffc857"/><rect x="5.6" y="-37" width="3.4" height="6" rx="1.7" fill="#ffc857"/>');
  const hx=bcx(pw)-6, hy=py-62;
  const note=(dx,dl)=>`<g class="r-note" style="animation-delay:${dl}s"><g transform="translate(${hx+dx} ${hy})"><circle cx="0" cy="0" r="2.2" fill="#ffd98a"/><path d="M2 0V-9q3 1 4 4" fill="none" stroke="#ffd98a" stroke-width="1.3" stroke-linecap="round"/></g></g>`;
  s=s.replace('<text class="r-t r-fade"',`<g class="r-late" style="animation-delay:4s">${note(-8,0)}${note(4,2.2)}${note(-2,4.1)}</g><text class="r-t r-fade"`,1);
  return s}

  return detailLayers().replace("<svg ", `<svg ${SVG_NS} `);
}
