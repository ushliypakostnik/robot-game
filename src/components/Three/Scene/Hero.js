import * as Three from 'three';

import { Capsule } from '../Modules/Math/Capsule';

import { DESIGN } from '@/utils/constants';

function Hero() {
  let playerCollider;
  let playerVelocity;
  const playerDirection = new Three.Vector3(0, 0, 0);

  this.init = (scope) => {
    // playerCollider = new Capsule(new Three.Vector3(0, 0.35, 0), new Three.Vector3(0, 1, 0), 0.35);
    playerCollider = new Capsule(new Three.Vector3(0, DESIGN.HERO.HEIGHT / 2, 0), new Three.Vector3(0, DESIGN.HERO.HEIGHT, 0), DESIGN.HERO.HEIGHT / 2);
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

      scope.damping = Math.exp(- 3 * scope.delta) - 1;
      playerVelocity.addScaledVector(playerVelocity, scope.damping);
    } else playerVelocity.y -= DESIGN.GRAVITY * scope.delta;

    playerCollider.translate(playerVelocity.clone().multiplyScalar(scope.delta));

    playerCollitions(scope);

    scope.camera.position.copy(playerCollider.end);
  };
}

export default Hero;
