/* eslint-disable dot-notation,prefer-destructuring */
import * as Three from 'three';

import { Capsule } from '../Modules/Math/Capsule';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  loaderDispatchHelper,
  messagesByViewDispatchHelper,
} from '@/utils/utilities';

function Hero() {
  let playerCollider;
  let playerVelocity;
  const playerDirection = new Three.Vector3(0, 0, 0);

  let speed;

  let enduranceClock;
  let enduranceTime = 0;
  let isEnduranceRecoveryStart = false;

  let playerOnFloor;
  let jumpStart;
  let jumpFinish;

  let notTiredClock;
  let notTiredTime = 0;

  let object;
  let name;

  const audioLoader = new Three.AudioLoader();
  let steps;
  let hit;

  this.init = (scope) => {
    audioLoader.load('./audio/pick.mp3', (buffer) => {
      scope.audio.addAudioToHero(scope, buffer, 'pick', DESIGN.VOLUME.hero.pick, false);
      loaderDispatchHelper(scope.$store, 'isPickLoaded');
    });

    audioLoader.load('./audio/steps.mp3', (buffer) => {
      steps = scope.audio.addAudioToHero(scope, buffer, 'steps', DESIGN.VOLUME.hero.step, false);
      steps.onEnded = () => steps.stop();
      loaderDispatchHelper(scope.$store, 'isStepsLoaded');
    });

    audioLoader.load('./audio/current.mp3', (buffer) => {
      scope.audio.addAudioToHero(scope, buffer, 'damage', DESIGN.VOLUME.hero.current, true);
      loaderDispatchHelper(scope.$store, 'isDamageLoaded');
    });

    audioLoader.load('./audio/current.mp3', (buffer) => {
      hit = scope.audio.addAudioToHero(scope, buffer, 'hit', DESIGN.VOLUME.hero.current, false);
      loaderDispatchHelper(scope.$store, 'isHitLoaded');
    });

    audioLoader.load('./audio/jumpstart.mp3', (buffer) => {
      scope.audio.addAudioToHero(scope, buffer, 'jumpstart', DESIGN.VOLUME.hero.jumpstart, false);
      loaderDispatchHelper(scope.$store, 'isJumpStartLoaded');
    });

    audioLoader.load('./audio/jumpend.mp3', (buffer) => {
      scope.audio.addAudioToHero(scope, buffer, 'jumpend', DESIGN.VOLUME.hero.jumpend, false);
      loaderDispatchHelper(scope.$store, 'isJumpEndLoaded');
    });

    playerCollider = new Capsule(
      new Three.Vector3(
        DESIGN.HERO.START.x,
        DESIGN.HERO.START.y + DESIGN.HERO.HEIGHT / 2,
        DESIGN.HERO.START.z,
      ),
      new Three.Vector3(
        DESIGN.HERO.START.x,
        DESIGN.HERO.START.y + DESIGN.HERO.HEIGHT,
        DESIGN.HERO.START.z,
      ),
      DESIGN.HERO.HEIGHT / 2,
    );
    playerDirection.copy(scope.startDirection);
    playerVelocity = new Three.Vector3();

    enduranceClock = new Three.Clock(false);
    notTiredClock = new Three.Clock(false);

    this.animate(scope);
  };

  this.setHidden = (scope, isHidden) => {
    if (isHidden) {
      playerCollider = new Capsule(
        new Three.Vector3(
          scope.camera.position.x,
          scope.camera.position.y - DESIGN.HERO.HEIGHT,
          scope.camera.position.z,
        ),
        new Three.Vector3(
          scope.camera.position.x,
          scope.camera.position.y - DESIGN.HERO.HEIGHT,
          scope.camera.position.z,
        ),
        DESIGN.HERO.HEIGHT / 2,
      );

      steps.setPlaybackRate(0.5);
    } else {
      playerCollider = new Capsule(
        new Three.Vector3(
          scope.camera.position.x,
          scope.camera.position.y - DESIGN.HERO.HEIGHT,
          scope.camera.position.z,
        ),
        new Three.Vector3(
          scope.camera.position.x,
          scope.camera.position.y - DESIGN.HERO.HEIGHT / 2,
          scope.camera.position.z,
        ),
        DESIGN.HERO.HEIGHT / 2,
      );

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

  this.setOnHit = (scope, isOnHit) => {
    if (isOnHit) {
      if (!hit.isPlaying) hit.play();
    } else if (hit.isPlaying) hit.stop();
  };

  const playerCollitions = (scope) => {
    scope.result = scope.octree.capsuleIntersect(playerCollider);
    playerOnFloor = false;

    if (scope.result) {
      playerOnFloor = scope.result.normal.y > 0;
      if (!playerOnFloor) {
        playerVelocity.addScaledVector(scope.result.normal, -scope.result.normal.dot(playerVelocity));
      }

      playerCollider.translate(scope.result.normal.multiplyScalar(scope.result.depth));
    }
    if (scope.playerOnFloor !== playerOnFloor) {
      if (!playerOnFloor) jumpStart = playerCollider.end.y;
      else {
        // console.log('Пролетел: ', jumpStart - playerCollider.end.y);
        jumpFinish = jumpStart - playerCollider.end.y;
        if (jumpFinish > 15) scope.events.heroOnHitDispatchHelper(scope, -2 * (jumpFinish - 15));

        // Sound
        if (Math.abs(jumpFinish) > 0.25) scope.audio.replayHeroSound('jumpend');
      }
    }
    scope.playerOnFloor = playerOnFloor;

    scope.resultMutable = scope.octreeMutable.capsuleIntersect(playerCollider);

    if (scope.resultMutable) {
      playerCollider.translate(scope.resultMutable.normal.multiplyScalar(scope.resultMutable.depth));
    }
  };

  const getForwardVector = (scope) => {
    scope.camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();

    return playerDirection;
  };

  const getSideVector = (scope) => {
    scope.camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross(scope.camera.up);

    return playerDirection;
  };

  this.animate = (scope) => {
    // Raycasting

    scope.raycaster = new Three.Raycaster(
      new Three.Vector3(),
      new Three.Vector3(0, 0, -1), 0, 3,
    );

    // Forward ray
    scope.direction = scope.camera.getWorldDirection(scope.direction);
    scope.raycaster.set(scope.camera.getWorldPosition(scope.position), scope.direction);
    scope.intersections = scope.raycaster.intersectObjects(scope.objects);
    scope.onForward = scope.intersections.length > 0 ? scope.intersections[0].distance < DESIGN.HERO.CAST : false;

    if (scope.onForward) {
      scope.object = scope.intersections[0].object;

      // Кастим панель
      if (scope.object.name.includes(OBJECTS.SCREENS.name)) {
        object = scope.screens.find(screen => screen.id === scope.object.id);

        if (object) messagesByViewDispatchHelper(scope, 2, 'look', scope.object.name);
      }

      // Кастим пропуск
      if (scope.object.name.includes(OBJECTS.PASSES.name)
          || scope.object.name.includes(OBJECTS.FLOWERS.name)) {
        if (scope.object.name.includes(OBJECTS.PASSES.name)) {
          object = scope.things.find(thing => thing.id === scope.object.id && !thing.isPicked);

          if (object) messagesByViewDispatchHelper(scope, 2, 'cast', scope.object.name);

          if (object && scope.keyStates['KeyE']) {
            const {group} = object;

            object.isPicked = true;
            group.visible = false;

            name = scope.object.name.slice(scope.object.name.indexOf(OBJECTS.PASSES.name) + OBJECTS.PASSES.name.length);

            // Sound
            scope.audio.replayHeroSound('pick');

            scope.addPass(name);
            scope.events.heroOnUpgradeDispatchHelper(scope);
            scope.events.messagesByIdDispatchHelper(scope, 1, 'pick', name);
          }
        }

        // Кастим пропуск
        if (scope.object.name.includes(OBJECTS.FLOWERS.name)) {
          object = scope.things.find(thing => thing.id === scope.object.id);

          if (object) messagesByViewDispatchHelper(scope, 2, 'cast', scope.object.name);

          if (object && scope.keyStates['KeyE']) {
            const {group} = object;

            scope.scene.remove(group);
            scope.objects.splice(scope.objects.indexOf(scope.object), 1);
            scope.things.splice(scope.things.indexOf(group), 1);

            name = scope.object.name.slice(scope.object.name.indexOf(OBJECTS.FLOWERS.name) + OBJECTS.PASSES.name.length);

            // Sound
            scope.audio.replayHeroSound('pick');

            scope.addPass(name);
            scope.events.heroOnUpgradeDispatchHelper(scope);
            scope.events.messagesByIdDispatchHelper(scope, 1, 'pick', name);
          }
        }
      }

      // Кастим дверь
      if (scope.object.name.includes(OBJECTS.DOORS.name)) {
        object = scope.doors.find(door => door.id === scope.object.id);

        if (object) {
          if (!scope.passes.includes(object.pass)) {
            messagesByViewDispatchHelper(scope, 2, 'closed', object.pass);
          } else {
            messagesByViewDispatchHelper(scope, 2, 'open');

            if (scope.keyStates['KeyE']) {
              scope.world.doors.openDoor(scope, scope.object.id);

              // Победа на уровне
              if (scope.object.name.includes('Out')) {
                scope.events.delayDispatchHelper(scope, 3, () => {
                  scope.setWin();
                  scope.setGameOver();
                });
              }
            }
          }
        }
      }
    } else scope.hideMessageByView(2);

    // Усталость и ее восстановление
    if (!scope.isNotTired) {
      if (scope.isRun
          || scope.isHeroTired
          || (!scope.isRun && !scope.isHeroTired && scope.endurance < 100)) {
        if (scope.isRun && !enduranceClock.running) enduranceClock.start();

        if (!isEnduranceRecoveryStart && scope.endurance < 100 && !scope.isRun) {
          isEnduranceRecoveryStart = true;
          enduranceClock.start();
        } else if (isEnduranceRecoveryStart && scope.isRun) isEnduranceRecoveryStart = false;

        enduranceTime += enduranceClock.getDelta();

        if (enduranceTime > 0.025) {
          scope.setScale({
            field: DESIGN.HERO.scales.endurance.name,
            value: !isEnduranceRecoveryStart ? -1 : 1,
          });
          enduranceTime = 0;
        }
      } else {
        if (enduranceClock.running) enduranceClock.stop();
        if (isEnduranceRecoveryStart) isEnduranceRecoveryStart = false;
        enduranceTime = 0;
      }
    } else {
      if (!notTiredClock.running) notTiredClock.start();

      if (!scope.isPause) notTiredTime += notTiredClock.getDelta();

      if (notTiredTime > DESIGN.EFFECTS.time.endurance) {
        notTiredClock.stop();
        notTiredTime = 0;
        scope.setNotTired(false);
        scope.events.messagesByIdDispatchHelper(scope, 2, 'endNoTired');
      }
    }

    if (scope.playerOnFloor) {
      if (!scope.isPause) {
        if (scope.keyStates['KeyW']) {
          speed = scope.isHidden ? DESIGN.HERO.SPEED / 4 : scope.isRun ? DESIGN.HERO.SPEED * 2.5 : DESIGN.HERO.SPEED;
          playerVelocity.add(getForwardVector(scope).multiplyScalar(speed * scope.delta));
        }

        if (scope.keyStates['KeyS']) {
          speed = scope.isHidden ? DESIGN.HERO.SPEED / 4 : DESIGN.HERO.SPEED;
          playerVelocity.add(getForwardVector(scope).multiplyScalar(-speed * scope.delta));
        }

        if (scope.keyStates['KeyA']) {
          speed = scope.isHidden ? DESIGN.HERO.SPEED / 4 : DESIGN.HERO.SPEED;
          playerVelocity.add(getSideVector(scope).multiplyScalar(-speed * scope.delta));
        }

        if (scope.keyStates['KeyD']) {
          speed = scope.isHidden ? DESIGN.HERO.SPEED / 4 : DESIGN.HERO.SPEED;
          playerVelocity.add(getSideVector(scope).multiplyScalar(speed * scope.delta));
        }

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

        if (scope.keyStates['Space']) {
          playerVelocity.y = DESIGN.HERO.JUMP;

          // Sound
          scope.audio.replayHeroSound('jumpstart');
        }
      }

      scope.damping = Math.exp(-3 * scope.delta) - 1;
      playerVelocity.addScaledVector(playerVelocity, scope.damping);
    } else {
      if (steps && steps.isPlaying) steps.pause();

      playerVelocity.y -= DESIGN.GRAVITY * scope.delta;
    }

    playerCollider.translate(playerVelocity.clone().multiplyScalar(scope.delta));

    playerCollitions(scope);

    scope.camera.position.copy(playerCollider.end);

    if (scope.toruch && scope.isToruch) scope.toruch.position.copy(playerCollider.end);
    // console.log(scope.camera.position);
  };
}

export default Hero;
