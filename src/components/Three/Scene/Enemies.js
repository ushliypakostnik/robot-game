import * as Three from 'three';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  randomInteger,
  radiansToDegrees,
  loaderDispatchHelper,
  updateEnemiesPersonalOctree,
  plusOrMinus,
  distance2D,
  isEnemyCanShot,
  isEnemyCanFlyDown,
  isEnemyCanMoveForward,
} from "@/utils/utilities";

import Spiders from './Enemies/Spiders';
import Drones from './Enemies/Drones';

function Enemies() {
  const audioLoader = new Three.AudioLoader();

  this.spiders = null;
  this.drones = null;

  let result;

  let deadMaterial;
  let dead2material;

  let idleClock;
  let idleTime = 0;
  let idleId = null;
  let idleStop = null;

  this.init = (
    scope,
    metallDarkMaterial,
    metallTexture,
    holeMaterial,
    glassMaterial,
    pseudoMaterial,
    scaleGeometry,
    scaleMaterial,
  ) => {
    deadMaterial = holeMaterial;

    this.spiders = new Spiders();
    this.spiders.init(
      scope,
      metallDarkMaterial,
      metallTexture,
      holeMaterial,
      glassMaterial,
      pseudoMaterial,
      scaleGeometry,
      scaleMaterial,
    );

    this.drones = new Drones();
    this.drones.init(
      scope,
      metallDarkMaterial,
      metallTexture,
      holeMaterial,
      glassMaterial,
      pseudoMaterial,
      scaleGeometry,
      scaleMaterial,
    );

    dead2material = glassMaterial;

    audioLoader.load('./audio/mechanism.mp3', (buffer) => {
      loaderDispatchHelper(scope.$store, 'isMechanismLoaded');

      scope.array = scope.enemies.filter(enemy => enemy.name !== OBJECTS.DRONES.name);

      scope.audio.addAudioToObjects(scope, scope.array, buffer, 'mesh', 'mechanism', DESIGN.VOLUME.mechanism, true);
    });

    audioLoader.load('./audio/fly.mp3', (buffer) => {
      loaderDispatchHelper(scope.$store, 'isFlyLoaded');

      scope.array = scope.enemies.filter(enemy => enemy.name === OBJECTS.DRONES.name);

      scope.audio.addAudioToObjects(scope, scope.array, buffer, 'mesh', 'fly', DESIGN.VOLUME.fly, true);
    });

    audioLoader.load('./audio/dead.mp3', (buffer) => {
      loaderDispatchHelper(scope.$store, 'isDeadLoaded');

      scope.audio.addAudioToObjects(scope, scope.enemies, buffer, 'mesh', 'dead', DESIGN.VOLUME.dead, false);
    });

    audioLoader.load('./audio/shot2.mp3', (buffer) => {
      loaderDispatchHelper(scope.$store, 'isShot2Loaded');

      scope.audio.addAudioToObjects(scope, scope.enemies, buffer, 'mesh', 'shot', DESIGN.VOLUME.shot, false);
    });

    idleClock = new Three.Clock(false);
  };

  // Умер
  const dead = (scope, enemy) => {
    enemy.mode = DESIGN.ENEMIES.mode.dead;
  };

  // Столкновения
  const enemyCollitions = (scope, enemy) => {
    scope.result = scope.octree.sphereIntersect(enemy.collider);
    enemy.isOnFloor = false;

    if (scope.result) {
      enemy.isOnFloor = scope.result.normal.y > 0;
      if (!enemy.isOnFloor) {
        enemy.velocity.addScaledVector(scope.result.normal, -scope.result.normal.dot(enemy.velocity));
      } else {
        // Подбитый враг становится совсем мертвым после падения на пол
        if (enemy.mode === DESIGN.ENEMIES.mode.dies) dead(scope, enemy);

        if (enemy.isOnJump) enemy.isOnJump = false;
        if (enemy.mode === DESIGN.ENEMIES.mode.active && !enemy.isPlay) {
          enemy.isPlay = true;
          scope.audio.startObjectSound(enemy.id, 'mechanism');
        }
      }

      enemy.collider.translate(scope.result.normal.multiplyScalar(scope.result.depth));
    }

    scope.resultDoors = scope.octreeDoors.sphereIntersect(enemy.collider);
    if (scope.resultDoors) {
      enemy.collider.translate(scope.resultDoors.normal.multiplyScalar(scope.resultDoors.depth));
    }

    // Делаем октодерево из всех NPS без этого, если давно не делали
    if (scope.enemies.length > 1
      && !enemy.updateClock.running) {
      if (!enemy.updateClock.running) enemy.updateClock.start();

      updateEnemiesPersonalOctree(scope, enemy.id);

      scope.resultEnemies = scope.octreeEnemies.sphereIntersect(enemy.collider);
      if (scope.resultEnemies) {
        result = scope.resultEnemies.normal.multiplyScalar(scope.resultEnemies.depth);
        result.y = 0;
        enemy.collider.translate(result);
      }
    }

    if (enemy.updateClock.running) {
      enemy.updateTime += enemy.updateClock.getDelta();

      if (enemy.updateTime > DESIGN.OCTREE_UPDATE_TIMEOUT && enemy.updateClock.running) {
        enemy.updateClock.stop();
        enemy.updateTime = 0;
      }
    }
  };

  // Шкалы здоровья
  this.setScales = (scope) => {
    scope.enemies.filter(enemy => enemy.mode !== DESIGN.ENEMIES.mode.dead).forEach((enemy) => {
      enemy.scale.setRotationFromMatrix(scope.camera.matrix);
    });
  };

  // Либо убит, либо умирает
  this.toDead = (scope, enemy) => {
    enemy.mode = DESIGN.ENEMIES.mode.dies;

    enemy.velocity.add(new Three.Vector3((Math.random() + 0.5) * 25, (Math.random() + 0.5) * 25, (Math.random() + 0.5) * 25));
    enemy.randomX = plusOrMinus();
    enemy.randomZ = plusOrMinus();

    scope.events.messagesByIdDispatchHelper(scope, 3, 'destroyed', enemy.mesh.name);

    if (enemy.isPlay) {
      enemy.isPlay = false;
      if (enemy.name !== OBJECTS.DRONES.name) scope.audio.stopObjectSound(enemy.id, 'mechanism');
      else scope.audio.stopObjectSound(enemy.id, 'fly');
    }
    scope.audio.startObjectSound(enemy.id, 'dead');
    scope.world.explosions.addExplosionToBus(
      scope,
      new Three.Vector3(
        enemy.collider.center.x,
        enemy.collider.center.y - enemy.height / 2,
        enemy.collider.center.z,
      ),
      15,
    );
    enemy.scale.visible = false;
    enemy.mesh.traverse((child) => {
      if (child.isMesh) {
        if (child.name.includes('metall')) {
          child.material = deadMaterial;
          child.material.map = null;
        } else if (child.name.includes('glass')) {
          child.material = dead2material.clone();
          child.material.color = new Three.Color(DESIGN.COLORS.grayLight);
        }
      }
    });
  };

  // Попадание
  this.onShot = (scope, enemy, direction) => {
    if (direction) {
      scope.cooeficient = scope.isGain ? 2 : 1;
      enemy.velocity.add(direction.multiplyScalar(DESIGN.HERO.recoil.enemies * scope.delta * scope.cooeficient));
    }
  };

  // Позиция
  const position = (scope, enemy) => {
    if (enemy.mode !== DESIGN.ENEMIES.mode.dies) {
      if (enemy.collider.center.x < DESIGN.LEVELS.place[scope.l].minX) enemy.collider.center.x = DESIGN.LEVELS.place[scope.l].minX;
      if (enemy.collider.center.x > DESIGN.LEVELS.place[scope.l].maxX) enemy.collider.center.x = DESIGN.LEVELS.place[scope.l].maxX;
      if (enemy.collider.center.z < DESIGN.LEVELS.place[scope.l].minZ) enemy.collider.center.z = DESIGN.LEVELS.place[scope.l].minZ;
      if (enemy.collider.center.z > DESIGN.LEVELS.place[scope.l].maxZ) enemy.collider.center.z = DESIGN.LEVELS.place[scope.l].maxZ;
    }

    enemy.collider.translate(enemy.velocity.clone().multiplyScalar(scope.delta));

    enemyCollitions(scope, enemy);

    scope.number = enemy.collider.center.y > 0 ? enemy.collider.center.y : 0;

    enemy.mesh.position.set(enemy.collider.center.x, scope.number, enemy.collider.center.z);
    enemy.pseudo.position.set(enemy.mesh.position.x, scope.number - enemy.height / 4, enemy.mesh.position.z);
    enemy.pseudoLarge.position.set(enemy.mesh.position.x, scope.number, enemy.mesh.position.z);
    enemy.scale.position.set(enemy.mesh.position.x, scope.number + enemy.height / 2, enemy.mesh.position.z);
  };

  // Отдых
  const enjoy = (scope, enemy) => {
    if (!enemy.enjoyClock.running
        && !enemy.isOnJump) scope.decision = randomInteger(1, DESIGN.ENEMIES[enemy.name].decision.enjoy) === 1;

    if (enemy.enjoyClock.running) enemy.enjoyTime += enemy.enjoyClock.getDelta();

    if (scope.decision && !enemy.isOnJump) {
      enemy.isEnjoy = true;
      enemy.enjoyClock.start();

      if (enemy.isPlay
        && enemy.name !== OBJECTS.DRONES.name) {
        enemy.isPlay = false;
        scope.audio.pauseObjectSound(enemy.id, 'mechanism');
      }
    }

    if (enemy.enjoyTime > 2 && enemy.enjoyClock.running) {
      enemy.enjoyClock.stop();
      enemy.enjoyTime = 0;
      enemy.isEnjoy = false;

      if (enemy.mode === DESIGN.ENEMIES.mode.active
        && enemy.name !== OBJECTS.DRONES.name
        && !enemy.isPlay) {
        enemy.isPlay = true;
        if (enemy.name !== OBJECTS.DRONES.name) scope.audio.startObjectSound(enemy.id, 'mechanism');
      }
    }
  };

  // Прыжок
  const jump = (scope, enemy) => {
    enemy.velocity.y = enemy.jump;
    enemy.isOnJump = true;

    if (enemy.mode === DESIGN.ENEMIES.mode.active
      && enemy.isPlay) {
      enemy.isPlay = false;
      scope.audio.pauseObjectSound(enemy.id, 'mechanism');
    }
  };

  // Расстояние и направление на героя
  const setDistanceAndDirectionToHero = (scope, enemy) => {
    scope.dictance = scope.controls.getObject().position.distanceTo(enemy.mesh.position);
    enemy.distanceToHero = scope.dictance;

    scope.directionOnHero.subVectors(scope.controls.getObject().position, enemy.mesh.position).normalize();
    scope.directionOnHero.y = 0;
  };

  // Направление движения
  const setDirection = (scope, enemy) => {
    scope.direction.copy(enemy.mesh.getWorldDirection(scope.direction).normalize());
    scope.direction.y = 0;
  };

  // Движение вперед
  const forward = (scope, enemy) => {
    setDirection(scope, enemy);
    enemy.velocity.add(scope.direction.multiplyScalar(enemy.speed * scope.delta * enemy.speedCooeficient));
  };

  // Решение на изменение скорости
  const speed = (scope, enemy) => {
    scope.decision = randomInteger(1, DESIGN.ENEMIES[enemy.name].decision.speed) === 1;
    if (scope.decision) enemy.speedCooeficient = (Math.random() + 1) * 2.5;
  };

  // Движение
  const move = (scope, enemy) => {
    if (enemy.name !== OBJECTS.DRONES.name) {
      // Гравитация если не на полу
      if (!enemy.isOnFloor) enemy.velocity.y -= DESIGN.GRAVITY * scope.delta;
      else {
        setDistanceAndDirectionToHero(scope, enemy);

        if ((enemy.mode === DESIGN.ENEMIES.mode.active
            && enemy.distanceToHero > enemy.distance)
            || enemy.mode === DESIGN.ENEMIES.mode.idle) {

          if (isEnemyCanMoveForward(scope, enemy)) {
            // Решение на прыжок
            if ((enemy.mode === DESIGN.ENEMIES.mode.active
              && !enemy.isOnJump
              && enemy.distanceToHero > enemy.distance * 1.5)
              || (enemy.mode === DESIGN.ENEMIES.mode.idle
                && !enemy.isOnJump)) {
              scope.decision = randomInteger(1, DESIGN.ENEMIES[enemy.name].decision.jump) === 1;
              if (scope.decision) jump(scope, enemy);
              else speed(scope, enemy);
            }
            forward(scope, enemy);
          }
        }
        enemy.velocity.addScaledVector(enemy.velocity, scope.damping);
      }
    } else {
      // Летающие юниты
      if ((enemy.mode === DESIGN.ENEMIES.mode.active
          && distance2D(enemy.collider.center.x, enemy.collider.center.z, scope.camera.position.x, scope.camera.position.z) > enemy.distance)
          || enemy.mode === DESIGN.ENEMIES.mode.idle) {
        if (isEnemyCanMoveForward(scope, enemy)) {
          speed(scope, enemy);
          forward(scope, enemy);
        }
      }

      // Решение на изменение высоты
      scope.decision = randomInteger(1, DESIGN.ENEMIES[enemy.name].decision.fly) === 1;
      if (scope.decision) enemy.fly = plusOrMinus();

      if (enemy.fly === -1
          && (enemy.collider.center.y < DESIGN.HERO.HEIGHT * 3
            || !isEnemyCanFlyDown(scope, enemy))) enemy.fly = 1;

      if (enemy.fly === 1
          && enemy.collider.center.y > DESIGN.HERO.JUMP * 1.25) enemy.fly = -1;

      enemy.velocity.y += enemy.fly * enemy.speed * scope.delta * 5;
      enemy.velocity.addScaledVector(enemy.velocity, scope.damping);
    }
  };

  const gravity = (scope, enemy) => {
    enemy.velocity.y -= DESIGN.GRAVITY * scope.delta;
    enemy.velocity.addScaledVector(enemy.velocity, scope.damping);
    position(scope, enemy);

    if (enemy.mode === DESIGN.ENEMIES.mode.dies) {
      enemy.mesh.rotateX(scope.delta * Math.random() * enemy.randomX);
      enemy.mesh.rotateY(scope.delta * Math.random());
      enemy.mesh.rotateZ(scope.delta * Math.random() * enemy.randomZ);
    }
  };

  // Cпокойный режим
  const idle = (scope, enemy) => {
    if (enemy.isOnJump) gravity(scope, enemy);
    else {
      // Двигается только один NPS
      if (!idleClock.running) {
        scope.array = scope.enemies.filter(enemy => enemy.mode === DESIGN.ENEMIES.mode.idle);
        scope.number = randomInteger(0, scope.array.length - 1);
        if (scope.number) {
          idleClock.start();
          idleId = scope.array[scope.number].id;
          idleStop = 2 + Math.random() * 30;
        }
      } else {
        idleTime += idleClock.getDelta();

        if (idleTime > idleStop) {
          idleClock.stop();
          idleTime = 0;
          idleId = null;
        }
      }

      if (enemy.id !== idleId) {
        // Остальные поворачиваются на месте
        scope.decision = randomInteger(1, DESIGN.ENEMIES[enemy.name].decision.rotate) === 1;
        if (scope.decision) enemy.bend = plusOrMinus();
        scope.rotate = enemy.bend * enemy.speed;
        enemy.mesh.rotateY(scope.rotate * 0.1 * scope.delta);
      } else {
        move(scope, enemy);
        position(scope, enemy);
      }
    }
  };

  // Активный режим
  const active = (scope, enemy) => {
    enjoy(scope, enemy);

    setDirection(scope, enemy);
    setDistanceAndDirectionToHero(scope, enemy);
    scope.angle = scope.directionOnHero.angleTo(scope.direction.applyAxisAngle(scope.y, Math.PI / 2));

    // Поворот
    if (!(enemy.name === OBJECTS.SPIDERS.name && enemy.isOnJump)
        && (radiansToDegrees(scope.angle) > 92 || radiansToDegrees(scope.angle) < 88)) {
      scope.rotate = scope.angle - Math.PI / 2 <= 0 ? 1 : -1;
      enemy.mesh.rotateY(scope.rotate * scope.delta);
    }

    // eslint-disable-next-line no-lonely-if
    if (enemy.isEnjoy
        && radiansToDegrees(scope.angle) < 100 && radiansToDegrees(scope.angle) > 80) {
      // Решение на выстрел (если отдыхает)
      scope.decision = randomInteger(1, DESIGN.ENEMIES[enemy.name].decision.shot[scope.difficulty]) === 1;
      if (scope.decision) {
        if (isEnemyCanShot(scope, enemy)) {
          scope.boolean = enemy.name === OBJECTS.DRONES.name;
          scope.world.shots.addShotToBus(scope, enemy.mesh.position, scope.direction, scope.boolean);
          scope.audio.replayObjectSound(enemy.id, 'shot');
        }
      }
    } else {
      move(scope, enemy);
      position(scope, enemy);
    }
  };

  this.animate = (scope) => {
    scope.enemies.filter(enemy => enemy.mode !== DESIGN.ENEMIES.mode.dead).forEach((enemy) => {
      switch (enemy.mode) {
        case DESIGN.ENEMIES.mode.idle:
          idle(scope, enemy);
          break;

        case DESIGN.ENEMIES.mode.active:
          active(scope, enemy);
          break;

        case DESIGN.ENEMIES.mode.dies:
          gravity(scope, enemy);
          break;
      }
    });
  };
}

export default Enemies;
