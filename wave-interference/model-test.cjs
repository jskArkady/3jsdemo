const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
// Enable module syntax checks when invoked with plain `node`.
if(typeof vm.SourceTextModule!=='function'){
 if(process.execArgv.includes('--experimental-vm-modules'))throw Error('This Node runtime does not provide vm.SourceTextModule with --experimental-vm-modules enabled.');
 const result=require('node:child_process').spawnSync(process.execPath,[...process.execArgv,'--experimental-vm-modules',__filename,...process.argv.slice(2)],{stdio:'inherit'});
 if(result.error)throw result.error;
 process.exit(result.status??1);
}
const html=fs.readFileSync(__dirname+'/wave-interference.html','utf8'),source=html.match(/<script id="wave-model">([\s\S]*?)<\/script>/)[1];
const model=vm.runInNewContext(source+';({sample,advance,defaults,setProbe,DT,TAU})');
new vm.SourceTextModule(html.match(/<script type="module">([\s\S]*?)<\/script>/)[1]);
const {sample,advance,defaults,setProbe,DT,TAU}=model;let p=defaults();
let constructive=0,destructive=0,periodic=0,intensityRelative=0;
for(let j=0;j<50;j++){p.theta=j*.71;let s=sample(p,0,j/10-2.5);constructive=Math.max(constructive,Math.abs(s.h-2*s.h1));p.phase=180;s=sample(p,0,j/10-2.5);destructive=Math.max(destructive,Math.abs(s.h));p.phase=0;const before=sample(p,.73,-1.43).h;advance(p,1/p.frequency);periodic=Math.max(periodic,Math.abs(before-sample(p,.73,-1.43).h));}
assert(constructive<1e-9);assert(destructive<1e-9);assert(periodic<1e-9);
for(const frequency of [.3,1,2])for(const phase of [-153,0,87,180])for(const [x,z] of [[0,1.5],[-1.2,0],[4,3]]){p={...defaults(),frequency,phase};let sum=0;const n=4096;for(let i=0;i<n;i++){p.theta=TAU*i/n;sum+=sample(p,x,z).h**2/n;}const exact=sample(p,x,z).intensity;if(exact>1e-12)intensityRelative=Math.max(intensityRelative,Math.abs(sum-exact)/exact);else assert(sum<1e-20);}
assert(intensityRelative<1e-4);
p=defaults();p.on1=false;p.on2=false;for(const [x,z] of [[0,0],[-1.2,0],[1.2,0],[-4,-3],[4,3]]){const s=sample(p,x,z);assert.equal(s.h,0);assert.equal(s.intensity,0);}
p=defaults();for(const amplitude of [0,.1])for(const frequency of [.3,2])for(const [x,z] of [[-1.2,0],[1.2,0],[-4,-3],[4,3]]){Object.assign(p,{amplitude,frequency});assert(Object.values(sample(p,x,z)).every(Number.isFinite));}
setProbe(p,999,-999);assert.equal(p.x,4);assert.equal(p.z,-3);
p=defaults();for(let i=0;i<100000;i++)advance(p,DT);assert(p.theta>=0&&p.theta<TAU);const theta=p.theta;p.frequency=2;assert.equal(p.theta,theta);advance(p,DT);const phaseStepError=Math.abs(p.theta-(theta+TAU*2*DT)%TAU);assert(phaseStepError<1e-12);
console.log(JSON.stringify({constructive,destructive,periodic,intensityRelative,phaseStepError,longRunTime:p.time,syntax:'passed',checks:'special values, source centers, zero amplitude, sources off, probe clamp, 100000 steps, phase wrap/frequency change'},null,2));
