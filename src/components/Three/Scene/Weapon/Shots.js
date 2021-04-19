import * as Three from 'three';

import { DESIGN } from '@/utils/constants';

import {
  loaderDispatchHelper,
  isSphereCollitions,
} from '@/utils/utilities';

function Shots() {
  let bus = [];
  this.id = 0;

  let fireMaterial;

  let shot;
  let center;
  let velocity;

  this.init = (scope) => {
    const fireTexture = new Three.TextureLoader().load(
      './images/textures/green.jpg',
      () => {
        loaderDispatchHelper(scope.$store, 'isGreenLoaded');
      },
    );
    fireMaterial = new Three.MeshPhongMaterial({
      map: fireTexture,
      color: DESIGN.COLORS.white
    });
    fireMaterial.map.repeat.set(4, 4);
    fireMaterial.map.wrapS = fireMaterial.map.wrapT = Three.RepeatWrapping;
    fireMaterial.map.encoding = Three.sRGBEncoding;
  };

  this.addShotToBus = (scope, start, direction, radius, isFlying) => {
    const geometry = new Three.SphereBufferGeometry(radius, 8, 8);
    shot = new Three.Mesh(geometry, fireMaterial);

    center = new Three.Vector3(start.x, start.y - 1, start.z);
    center.add(direction.multiplyScalar(2));

    shot.position.copy(center);

    ++this.id;
    bus.push({
      id: this.id,
      mesh: shot,
      start,
      directionX: direction.x,
      directionY: direction.y,
      directionZ: direction.z,
      gravity: 0,
      isFlying,
      collider: new Three.Sphere(center, radius),
    });

    scope.scene.add(shot);
  };

  const removeShotFromBus = (scope, id) => {
    shot = bus.find(record => record.id === id);
    bus = bus.filter(record => record.id !== id);
    scope.scene.remove(shot.mesh);
  };

  this.animate = (scope) => {
    bus.forEach((record) => {
      if (record.gravity === 0) {
        if (!record.isFlying && record.mesh.position.distanceTo(record.start) > 5) {
          record.gravity = -0.125 * Math.random() - 0.1;
        }

        if (record.isFlying && record.mesh.position.distanceTo(record.start) > 3) {
          record.gravity = -0.5 * Math.random() * Math.sqrt(record.start.y) - 1;
        }
      }

      velocity = new Three.Vector3(record.directionX, record.directionY + record.gravity, record.directionZ);
      record.mesh.position.add(velocity);
      record.collider.translate(velocity);

      record.mesh.rotateX(scope.delta * 3);
      record.mesh.rotateZ(scope.delta * 3);
      record.mesh.rotateY(scope.delta * 3);

      scope.boolean = isSphereCollitions(scope, record.collider);

      // Урон персонажу
      if (record.mesh.position.distanceTo(scope.camera.position) < DESIGN.HERO.HEIGHT && !scope.isNotDamaged) {
        scope.events.heroOnHitDispatchHelper(scope, DESIGN.WEAPON.damage.shot * (-1 / record.mesh.position.distanceTo(scope.camera.position)));

        // Толчек
        scope.hero.onShot(scope, new Three.Vector3(record.directionX, record.directionY, record.directionZ).negate());
      }

      // Улетело
      if ((scope.boolean
          && (record.collider.center.distanceTo(record.start) > DESIGN.WORLD_SIZE[scope.l] / 2
          || record.mesh.position.distanceTo(record.start) > 5))
          || record.mesh.position.y < 0) {
          scope.world.explosions.addExplosionToBus(scope, record.collider.center, 0.5, 5, false, velocity);
        removeShotFromBus(scope, record.id);
      }
    });
  };
}

export default Shots;
