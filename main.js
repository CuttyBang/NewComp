import './style.scss'

import { context, OUTPUT } from './components/Context.js'
import {drum_break} from './components/audio/break.js'
import { createSource } from './components/Source.js'
import { createMeter } from './components/Meter.js'
import Dynamics from './components/Dynamics.js'
import Gain from './components/Gain.js'


let isPlaying = false;

const inMeter = document.getElementById('inMeter')
const thresholdKnob = document.getElementById('threshold')
const ratioKnob = document.getElementById('ratio')
const attackKnob = document.getElementById('attack')
const releaseKnob = document.getElementById('release')
const makeupKnob = document.getElementById('makeup')

const sourceGain = context.createGain();
sourceGain.gain.value = 0.8;
const dryGain = context.createGain();
dryGain.gain.value = 0.8;
const wetGain = context.createGain();
wetGain.gain.value = 0.8;
const wetGain2 = context.createGain();
wetGain2.gain.value = 0.8;
const outputGain = context.createGain();
outputGain.gain.value = 1;

const dynamics = Dynamics();
createMeter(wetGain, inMeter);

createMeter(outputGain, outMeter);





sourceGain.connect(dryGain);
sourceGain.connect(wetGain);
wetGain.connect(dynamics.input);
dynamics.to(outputGain);
outputGain.connect(OUTPUT);

function init() {
  const source = createSource(drum_break);
  source.audioSource.connect(sourceGain);
  source.audioSource.start();
  isPlaying = true;

  const stopButton = document.getElementById('stopButton');
  stopButton.onclick = function() {
    source.audioSource.stop();
    isPlaying = false;
  };
}

if (isPlaying) {
  startButton.disabled = true;
} else {
  startButton.disabled = false;
}

startButton.addEventListener('click', () => {
  if (isPlaying) { return } else { init() };
});

thresholdKnob.addEventListener('input', () => {
  dynamics.threshold(thresholdKnob.value);
});

ratioKnob.addEventListener('input', () => {
  dynamics.ratio(ratioKnob.value);
});

attackKnob.addEventListener('input', () => {
  dynamics.attack(attackKnob.value);
});

releaseKnob.addEventListener('input', () => {
  dynamics.release(releaseKnob.value);
});

makeupKnob.addEventListener('input', () => {
  dynamics.makeup(makeupKnob.value);
});
