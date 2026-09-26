const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(__dirname+'/heat-diffusion.html','utf8'),source=html.match(/<script id="physics">([\s\S]*?)<\/script>/)[1];
const ctx={};vm.runInNewContext(source+';globalThis.Heat=Heat;',ctx);const H=ctx.Heat,results={};
function run(s,n,dt=s.dt){for(let i=0;i<n;i++)H.step(s,dt);}
let s=H.create();s.a.fill(42);run(s,100);assert(s.a.every(v=>v===42));results.uniformError=0;
s=H.create();const start=H.stats(s);for(let i=0;i<1000;i++){H.step(s);const st=H.stats(s);assert(st.min>=start.min-1e-12&&st.max<=start.max+1e-12);}const end=H.stats(s);results.energyRelativeDrift=Math.abs(end.energy/start.energy-1);results.meanError=Math.abs(end.mean-start.mean);assert(results.energyRelativeDrift<1e-9);assert(end.min>=start.min-1e-12&&end.max<=start.max+1e-12);
s=H.create({preset:'boundary',n:[12,8,8]});run(s,9000);let err=0;for(let z=0;z<8;z++)for(let y=0;y<8;y++)for(let x=0;x<12;x++)err=Math.max(err,Math.abs(s.a[H.index(s,x,y,z)]-(100-80*(x+.5)/12)));results.steadyMaxErrorC=err;assert(err<1e-5);
s=H.create({preset:'source'});const t0=H.stats(s).energy;run(s,400);const injected=Array.from(s.mask).reduce((a,b)=>a+b,0)*s.d.reduce((a,b)=>a*b,1)*s.m.rho*s.m.cp*s.power*s.t;results.sourceRelativeError=Math.abs((H.stats(s).energy-t0)/injected-1);assert(results.sourceRelativeError<1e-9);
function cosine(n,div=1){const s=H.create({n:[n,n*2/3,n*2/3]});for(let z=0;z<s.n[2];z++)for(let y=0;y<s.n[1];y++)for(let x=0;x<n;x++)s.a[H.index(s,x,y,z)]=60+20*Math.cos(Math.PI*(x+.5)/n);const target=5;while(s.t<target-1e-12)H.step(s,Math.min(s.dt/div,target-s.t));let err=0;for(let x=0;x<n;x++)err=Math.max(err,Math.abs(s.a[x]-(60+20*Math.cos(Math.PI*(x+.5)/n)*Math.exp(-s.alpha*(Math.PI/.12)**2*target))));return {s,err};}
results.gridErrors=[cosine(12,8).err,cosine(24,8).err];assert(results.gridErrors[1]<results.gridErrors[0]*.3);
const base=cosine(24),half=cosine(24,2),quarter=cosine(24,4);function distance(a,b){return Math.max(...a.s.a.map((v,i)=>Math.abs(v-b.s.a[i])));}results.dtDifferences=[distance(base,half),distance(half,quarter)];assert(results.dtDifferences[1]<results.dtDifferences[0]*.55);
let a=H.create({material:0}),b=H.create({material:1});run(a,100);run(b,100);results.alphaScaleMaxError=Math.max(...a.a.map((v,i)=>Math.abs(v-b.a[i])));assert(results.alphaScaleMaxError<1e-11);results.alphaTimeRatio=b.t/a.t;
results.stability=[];for(const material of [0,1])for(const preset of ['spot','boundary','source']){s=H.create({material,preset});let st=s.alpha*s.dt*s.d.reduce((r,v)=>r+1/v**2,0);assert(st<=.5);results.stability.push({material,preset,dt:s.dt,number:st});}assert.throws(()=>H.step(s,s.dt*2));
console.log(JSON.stringify(results,null,2));
