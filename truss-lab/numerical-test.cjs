const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/truss-lab.html','utf8');
const source=html.match(/<script id="truss-core">([\s\S]*?)<\/script>/)[1];
const C=vm.runInNewContext(source+';TrussCore;');
const E=200e9,A=400e-6,P=1e4;let checks=0,maxRelative=0,maxResidual=0,maxEquilibrium=0;
function near(actual,expected,tol=1e-8){const relative=Math.abs(actual-expected)/Math.max(1,Math.abs(expected));assert(relative<=tol,`${actual} != ${expected} (${relative})`);maxRelative=Math.max(maxRelative,relative);checks++;}
const single={nodes:[[0,0],[2,0]],members:[[0,1]],fixed:[0,1,3]};
const axial=C.solve(single,E,A,[0,0,P,0]);near(axial.u[2],P*2/(E*A),1e-12);near(axial.R[0],-P);near(axial.bars[0].N,P);
const triangle={nodes:[[0,0],[8,0],[4,2]],members:[[0,1],[0,2],[2,1]],fixed:[0,1,3]};
const tri=C.solve(triangle,E,A,[0,0,0,0,0,-P]);near(tri.R[1],P/2);near(tri.R[3],P/2);near(tri.bars[0].N,P);near(tri.bars[1].N,-P*Math.sqrt(5)/2);near(tri.bars[2].N,-P*Math.sqrt(5)/2);near(tri.u[4],tri.u[2]/2);near(tri.u[5],-P*(8+5*Math.sqrt(5))/(E*A),1e-12);
const outputs={};
for(const name of ['triangle','warren','pratt']){
 const m=C.preset(name);assert.equal(m.members.length,2*m.nodes.length-3);assert.equal(new Set(m.members.map(([a,b])=>[a,b].sort().join(','))).size,m.members.length);
 for(const x of [0,.001,.4,1,2,3.71,4,5.2,7.999,8])for(const load of [0,10000,30000]){
 const F=C.deckLoad(m,x,load);near(F.reduce((s,v,i)=>s+(i%2?v:0),0),-load);near(m.nodes.reduce((s,p,i)=>s+p[0]*F[2*i+1],0),-load*x);
 const r=C.solve(m,E,A,F);maxResidual=Math.max(maxResidual,r.residual);maxEquilibrium=Math.max(maxEquilibrium,r.equilibrium);assert(r.residual<1e-8&&r.equilibrium<1e-8);near(r.R[1],load*(1-x/8));near(r.R[m.deck.at(-1)*2+1],load*x/8);
 if(!load){assert(r.u.every(v=>v===0));assert(r.bars.every(b=>b.N===0));assert(r.R.every(v=>v===0));}
 }
 const F=C.deckLoad(m,4,P),r=C.solve(m,E,A,F),twice=C.solve(m,E,A,F.map(v=>v*2)),e2=C.solve(m,E*2,A,F),a2=C.solve(m,E,A*2,F);
 for(let i=0;i<r.u.length;i++){near(twice.u[i],2*r.u[i],1e-12);near(twice.R[i],2*r.R[i]);near(e2.u[i],r.u[i]/2,1e-12);near(a2.u[i],r.u[i]/2,1e-12);}
 r.bars.forEach((b,i)=>near(twice.bars[i].N,2*b.N));
 for(let i=0;i<m.nodes.length;i++){const [x,y]=m.nodes[i],j=m.nodes.findIndex(p=>p[0]===8-x&&p[1]===y);near(r.u[i*2+1],r.u[j*2+1],1e-12);near(r.u[i*2]+r.u[j*2],r.u[m.deck.at(-1)*2],1e-12);}
 outputs[name]={nodes:m.nodes.length,members:m.members.length,maxDisplacementMm:r.maxU*1000,maxForceKN:Math.max(...r.bars.map(b=>Math.abs(b.N)))/1000};
 // All allowed material extremes remain finite and satisfy residual limits.
 for(const e of [70e9,210e9])for(const a of [200e-6,1e-3]){const r=C.solve(m,e,a,C.deckLoad(m,3.71,30000));assert(Number.isFinite(r.maxU)&&r.residual<1e-8);}
}
assert.throws(()=>C.solve({...single,fixed:[]},E,A,[0,0,P,0]),/특이/);
assert.throws(()=>C.solve({...single,nodes:[[0,0],[0,0]]},E,A,[0,0,P,0]),/길이/);
assert.throws(()=>C.solve({...single,members:[[0,1],[1,0]]},E,A,[0,0,P,0]),/중복/);
assert.throws(()=>C.linearSolve([[1,0],[0,1e-14]],[0,1]),/특이/);
const unstable=C.preset('pratt');unstable.members.pop();assert.throws(()=>C.solve(unstable,E,A,C.deckLoad(unstable,4,P)),/특이/);
for(const [,script] of html.matchAll(/<script(?: type="module")?>([\s\S]*?)<\/script>/g))new Function('return (async()=>{'+script+'})');
console.log(JSON.stringify({status:'PASS',scalarComparisons:checks,maxRelative,maxResidual,maxEquilibrium,outputs},null,2));
