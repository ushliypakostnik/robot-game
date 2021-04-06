/* eslint-disable dot-notation,prefer-destructuring */
import * as Three from 'three';

import { DESIGN } from '@/utils/constants';

function AudioBus() {
  const pseudoGeometry = new Three.BoxBufferGeometry(1, 1, 1);
  const pseudoMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.white });
  const heroSound = new Three.Mesh(pseudoGeometry, pseudoMaterial);

  const bus = [];
  let isPlay;
  let record;

  this.init = (scope) => {
    isPlay = scope.isPause;
  };

  const addAudioToBus = (scope, id, audio, name, isLoop) => {
    if (!isLoop) audio.onEnded = () => audio.stop();

    bus.push({
      id,
      name,
      audio,
      isStopped: false,
    });
  };

  this.addAudioToHero = (scope, buffer, name, volume, isLoop) => {
    const audio = new Three.Audio(scope.listener);

    audio.setBuffer(buffer);
    audio.setVolume(volume);
    audio.setLoop(isLoop);

    addAudioToBus(scope, heroSound.id, audio, name, isLoop);

    heroSound.add(audio);
    heroSound.visible = false;

    scope.scene.add(heroSound);

    return audio;
  };

  this.addAudioToObjects = (scope, objects, buffer, element, name, volume, isLoop) => {
    let audio;
    objects.forEach((object) => {
      audio = new Three.PositionalAudio(scope.listener);

      audio.setBuffer(buffer);
      audio.setVolume(volume);
      audio.setRefDistance(DESIGN.VOLUME.positional.ref);
      audio.setMaxDistance(DESIGN.VOLUME.positional.max);
      audio.setLoop(isLoop);
      audio.setRolloffFactor(1);

      addAudioToBus(scope, object.id, audio, name, isLoop);

      object[element].add(audio);
    });
  };

  const getRecordByName = (name) => {
    return bus.find(record => record.name === name);
  };

  const getRecordByIdAndName = (id, name) => {
    return bus.find(record => record.id === id && record.name === name);
  };

  this.replayHeroSound = (name) => {
    record = getRecordByName(name);
    if (record && record.audio) {
      if (record.audio.isPlaying) record.audio.stop();
      record.audio.play();
    }
  };

  this.startHeroSound = (name) => {
    record = getRecordByName(name);
    if (record && record.audio && !record.audio.isPlaying) record.audio.play();
  };

  this.startObjectSound = (id, name) => {
    record = getRecordByIdAndName(id, name);
    if (record && record.audio && !record.audio.isPlaying) record.audio.play();
  };

  this.stopObjectSound = (id, name) => {
    record = getRecordByIdAndName(id, name);
    if (record && record.audio && record.audio.isPlaying) record.audio.stop();
  };

  this.replayObjectSound = (id, name) => {
    record = getRecordByIdAndName(id, name);
    if (record && record.audio) {
      if (!record.audio.isPlaying) record.audio.play();
      else {
        record.audio.stop();
        record.audio.play();
      }
    }
  };

  this.toggle = () => {
    isPlay = !isPlay;
    if (isPlay) {
      bus.filter(audio => audio.audio.isPlaying).forEach((audio) => {
        audio.isStopped = true;
        audio.audio.pause();
      });
    } else {
      bus.filter(audio => audio.isStopped).forEach((audio) => {
        audio.isStopped = false;
        audio.audio.play();
      });
    }
  };
}

export default AudioBus;
