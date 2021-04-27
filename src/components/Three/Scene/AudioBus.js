/* eslint-disable dot-notation,prefer-destructuring */
import * as Three from 'three';

import { DESIGN } from '@/utils/constants';

function AudioBus() {
  const pseudoGeometry = new Three.BoxBufferGeometry(1, 1, 1);
  const pseudoMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.white });
  const heroSound = new Three.Mesh(pseudoGeometry, pseudoMaterial);

  let bus = [];
  let isPlay;
  let record;

  let isTime;

  this.init = (scope) => {
    isPlay = scope.isPause;
    isTime = scope.isTimeMachine;

    heroSound.visible = false;

    scope.scene.add(heroSound);
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

  const removeAudioFromBus = (scope, object, name) => {
    bus = bus.filter(record => record.id !== object.id && record.name !== name);
  };

  this.addAudioToHero = (scope, buffer, name, volume, isLoop) => {
    record = new Three.Audio(scope.listener);

    record.setBuffer(buffer);
    record.setVolume(volume);
    record.setLoop(isLoop);

    addAudioToBus(scope, heroSound.id, record, name, isLoop);

    heroSound.add(record);

    return record;
  };

  this.addAudioToObjects = (scope, objects, buffer, element, name, volume, isLoop) => {
    objects.forEach((object) => {
      record = new Three.PositionalAudio(scope.listener);

      record.setBuffer(buffer);
      record.setVolume(volume);
      record.setRefDistance(DESIGN.VOLUME.positional.ref);
      record.setMaxDistance(DESIGN.VOLUME.positional.max);
      record.setLoop(isLoop);
      record.setRolloffFactor(1);

      addAudioToBus(scope, object.id, record, name, isLoop);

      object[element].add(record);
    });
  };

  this.playAudioOnObject = (scope, object, buffer, name, volume, isRemove) => {
    record = new Three.PositionalAudio(scope.listener);

    record.setBuffer(buffer);
    record.setVolume(volume);
    record.setRefDistance(DESIGN.VOLUME.positional.ref);
    record.setMaxDistance(DESIGN.VOLUME.positional.max);
    record.setLoop(false);
    record.setRolloffFactor(1);

    addAudioToBus(scope, object.id, record, name, false);

    object.add(record);
    record.play();
    record.onEnded = () => {
      if (record && record.isPlaying) record.stop();
      removeAudioFromBus(scope, object.id, name);

      if (isRemove) scope.scene.remove(object);
    };
  };

  const getRecordByName = (name) => {
    return bus.find(record => record.name === name);
  };

  const getRecordByIdAndName = (id, name) => {
    return bus.find(record => record.id === id && record.name === name);
  };

  const setSpeed = (audio) => {
    if (isTime) audio.setPlaybackRate(0.5);
    else audio.setPlaybackRate(1);
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
    if (record && record.audio && !record.audio.isPlaying) {
      setSpeed(record.audio);
      record.audio.play();
    }
  };

  this.stopObjectSound = (id, name) => {
    record = getRecordByIdAndName(id, name);
    if (record && record.audio && record.audio.isPlaying) record.audio.stop();
  };

  this.pauseObjectSound = (id, name) => {
    record = getRecordByIdAndName(id, name);
    if (record && record.audio && record.audio.isPlaying) record.audio.pause();
  };

  this.replayObjectSound = (id, name) => {
    record = getRecordByIdAndName(id, name);
    if (record && record.audio) {
      if (!record.audio.isPlaying) {
        setSpeed(record.audio);
        record.audio.play();
      } else {
        record.audio.stop();
        record.audio.play();
      }
    }
  };

  this.toggleTime = () => {
    isTime = !isTime;
    if (isTime) {
      bus.filter(record => record.id !== heroSound.id).forEach((record) => {
        record.audio.setPlaybackRate(0.5);
      });
    } else {
      bus.filter(record => record.id !== heroSound.id).forEach((record) => {
        record.audio.setPlaybackRate(1);
      });
    }
  };

  this.toggle = () => {
    isPlay = !isPlay;
    if (isPlay) {
      bus.filter(record => record.audio.isPlaying).forEach((record) => {
        record.isStopped = true;
        record.audio.pause();
      });
    } else {
      bus.filter(record => record.isStopped).forEach((record) => {
        record.isStopped = false;
        record.audio.play();
      });
    }
  };
}

export default AudioBus;
