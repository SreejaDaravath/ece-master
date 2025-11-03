// Node test for simulation.computeVout
try{
  const sim = require('./simulation.js');
  const approx = (a,b,eps=1e-9)=> Math.abs(a-b) <= eps;
  const tests = [
    {Vin:5, R1:1000, R2:1000, expect:2.5},
    {Vin:10, R1:1000, R2:100, expect:10*(100/(1100))},
    {Vin:3.3, R1:0, R2:1000, expect:3.3},
    {Vin:5, R1:1000, R2:0, expect:0}
  ];
  let ok=true;
  for(const t of tests){
    const got = sim.computeVout(t.Vin,t.R1,t.R2);
    const exp = t.expect;
    if(!approx(got,exp,1e-6)){
      console.error('FAIL', t, 'got', got, 'expected', exp);
      ok=false;
    } else {
      console.log('PASS', t, '->', got.toFixed(6));
    }
  }
  if(!ok) process.exit(2);
  console.log('All tests passed');
} catch(e){
  console.error('Test runner error:', e && e.stack ? e.stack : e);
  process.exit(3);
}
