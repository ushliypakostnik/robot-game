import * as Three from 'three';

import { DESIGN } from '@/utils/constants';

import {
  loaderDispatchHelper,
  enemyToActiveMode,
} from '@/utils/utilities';

function Explosions() {
  let bus = [];
  this.id = 0;

  let material = null;
  const geometry = new Three.SphereBufferGeometry(0.5, 8, 8);
  let explosion;
  let explosionClone;

  const audioLoader = new Three.AudioLoader();
  let boom;
  let hit;

  this.init = (
    scope,
    fireMaterial,
  ) => {
    material = fireMaterial;

    explosion = new Three.Mesh(geometry, material);

    audioLoader.load('./audio/explosion.mp3', (buffer) => {
      loaderDispatchHelper(scope.$store, 'isExplosionLoaded');
      boom = buffer;
    });

    audioLoader.load('./audio/hit.mp3', (buffer) => {
      loaderDispatchHelper(scope.$store, 'isHit2Loaded');
      hit = buffer;
    });
  };

  this.addExplosionToBus = (
    scope,
    position,
    size,
    isEnemy,
    velocity,
  ) => {
    explosionClone = explosion.clone();

    explosionClone.position.copy(position);

    scope.audio.playAudioOnObject(scope, explosionClone, boom, 'boom', DESIGN.VOLUME.explosion, true);

    if (isEnemy) scope.audio.playAudioOnObject(scope, explosionClone, hit, 'hit', DESIGN.VOLUME.hit, false);

    ++this.id;
    bus.push({
      id: this.id,
      mesh: explosionClone,
      size,
      velocity,
      scale: 1,
      isOff: false,
    });

    scope.scene.add(explosionClone);
  };

  this.removeExplosionFromBus = (scope, id) => {
    scope.object = bus.find(record => record.id === id);
    bus = bus.filter(record => record.id !== id);
    scope.scene.remove(scope.object.mesh);
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
      if (!scope.isNotDamaged
          && record.mesh.position.distanceTo(scope.camera.position) < DESIGN.HERO.HEIGHT + record.size) {
        scope.events.heroOnHitDispatchHelper(scope, DESIGN.WEAPON.damage.explosion[scope.difficulty] * (-1 / record.mesh.position.distanceTo(scope.camera.position)) * record.size / 10);
        // console.log('Damage: ', DESIGN.WEAPON.damage.explosion * (-1 / record.mesh.position.distanceTo(scope.camera.position)) * record.size / 10);
      }

      // Урон NPS
      scope.enemies
        .filter(enemy => enemy.mode !== DESIGN.ENEMIES.mode.dies && enemy.mode !== DESIGN.ENEMIES.mode.dead)
        .filter(enemy => record.mesh.position.distanceTo(enemy.collider.center) < enemy.height + record.size)
        .forEach((enemy) => {
          scope.cooeficient = scope.isGain ? 2 : 1;
          enemy.health -= DESIGN.HERO.weapon.damage[scope.difficulty] * scope.cooeficient;
          enemy.scale.scale.set(enemy.health / DESIGN.ENEMIES[enemy.name].health, 1, enemy.health / DESIGN.ENEMIES[enemy.name].health);
          // console.log('Damage: ', DESIGN.HERO.weapon.damage[scope.difficulty] * scope.cooeficient);

          if (enemy.health <= 0) scope.world.enemies.toDead(scope, enemy);
          else scope.world.enemies.onShot(scope, enemy, record.velocity);

          if (enemy.mode === DESIGN.ENEMIES.mode.idle) enemyToActiveMode(scope, enemy);
        });

      if (record.scale < 0) this.removeExplosionFromBus(scope, record.id);
    });
  };
}

export default Explosions;
