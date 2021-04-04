/* eslint-disable dot-notation,prefer-destructuring */
import * as Three from 'three';

import { DESIGN } from '@/utils/constants';

import {
  loaderDispatchHelper,
} from '@/utils/utilities';

function Atmosphere() {
  const audioLoader = new Three.AudioLoader();

  this.init = (scope) => {
    audioLoader.load('./audio/wind.mp3', (buffer) => {
      scope.audio.addAudioToHero(scope, buffer, 'wind', DESIGN.VOLUME.wind, true);
      loaderDispatchHelper(scope.$store, 'isWindLoaded');
    });
  };

  this.animate = (scope) => {
    scope.audio.startHeroNotPlayingSound('wind');
  };
}

export default Atmosphere;
