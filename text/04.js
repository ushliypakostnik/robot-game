/* eslint-disable dot-notation,no-unused-vars */
import * as Three from "three";

import { DESIGN, OBJECTS } from '@/utils/constants';

import { loaderDispatchHelper } from '@/utils/utilities';

function Module() {
  const audioLoader = new Three.AudioLoader();
  // ...

  let material = null;
  const geometry = new Three.SphereBufferGeometry(0.5, 8, 8);
  let explosion;
  let explosionClone;

  let boom;

  this.init = (
    scope,
    fireMaterial,
    // ...
  ) => {
    // Звук наземных врагов - загружаем в инициализации на объекты через шину
    audioLoader.load('./audio/mechanism.mp3', (buffer) => {
      loaderDispatchHelper(scope.$store, 'isMechanismLoaded');

      scope.array = scope.enemies.filter(enemy => enemy.name !== OBJECTS.DRONES.name);

      scope.audio.addAudioToObjects(scope, scope.array, buffer, 'mesh', 'mechanism', DESIGN.VOLUME.mechanism, true);
    });

    // Звук взрыва - тоесть "добавляемой и уничтожаемой" сущности - загружаем и записываем в переменную
    material = fireMaterial;

    explosion = new Three.Mesh(geometry, material);

    audioLoader.load('./audio/explosion.mp3', (buffer) => {
      loaderDispatchHelper(scope.$store, 'isExplosionLoaded');
      boom = buffer;
    });
  };

  // ...

  // ... где-то в логике врагов:
  this.moduleFunction = (scope, enemy) => {
    scope.audio.startObjectSound(enemy.id, 'mechanism');
    // ...
    scope.audio.stopObjectSound(enemy.id, 'mechanism');
    // ...
  };

  // При добавлении взрыва на шину взрывов:
  this.addExplosionToBus = (
    scope,
    // ...
  ) => {
    explosionClone = explosion.clone();
    // ..
    scope.audio.playAudioOnObject(scope, explosionClone, boom, 'boom', DESIGN.VOLUME.explosion);
    // ..
  };
}

export default Module;
