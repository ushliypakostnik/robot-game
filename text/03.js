/* eslint-disable dot-notation,no-unused-vars */
import * as Three from "three";

import {
  DESIGN,
  // ...
} from '@/utils/constants';

import {
  loaderDispatchHelper,
  // ...
} from '@/utils/utilities';

function Hero() {
  const audioLoader = new Three.AudioLoader();
  let steps;
  let speed;
  // ...

  this.init = (
    scope,
    // ...
  ) => {
    audioLoader.load('./audio/steps.mp3', (buffer) => {
      steps = scope.audio.addAudioToHero(scope, buffer, 'steps', DESIGN.VOLUME.hero.step, false);
      loaderDispatchHelper(scope.$store, 'isStepsLoaded');
    });
  };

  this.setHidden = (scope, isHidden) => {
    if (isHidden) {
      // ...
      steps.setPlaybackRate(0.5);
    } else {
      // ...
      steps.setPlaybackRate(1);
    }
  };

  this.setRun = (scope, isRun) => {
    if (isRun && scope.keyStates['KeyW']) {
      steps.setVolume(DESIGN.VOLUME.hero.run);
      steps.setPlaybackRate(2);
    } else {
      steps.setVolume(DESIGN.VOLUME.hero.step);
      steps.setPlaybackRate(1);
    }
  };

  // ...

  this.animate = (scope) => {
    if (scope.playerOnFloor) {
      if (!scope.isPause) {
        // ...

        // Steps sound
        if (steps) {
          if (scope.keyStates['KeyW']
            || scope.keyStates['KeyS']
            || scope.keyStates['KeyA']
            || scope.keyStates['KeyD']) {
            if (!steps.isPlaying) {
              speed = scope.isHidden ? 0.5 : scope.isRun ? 2 : 1;
              steps.setPlaybackRate(speed);
              steps.play();
            }
          }
        }
      } else {
        if (steps && steps.isPlaying) steps.pause();

        // ...
      }
    }
  };
}

export default Module;
