/* eslint-disable dot-notation */
import * as Three from 'three';

import { Capsule } from '../Modules/Math/Capsule';

import { DESIGN, OBJECTS } from '@/utils/constants';

function Hero() {
  let playerCollider;
  let playerVelocity;
  const playerDirection = new Three.Vector3(0, 0, 0);

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
    playerDirection.copy(scope.playerStartDirection);
    playerVelocity = new Three.Vector3();

    this.animate(scope);
  };

  const playerCollitions = (scope) => {
    scope.result = scope.octree.capsuleIntersect(playerCollider);
    scope.playerOnFloor = false;

    if (scope.result) {
      scope.playerOnFloor = scope.result.normal.y > 0;
      if (!scope.playerOnFloor) {
        playerVelocity.addScaledVector(scope.result.normal, -scope.result.normal.dot(playerVelocity));
      }

      playerCollider.translate(scope.result.normal.multiplyScalar(scope.result.depth));
    }

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
    scope.raycaster = new Three.Raycaster(
      new Three.Vector3(),
      new Three.Vector3(0, 0, -1), 0, 3,
    );

    // Forward ray
    scope.direction = scope.camera.getWorldDirection(scope.direction);
    scope.raycaster.set(scope.camera.getWorldPosition(scope.position), scope.direction);
    scope.intersections = scope.raycaster.intersectObjects(scope.objects);
    scope.onForward = scope.intersections.length > 0 ? scope.intersections[0].distance < 3 : false;

    if (scope.onForward) {
      scope.object = scope.intersections[0].object;
      if (scope.object.name.includes(OBJECTS.DOORS.name) && scope.keyStates['KeyE']) scope.world.openDoor(scope.object.id);
    }

    if (scope.playerOnFloor) {
      if (!scope.isPause) {
        if (scope.keyStates['KeyW']) {
          playerVelocity.add(getForwardVector(scope).multiplyScalar(DESIGN.HERO.SPEED * scope.delta));
        }

        if (scope.keyStates['KeyS']) {
          playerVelocity.add(getForwardVector(scope).multiplyScalar(-DESIGN.HERO.SPEED * scope.delta));
        }

        if (scope.keyStates['KeyA']) {
          playerVelocity.add(getSideVector(scope).multiplyScalar(-DESIGN.HERO.SPEED * scope.delta));
        }

        if (scope.keyStates['KeyD']) {
          playerVelocity.add(getSideVector(scope).multiplyScalar(DESIGN.HERO.SPEED * scope.delta));
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
