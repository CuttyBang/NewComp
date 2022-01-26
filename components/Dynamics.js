import { context } from './Context.js'

export default function Dynamics(th, kn, rt, at, rl) {

  let makeupAuto = (comp) => {
    let magicCoefficient = 3, // raise me if the output is too hot
        c = comp;
    return -(c.threshold.value - c.threshold.value / c.ratio.value) / magicCoefficient;
  }

  const dynamics = context.createDynamicsCompressor();
  // const auto = autoMakeup(dynamics);
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
  output.gain.value = 1;
  makeupGain.gain.value = 0.5;


  function threshold(amt) {
    dynamics.threshold.exponentialRampToValueAtTime(amt, 0.25);
    return dynamics.threshold.value;
  }

  function knee(amt) {
    dynamics.knee.exponentialRampToValueAtTime(amt, 0.25);
    return dynamics.knee.value;
  }

  function ratio(amt) {
    dynamics.ratio.exponentialRampToValueAtTime(amt, 0.25);
    return dynamics.ratio.value;
  }

  function attack(amt) {
    dynamics.attack.exponentialRampToValueAtTime(amt, 0.25);
    return dynamics.attack.value;
  }

  function release(amt) {
    dynamics.release.exponentialRampToValueAtTime(amt, 0.25);
    return dynamics.release.value;
  }

  function makeup(amt) {
     makeupGain.gain.exponentialRampToValueAtTime(amt, 0.25);
    return makeupGain.gain.value;
  }

  function autoMakeup() {
   makeupGain.gain.value = makeupAuto(dynamics);
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }


  input.connect(dynamics);
  dynamics.connect(makeupGain);
  makeupGain.connect(output);



  return {input, output, autoMakeup, makeup, attack, knee, ratio, release, threshold, to};
};
