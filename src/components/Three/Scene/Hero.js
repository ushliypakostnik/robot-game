/* eslint-disable dot-notation */
import * as Three from 'three';

import { Capsule } from '../Modules/Math/Capsule';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  messagesByIdDispatchHelper,
  messagesByViewDispatchHelper,
  heroOnHitDispatchHelper,
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

  this.init = (scope) => {
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
    }
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
        if (jumpFinish > 15) heroOnHitDispatchHelper(scope, -2 * (jumpFinish - 15));
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

      // Кастим пропуск
      if (scope.object.name.includes(OBJECTS.PASSES.name)) {
        object = scope.things.find(thing => thing.id === scope.object.id);

        messagesByViewDispatchHelper(scope, 2, 'cast', scope.object.name);

        if (object && scope.keyStates['KeyE']) {
          const { group } = object;

          scope.scene.remove(group);
          scope.objects.splice(scope.objects.indexOf(scope.object), 1);
          scope.things.splice(scope.things.indexOf(group), 1);

          name = scope.object.name.slice(scope.object.name.indexOf(OBJECTS.PASSES.name) + OBJECTS.PASSES.name.length);

          scope.addPass(name);
          messagesByIdDispatchHelper(scope, 1, 'pick', name);
        }
      }

      // Кастим дверь
      if (scope.object.name.includes(OBJECTS.DOORS.name)) {
        object = scope.doors.find(door => door.data.id === scope.object.id);

        if (object) {
          if (!scope.passes.includes(object.data.pass)) {
            messagesByViewDispatchHelper(scope, 2, 'closed', object.data.pass);
          } else {
            messagesByViewDispatchHelper(scope, 2, 'open');

            if (scope.keyStates['KeyE']) {
              scope.world.openDoor(scope, scope.object.id);

              // Победа на уровне
              if (scope.object.name.includes('Out')) {
                setTimeout(() => {
                  scope.setWin();
                  scope.setGameOver();
                }, 3000);
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
        messagesByIdDispatchHelper(scope, 1, 'endNoTired');
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

        if (scope.keyStates['Space']) playerVelocity.y = DESIGN.HERO.JUMP;
      }

      scope.damping = Math.exp(-3 * scope.delta) - 1;
      playerVelocity.addScaledVector(playerVelocity, scope.damping);
    } else playerVelocity.y -= DESIGN.GRAVITY * scope.delta;

    playerCollider.translate(playerVelocity.clone().multiplyScalar(scope.delta));

    playerCollitions(scope);

    scope.camera.position.copy(playerCollider.end);
    if (scope.toruch && scope.isToruch) scope.toruch.position.copy(playerCollider.end);
    // console.log(scope.camera.position);
  };
}

export default Hero;
