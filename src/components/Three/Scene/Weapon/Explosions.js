import * as Three from 'three';

import { DESIGN } from '@/utils/constants';

import {
  loaderDispatchHelper,
  enemyToActiveMode,
} from '@/utils/utilities';

function Explosions() {
  let bus = [];
  this.id = 0;

  let explosion;

  let material = null;

  const audioLoader = new Three.AudioLoader();
  let boom;

  this.init = (
    scope,
    fireMaterial,
  ) => {
    material = fireMaterial;

    audioLoader.load('./audio/explosion.mp3', (buffer) => {
      loaderDispatchHelper(scope.$store, 'isExplosionLoaded');
      boom = buffer;
    });
  };

  this.addExplosionToBus = (scope, position, radius, size, isHero, velocity) => {
    const geometry = new Three.SphereBufferGeometry(radius, 8, 8);
    explosion = new Three.Mesh(geometry, material);

    explosion.position.copy(position);

    scope.audio.playAudioAndRemoveObject(scope, explosion, boom, 'boom', DESIGN.VOLUME.explosion);

    ++this.id;
    bus.push({
      id: this.id,
      mesh: explosion,
      radius,
      size,
      isHero,
      velocity,
      scale: 1,
      isOff: false,
    });

    scope.scene.add(explosion);
  };

  this.removeExplosionFromBus = (scope, id) => {
    explosion = bus.find(record => record.id === id);
    bus = bus.filter(record => record.id !== id);
    explosion.mesh.visible = false;
  };

  this.animate = (scope) => {
    bus.forEach((record) => {
      if (!record.isOff) record.scale += scope.delta * 50;
      else record.scale -= scope.delta * 50;

      if (record.scale > record.size) record.isOff = true;

      if (record.scale >= 0) record.mesh.scale.set(record.scale, record.scale, record.scale);
      if (record.scale >= record.size) {
        record.mesh.material.opacity = 1;
      } else if (record.scale < 0) {
        record.mesh.material.opacity = 0;
      } else record.mesh.material.opacity = record.scale / record.size;
      record.mesh.rotateX(scope.delta * -3);
      record.mesh.rotateY(scope.delta * -3);
      record.mesh.rotateZ(scope.delta * -3);

      // Урон персонажу
      if (!record.isHero
          && !scope.isNotDamaged
          && record.mesh.position.distanceTo(scope.camera.position) < DESIGN.HERO.HEIGHT + record.radius * record.size) {
        scope.events.heroOnHitDispatchHelper(scope, DESIGN.WEAPON.damage.explosion * (-1 / record.mesh.position.distanceTo(scope.camera.position)) * record.size / 5);
      }

      // Урон ПНС
      if (record.isHero) {
        scope.enemies
          .filter(enemy => enemy.mode !== DESIGN.STAFF.mode.dies && enemy.mode !== DESIGN.STAFF.mode.dead)
          .filter(enemy => record.mesh.position.distanceTo(enemy.collider.center) < enemy.height + record.radius * record.size)
          .forEach((enemy) => {
            scope.cooeficient = scope.isGain ? 2 : 1;
            enemy.health -= DESIGN.HERO.weapon.damage * scope.cooeficient;
            enemy.scale.scale.set(enemy.health / 100, 1, enemy.health / 100);

            if (enemy.health <= 0) scope.world.enemies.toDead(scope, enemy);
            else scope.world.enemies.onShot(scope, enemy, record.velocity);

            if (enemy.mode === DESIGN.STAFF.mode.idle) enemyToActiveMode(scope, enemy);
          });
      }

      if (record.scale < 0) this.removeExplosionFromBus(scope, record.id);
    });
  };
}

export default Explosions;
