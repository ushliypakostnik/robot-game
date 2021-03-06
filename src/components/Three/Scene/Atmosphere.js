/* eslint-disable dot-notation,prefer-destructuring */
import * as Three from 'three';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  loaderDispatchHelper,
  enemyToActiveMode,
  isToHeroRayIntersectWorld,
} from '@/utils/utilities';

function Atmosphere() {
  const audioLoader = new Three.AudioLoader();

  let sky;

  let isStart = false;
  let moveHiddenStore;
  let x;
  let z;
  let newX;
  let newZ;
  let objects;
  let isBeside = false;
  let isBesideNew;

  this.enemyCheckDistance = null;

  this.init = (scope) => {
    // Wind
    audioLoader.load('./audio/wind.mp3', (buffer) => {
      scope.audio.addAudioToHero(scope, buffer, 'wind', DESIGN.VOLUME.wind, true);
      loaderDispatchHelper(scope.$store, 'isWindLoaded');
    });


    // Lights

    // Hemisphere
    const light = new Three.HemisphereLight(DESIGN.COLORS.white, DESIGN.COLORS.grayLight2, 0.5);
    light.position.set(0, 20, 0).normalize();
    scope.scene.add(light);

    // Ambient
    scope.scene.add(new Three.AmbientLight(DESIGN.COLORS.white));


    // Sky
    const skyGeometry = new Three.SphereBufferGeometry(
      DESIGN.LEVELS.size[scope.l] * 6 / 4,
      64,
      64,
    );
    // invert the geometry on the x-axis so that all of the faces point inward
    skyGeometry.scale(-1, 1, 1);

    const skyTexture = new Three.TextureLoader().load(
      './images/textures/sky.jpg',
      () => {
        if (scope.l !== 1) scope.render();
        loaderDispatchHelper(scope.$store, 'isSkyLoaded');
      },
    );
    const skyMaterial = new Three.MeshBasicMaterial({ map: skyTexture });
    sky = new Three.Mesh(skyGeometry, skyMaterial);

    sky.rotateX(Math.PI / 4);
    sky.rotateY(Math.PI / 6);
    sky.rotateZ(Math.PI / 3);

    scope.scene.add(sky);

    // Toruch

    scope.toruch = new Three.PointLight(
      DESIGN.COLORS.sun,
      1.5,
      50,
    );
    scope.scene.add(scope.toruch);

    x = scope.camera.position.x;
    z = scope.camera.position.y;

    this.setCheck(scope.difficulty);
  };

  this.setCheck = (difficulty) => {
    switch (difficulty) {
      case DESIGN.DIFFICULTY.civil:
        this.enemyCheckDistance = DESIGN.CHECK * 0.8;
        break;

      case DESIGN.DIFFICULTY.anarchist:
        this.enemyCheckDistance = DESIGN.CHECK;
        break;

      case DESIGN.DIFFICULTY.communist:
        this.enemyCheckDistance = DESIGN.CHECK * 1.2;
        break;
    }
  };

  // ?????????????????????? ??????????????
  this.checkEnemies = (scope) => {
    objects = scope.enemies.filter(enemy => enemy.mode !== DESIGN.ENEMIES.mode.dies && enemy.mode !== DESIGN.ENEMIES.mode.dead);
    if (objects.length > 0) {
      isBesideNew = false;
      objects.forEach((enemy) => {
        scope.distance = enemy.mesh.position.distanceTo(scope.camera.position);

        // 70 ???????????? (???? ??????????????????) - ???????????????????????????? ?????? ?????????? ?????????? ?????? ????????????!
        if (!isToHeroRayIntersectWorld(scope, enemy.collider)
          && scope.distance < this.enemyCheckDistance * 8
          && !isBesideNew) isBesideNew = true;

        // 60 ???????????? (???? ??????????????????) ?????? ???????????????? - ???????????????????? ???????????? ??????????????????
        if (isToHeroRayIntersectWorld(scope, enemy.collider)
            || (scope.distance > this.enemyCheckDistance * 7
                && enemy.mode === DESIGN.ENEMIES.mode.active)) {
          if (enemy.mode === DESIGN.ENEMIES.mode.active) {
            enemy.mode = DESIGN.ENEMIES.mode.idle;
          }

          if (enemy.isPlay) {
            enemy.isPlay = false;
            if (enemy.name !== OBJECTS.DRONES.name) scope.audio.pauseObjectSound(enemy.id, 'mechanism');
            else scope.audio.pauseObjectSound(enemy.id, 'fly');
          }
        }

        // ???????? ?????? ??????????????: 30 (???? ??????????????????) ???????????? - ???????? ?????????????? ????????????????????????, 60 (???? ??????????????????) ???????? ??????!
        if (!isToHeroRayIntersectWorld(scope, enemy.collider)
          && ((scope.distance < this.enemyCheckDistance * 6
            && !scope.isHidden
            && enemy.mode === DESIGN.ENEMIES.mode.idle)
            || (scope.distance < this.enemyCheckDistance * 3
              && scope.isHidden
              && enemy.mode === DESIGN.ENEMIES.mode.idle))
        ) enemyToActiveMode(scope, enemy);
      });

      // ??????????????????
      if (isBeside !== isBesideNew) {
        if (isBesideNew) scope.events.messagesByIdDispatchHelper(scope, 3, 'enemiesBeside');
        else scope.events.messagesByIdDispatchHelper(scope, 3, 'notEnemiesBeside');
        isBeside = isBesideNew;
      }
    }

    scope.screens.forEach((screen) => {
      scope.distance = screen.pseudo.position.distanceTo(scope.camera.position);

      // 50 ???????????? ?????? ???? ?? ?????????????? - ???????????? ??????????????????????
      if ((scope.distance > DESIGN.CHECK * 5
          && screen.mode === DESIGN.ENEMIES.mode.active)
          || (!scope.world.screens.isHeroInRoomWithScreen(scope, screen)
          && screen.mode === DESIGN.ENEMIES.mode.active)) {
        screen.mode = DESIGN.ENEMIES.mode.idle;
        screen.isSoundStart = false;
        screen.isOn = true;
        screen.counter = 0;
        screen.pseudo.material.color = new Three.Color(DESIGN.COLORS.grayDarken);
        scope.audio.stopObjectSound(screen.id, 'screen');
      }

      // ???????????????????? ???????? ?? ?????????????? ?? 20 ???????????? - ???????? ?????????????? ????????????????????????, 40 ???????? ??????!
      if ((scope.distance < DESIGN.CHECK * 4
          && !scope.isHidden
          && screen.mode === DESIGN.ENEMIES.mode.idle
          && scope.world.screens.isHeroInRoomWithScreen(scope, screen))
          || (scope.distance < DESIGN.CHECK * 2
            && scope.isHidden
            && screen.mode === DESIGN.ENEMIES.mode.idle
            && scope.world.screens.isHeroInRoomWithScreen(scope, screen))) {
        screen.mode = DESIGN.ENEMIES.mode.active;
        scope.events.messagesByIdDispatchHelper(scope, 3, 'discovered', screen.pseudo.name);
      }
    });
  };

  this.animate = (scope) => {
    if (!isStart) {
      scope.audio.startHeroSound('wind');

      isStart = true;
    }

    // ???????????????? ?????????????????????? ?? ?????????????? ?????????????????? ?? ????????
    newX = scope.camera.position.x;
    newZ = scope.camera.position.z;

    if (!isStart) {
      this.checkEnemies(scope);
      isStart = true;
    }

    if (Math.abs(x - newX) > DESIGN.CHECK
        || Math.abs(z - newZ) > DESIGN.CHECK) {
      this.checkEnemies(scope);

      x = newX;
      z = newZ;
    }

    if (moveHiddenStore !== scope.isHidden) {
      this.checkEnemies(scope);

      moveHiddenStore = scope.isHidden;
      x = newX;
      z = newZ;
    }

    sky.rotateY(scope.delta / 25);
  };
}

export default Atmosphere;
