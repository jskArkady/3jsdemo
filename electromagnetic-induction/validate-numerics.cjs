const fs=require('fs'),vm=require('vm'),assert=require('assert');
// Enable module syntax checks when invoked with plain `node`.
if(typeof vm.SourceTextModule!=='function'){
 if(process.execArgv.includes('--experimental-vm-modules'))throw Error('This Node runtime does not provide vm.SourceTextModule with --experimental-vm-modules enabled.');
 const result=require('node:child_process').spawnSync(process.execPath,[...process.execArgv,'--experimental-vm-modules',__filename,...process.argv.slice(2)],{stdio:'inherit'});
 if(result.error)throw result.error;
 process.exit(result.status??1);
}
const html=fs.readFileSync(__dirname+'/electromagnetic-induction.html','utf8');const context={};vm.runInNewContext(html.match(/<script id="physics">([\s\S]*?)<\/script>/)[1]+';this.model=Induction',context);const {sample,advance,H}=context.model;
new vm.SourceTextModule(html.match(/<script type="module">([\s\S]*?)<\/script>/)[1]);
const p={rpm:30,B:.5,N:40,A:.05,R:40,polarity:1},peak=Math.PI;
const close=(a,b,tol=1e-12)=>assert(Math.abs(a-b)<=tol,`${a} != ${b}`);
close(sample(p,0).e,0);close(sample(p,Math.PI).e,0);close(sample(p,Math.PI/2).e,peak);
for(const prop of ['rpm','B']){const s=sample({...p,[prop]:0},.8);close(s.e,0);close(s.i,0);}
for(const prop of ['rpm','B','N','A'])close(sample({...p,[prop]:p[prop]*2},Math.PI/2).e,2*peak);
close(sample({...p,R:80},Math.PI/2).i,sample(p,Math.PI/2).i/2);
for(const prop of ['rpm','polarity'])close(sample({...p,[prop]:-p[prop]},.7).e,-sample(p,.7).e);
let derivativeError=0;const dt=1e-5;for(let j=0;j<1000;j++){const theta=j/1000*2*Math.PI;const derivative=(sample(p,advance(theta,p.rpm,dt)).lambda-sample(p,advance(theta,p.rpm,-dt)).lambda)/(2*dt);derivativeError=Math.max(derivativeError,Math.abs(derivative+sample(p,theta).e)/peak);}assert(derivativeError<1e-5);
let sum=0,sumi=0,sum2=0,powerError=0;for(let j=0;j<24000;j++){const s=sample(p,j/24000*2*Math.PI);sum+=s.e;sumi+=s.i;sum2+=s.e*s.e;close(s.i,s.e/p.R);powerError=Math.max(powerError,Math.abs(s.power-s.e*s.i));}const mean=sum/24000,meanI=sumi/24000,rmsError=Math.abs(Math.sqrt(sum2/24000)-peak/Math.sqrt(2));close(mean,0);close(meanI,0);assert(rmsError<1e-12);
let theta=0;for(let j=0;j<480;j++)theta=advance(theta,p.rpm,H);const phaseError=Math.abs(theta-2*Math.PI);assert(phaseError<1e-12);
for(let j=0;j<480;j++)theta=advance(theta,-p.rpm,H);close(theta,0);
for(const rpm of [-120,0,120])for(const B of [0,1])for(const N of [1,100])for(const A of [.01,.1])for(const R of [10,100])assert(Object.values(sample({rpm,B,N,A,R,polarity:-1},1.2)).every(Number.isFinite));
console.log(JSON.stringify({passed:true,peakVoltage:peak,dt,derivativeRelativeError:derivativeError,meanVoltage:mean,meanCurrent:meanI,rmsError,powerError,phaseError,fixedStep:H},null,2));
