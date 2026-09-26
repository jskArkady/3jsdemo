const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(__dirname+'/pid-servo.html','utf8');const source=html.match(/<script id="pid-model">([\s\S]*?)<\/script>/)[1];const ctx={};vm.createContext(ctx);vm.runInContext(source+';this.PID=PID',ctx);const M=ctx.PID;
const results={};function near(name,actual,expected,tol){const error=Math.abs(actual-expected);assert(error<=tol,`${name}: ${error} > ${tol}`);results[name]={actual,expected,error,tolerance:tol};}
function run(p,seconds,h=.005,d=0,s=M.state()){let maxI=0,peak=0,maxU=0;for(let i=0;i<Math.round(seconds/h);i++){M.advance(s,p,h,typeof d==='function'?d(s.t):d);assert(Object.values(s).every(Number.isFinite));maxI=Math.max(maxI,Math.abs(s.I));peak=Math.max(peak,s.x);maxU=Math.max(maxU,Math.abs(s.u));assert(Math.abs(s.u)<=p.limit+1e-12);}return {s,maxI,peak,maxU};}
let p={...M.defaults,kp:0,ki:0,kd:0,drag:0};let s=M.state();s.v=1.3;run(p,3,.005,0,s);near('free velocity',s.v,1.3,1e-12);near('free position',s.x,3.9,1e-11);
p.drag=.8;s=M.state();s.v=1.3;run(p,3,.005,0,s);near('damped velocity',s.v,1.3*Math.exp(-2.4),1e-12);near('damped position',s.x,1.3/.8*(1-Math.exp(-2.4)),1e-12);
p.drag=0;s=M.state();run(p,3,.005,2,s);near('constant force x',s.x,9,1e-10);near('constant force v',s.v,6,1e-10);
p={...M.defaults,kp:9,ki:0,kd:5.2,tau:0,limit:20};s=run(p,2).s;near('critical PD x(2)',s.x,1-(1+6)*Math.exp(-6),.004);const crit=run(p,10);assert(crit.peak<=1.0001);results.criticalPeak=crit.peak;
p={...M.defaults,kp:8,ki:0,kd:4,limit:20};s=run(p,60,.005,1).s;near('P disturbance offset x-r',s.x-1,1/8,1e-7);const pi=run({...p,ki:1,kd:0},120,.005,1);near('PI disturbance offset',pi.s.x-1,0,1e-6);p.ki=3;s=run(p,60,.005,1).s;near('PID disturbance offset',s.x-1,0,1e-7);
p={...M.defaults,kp:12,ki:8,kd:4,limit:2};const on=run(p,12),off=run({...p,aw:false},12);assert(on.maxI<off.maxI);assert(Math.abs(on.s.x-1)<Math.abs(off.s.x-1));results.antiWindup={on,off};
p={...M.defaults};const full=run(p,3),half=run(p,3,.0025);near('dt halving x(3)',full.s.x,half.s.x,.003);near('dt halving v(3)',full.s.v,half.s.v,.003);
s=M.state();s.v=.3;s.vf=.3;let a={...s},b={...s};M.advance(a,{...p,kp:0,ki:0,target:-1});M.advance(b,{...p,kp:0,ki:0,target:1});near('derivative kick',a.u,b.u,0);
let count=0;for(const mass of [.5,3])for(const drag of [0,3])for(const kp of [0,40])for(const ki of [0,15])for(const kd of [0,15])for(const limit of [2,20])for(const aw of [true,false]){run({...M.defaults,mass,drag,kp,ki,kd,limit,aw},10);count++;}results.finiteCornerCases=count;
let metric=M.metric(M.state(),M.defaults);s=M.state();s.r=1;s.x=1.1;s.t=.005;M.measure(metric,s,M.defaults);near('overshoot signed fraction',metric.peak,.1,1e-12);assert.equal(metric.inside,null);s.x=1;s.t=1;M.measure(metric,s,M.defaults);assert.equal(metric.inside,1);s.t=2.1;M.measure(metric,s,M.defaults);assert(s.t-metric.inside>=1);s.x=.9;M.measure(metric,s,M.defaults);assert.equal(metric.inside,null);
assert(!M.valid({...M.state(),x:2.50001}));assert(!M.valid({...M.state(),v:Infinity}));results.rangeGuard='passed';
let neg=M.metric(M.state(),{...M.defaults,target:-1});M.measure(neg,{...M.state(),x:-1.1,r:-1,t:1},{...M.defaults,target:-1});near('negative target overshoot',neg.peak,.1,1e-12);
const sineP={...M.defaults,mode:'sine'};const sine=run(sineP,10);assert(M.valid(sine.s));results.sineFinal=sine.s.x;
console.log(JSON.stringify(results,null,2));
