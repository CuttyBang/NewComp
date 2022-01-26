import { context } from './Context.js'

export default function Dynamics(th, kn, rt, at, rl) {

  let autoMakeup = (comp) => {
    let magicCoefficient = 3, // raise me if the output is too hot
        c = comp;
    return -(c.threshold.value - c.threshold.value / c.ratio.value) / magicCoefficient;
  }

  const dynamics = context.createDynamicsCompressor();
  const auto = autoMakeup(dynamics);
  const input = context.createGain();
  const output = context.createGain();
  const makeupGain = context.createGain();

  if (th) {
    dynamics.threshold.value = th;
  } else {
    dynamics.threshold.value = -20;
  }

  if (kn) {
    dynamics.knee.value = kn;
  } else {
    dynamics.knee.value = 20;
  }

  if (rt) {
    dynamics.ratio.value = rt;
  } else {
    dynamics.ratio.value = 4
  }

  if (at) {
    dynamics.attack.value = at;
  } else {
    dynamics.attack.value = 0.09
  }

  if (rl) {
    dynamics.release.value = rl;
  } else {
    dynamics.release.value = 0.500;
  }

  // attack: 0-1 .003
    // knee: 0-40 30
    // ratio: 1-20 12
    // release: 0-1 0.250
    // thresh: -100 - 0 -24

  // dynamics.threshold.value = -20;
  // dynamics.knee.value = 20;
  // dynamics.ratio.value = 4;
  // dynamics.attack.value = 0.09;
  // dynamics.release.value = 0.500;

  // let knee = dynamics.knee;
  // let ratio = dynamics.ratio;
  // let release = dynamics.release;
  // let threshold = dynamics.threshold;
  // let makeup = makeupGain.gain;

  input.gain.value = 0.8;
  makeup.value = autoMakeup(dynamics);
  output.gain.value = 1


  function threshold(amt) {
    let thr = dynamics.threshold;
    thr.exponentialRampToValueAtTime(amt, 0.25);
    return thr.value;
  }

  function knee(amt) {
    let kne = dynamics.knee;
    kne.exponentialRampToValueAtTime(amt, 0.25);
    return kne.value;
  }

  function ratio(amt) {
    let rto = dynamics.knee;
    rto.exponentialRampToValueAtTime(amt, 0.25);
    return rto.value;
  }

  function attack(amt) {
    let att = dynamics.attack;
    att.exponentialRampToValueAtTime(amt, 0.25);
    return att.value;
  }

  function release(amt) {
    let rel = dynamics.attack;
    rel.exponentialRampToValueAtTime(amt, 0.25);
    return rel.value;
  }

  function makeup(amt) {
    let mku = dynamics.knee;
    mku.exponentialRampToValueAtTime(amt, 0.25);
    return mku.value;
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }


  input.connect(dynamics);
  dynamics.connect(makeupGain);
  makeupGain.connect(output);



  return {input, output, makeup, attack, knee, ratio, release, threshold, to};
};
