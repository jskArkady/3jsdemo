const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync(__dirname+'/linear-transform.html','utf8');
const core=html.match(/<script id="math-core">([\s\S]*?)<\/script>/)[1];const M=vm.runInNewContext(core+';LinearMath');
new vm.Script(core);fs.writeFileSync('/tmp/linear-transform-module.mjs',html.match(/<script type="module">([\s\S]*?)<\/script>/)[1]);
let maxResidual=0,maxOrthogonal=0,maxProduct=0,count=0;
function near(a,b,tol=1e-9){assert(Math.abs(a-b)<=tol,`${a} != ${b}`);}
function checkEigen(a){const e=M.jacobi(a),scale=Math.max(1,Math.hypot(...a));e.values.forEach((lambda,i)=>{const v=e.vectors[i],av=M.apply(a,v);const residual=Math.hypot(...av.map((x,j)=>x-lambda*v[j]))/scale;maxResidual=Math.max(maxResidual,residual);assert(residual<1e-9);e.vectors.forEach((w,j)=>{const err=Math.abs(v.reduce((s,x,k)=>s+x*w[k],0)-(i===j?1:0));maxOrthogonal=Math.max(maxOrthogonal,err);assert(err<1e-9);});});}
function check(a,rank,det){const b=M.analyze(a);if(rank!==undefined)assert.equal(b.rank,rank);if(det!==undefined)near(b.det,det);checkEigen(M.ata(a));if(b.symmetric)checkEigen(a);const error=Math.abs(b.sigma.reduce((s,x)=>s*x,1)-Math.abs(b.det))/Math.max(1,Math.abs(b.det));maxProduct=Math.max(maxProduct,error);assert(error<1e-7,`product ${error}`);count++;return b;}
check([1e-200,0,0,0,1e-200,0,0,0,1e-200],3,0);check([1e-5,0,0,0,1e-5,0,0,0,1e-5],3,1e-15);check(M.I,3,1);check(M.presets.stretch,3,1.512);check(M.presets.shear,3,1);check(M.presets.reflection,3,-1);check(M.presets.projection,2,0);check(Array(9).fill(0),0,0);
const rotation=check(M.presets.rotation,3,1);M.ata(M.presets.rotation).forEach((x,i)=>near(x,M.I[i]));rotation.sigma.forEach(x=>near(x,1));assert(!rotation.symmetric);
assert.deepEqual(Array.from(M.apply(M.presets.shear,[1,2,3])),[3.4,2,3]);check(M.mix(M.presets.reflection,.5),2,0);check(M.presets.symmetric,3,1.12);
const tinyDistinct=M.analyze([1e-200,0,0,0,2e-200,0,0,0,3e-200]);assert.equal(tinyDistinct.repeatedEigen,false);assert.equal(tinyDistinct.repeatedSigma,false);assert(M.analyze(M.I).repeatedEigen);assert(M.analyze(M.I).repeatedSigma);check([1,0,0,0,1e-8,0,0,0,0],1,0);check([1e-10,0,0,0,1e-10,0,0,0,1e-10],3,1e-30);
for(const values of [Array(9).fill(''),Array(9).fill('NaN'),Array(9).fill('Infinity'),Array(9).fill('3.1')])assert.throws(()=>M.parse(values));assert.equal(M.parse(M.I.map(String)).length,9);
let seed=4;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/2**32*6-3;};
for(let i=0;i<1000;i++){const a=Array.from({length:9},rand);check(a);const b=a.map((x,k)=>(x+a[3*(k%3)+Math.floor(k/3)])/2);check(b);}
console.log(JSON.stringify({matrices:count,maxNormalizedEigenResidual:maxResidual,maxOrthogonalityError:maxOrthogonal,maxRelativeSingularProductError:maxProduct},null,2));
