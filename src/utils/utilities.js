import * as Three from "three";

import { Octree } from "../components/Three/Modules/Math/Octree";

import { DESIGN, OBJECTS } from '@/utils/constants';

export const randomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

export const yesOrNo = () => Math.random() >= 0.5;

export const plusOrMinus = () => {
  return Math.random() >= 0.5 ? 1 : -1;
};

export const loaderDispatchHelper = (store, field) => {
  store.dispatch('preloader/preloadOrBuilt', field).then(() => {
    store.dispatch('preloader/isAllLoadedAndBuilt');
  }).catch((error) => { console.log(error); });
};

export const messagesByViewDispatchHelper = (scope, view, name, data) => {
  // eslint-disable-next-line object-curly-newline
  if (!scope.messages.some(message => message[1] === view)) scope.showMessage({ id: null, view, name, data });
};

export const distance2D = (x1, y1, x2, y2) => {
  return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
};

export const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

export const radiansToDegrees = (radians) => {
  return radians * (180/ Math.PI);
};

export const randomPointInCircle = (radius, x, y) => {
  const r = radius * Math.sqrt(Math.random());
  const theta = Math.random() * 2 * Math.PI;
  return [x + Math.cos(theta) * r, y + Math.sin(theta) * r];
};

export const getNumberSign = (number) => {
  return number === 0 ? 0 : number > 0 ? 1 : -1;
};

export const getNotPartOfName = (name, part) => {
  return name.slice(name.indexOf(part) + part.length);
};

export const isSphereCollitionsWithEnemy = (scope, сollider) => {
  if (scope.octreeEnemies.sphereIntersect(сollider)) return true;
  return false;
};

export const isSphereCollitions = (scope, сollider) => {
  scope.result = scope.octree.sphereIntersect(сollider);
  scope.resultDoors = scope.octreeDoors.sphereIntersect(сollider);
  scope.resultEnemies = scope.octreeEnemies.sphereIntersect(сollider);
  if (scope.result || scope.resultDoors || scope.resultEnemies) return true;
  return false;
};

export const isSphereHeroCollitions = (scope, сollider) => {
  scope.result = scope.octree.sphereIntersect(сollider);
  scope.resultDoors = scope.octreeDoors.sphereIntersect(сollider);
  scope.resultEnemies = scope.octreeHeroEnemies.sphereIntersect(сollider);
  if (scope.result || scope.resultDoors || scope.resultEnemies) return true;
  return false;
};

// let arrowHelper;

export const isEnemyCanShot = (scope, enemy) => {
  // get ray
  scope.direction.copy(enemy.mesh.getWorldDirection(scope.direction).normalize());
  scope.ray = new Three.Ray(enemy.collider.center, scope.direction);

  if (enemy.name !== OBJECTS.DRONES.name) {
    scope.result = scope.octree.rayIntersect(scope.ray);
    scope.resultDoors = scope.octreeDoors.rayIntersect(scope.ray);
    scope.resultEnemies = scope.octreeEnemies.rayIntersect(scope.ray);

    // arrowHelper = new Three.ArrowHelper(scope.direction, enemy.collider.center, 10, 0xffffff);
    // scope.scene.add(arrowHelper);

    if (scope.result || scope.resultDoors || scope.resultEnemies) {
      if (scope.result && scope.resultDoors && scope.resultEnemies) {
        scope.number = Math.min(scope.result.distance, scope.resultDoors.distance);
        scope.number = Math.min(scope.number, scope.resultEnemies.distance);
      } else if (scope.result && !scope.resultDoors && scope.resultEnemies) {
        scope.number = Math.min(scope.result.distance, scope.resultEnemies.distance);
      } else if (scope.result && scope.resultDoors && !scope.resultEnemies) {
        scope.number = Math.min(scope.result.distance, scope.resultDoors.distance);
      } else if (!scope.result && scope.resultDoors && scope.resultEnemies) {
        scope.number = Math.min(scope.resultDoors.distance, scope.resultEnemies.distance);
      } else if (scope.result && !scope.resultDoors && !scope.resultEnemies) {
        scope.number = scope.result.distance;
      } else if (!scope.result && scope.resultDoors && !scope.resultEnemies) {
        scope.number = scope.resultDoors.distance;
      } else scope.number = scope.resultEnemies.distance;

      return scope.number > 10;
    }
  } else {
    scope.result = scope.octree.rayIntersect(scope.ray);
    scope.resultDoors = scope.octreeDoors.rayIntersect(scope.ray);

    // arrowHelper = new Three.ArrowHelper(scope.direction, enemy.collider.center, 20, 0xffffff);
    // scope.scene.add(arrowHelper);

    if (scope.result || scope.resultDoors) {
      if (scope.result && scope.resultDoors) {
        scope.number = Math.min(scope.result.distance, scope.resultDoors.distance);
      } else if (scope.result && !scope.resultDoors) {
        scope.number = scope.result.distance;
      } else scope.number = scope.resultDoors.distance;

      return scope.number > 10;
    }
  }
  return true;
};

export const isEnemyCanFlyDown = (scope, enemy) => {
  scope.ray = new Three.Ray(enemy.collider.center, scope.yN);

  scope.result = scope.octree.rayIntersect(scope.ray);
  scope.resultEnemies = scope.octreeEnemies.rayIntersect(scope.ray);

  // arrowHelper = new Three.ArrowHelper(scope.yN, enemy.collider.center, 6, 0xffffff);
  // scope.scene.add(arrowHelper);

  if (scope.result || scope.resultEnemies) {
    if (scope.result && scope.resultEnemies) {
      scope.number = Math.min(scope.result.distance, scope.resultEnemies.distance);
    } else if (scope.result && !scope.resultEnemies) {
      scope.number = scope.result.distance;
    } else scope.number = scope.resultEnemies.distance;
    return scope.number > 6;
  }
  return true;
};

export const isToHeroRayIntersectWorld = (scope, collider) => {
  // get ray
  scope.direction.subVectors(collider.center, scope.camera.position).negate().normalize();
  scope.ray = new Three.Ray(collider.center, scope.direction);

  scope.result = scope.octree.rayIntersect(scope.ray);
  scope.resultDoors = scope.octreeDoors.rayIntersect(scope.ray);

  // arrowHelper = new Three.ArrowHelper(scope.direction, сollider.center, scope.resultEnemies.distance, 0xffffff);
  // scope.scene.add(arrowHelper);

  if (scope.result || scope.resultDoors) {
    if (scope.result && scope.resultDoors) {
      scope.number = Math.min(scope.result.distance, scope.resultDoors.distance);
    } else if (scope.result && !scope.resultDoors) {
      scope.number = scope.result.distance;
    } else scope.number = scope.resultDoors.distance;

    scope.dictance = scope.camera.position.distanceTo(collider.center);

    return scope.number < scope.dictance;
  }
  return false;
};

export const updateEnemiesOctree = (scope) => {
  if (scope.enemies.length > 0) {
    scope.group = new Three.Group();
    scope.enemies.forEach((enemy) => {
      scope.group.add(enemy.pseudoLarge);
    });
    scope.octreeEnemies = new Octree();
    scope.octreeEnemies.fromGraphNode(scope.group);
    scope.scene.add(scope.group);
  }
};

export const updateHeroEnemiesOctree = (scope) => {
  if (scope.enemies.length > 0) {
    scope.group = new Three.Group();
    scope.enemies.forEach((enemy) => {
      scope.group.add(enemy.pseudo);
    });
    scope.octreeHeroEnemies = new Octree();
    scope.octreeHeroEnemies.fromGraphNode(scope.group);
    scope.scene.add(scope.group);
  }
};

export const updateEnemiesPersonalOctree = (scope, id) => {
  scope.group = new Three.Group();
  scope.enemies.filter(obj => obj.id !== id).forEach((enemy) => {
    scope.group.add(enemy.pseudoLarge);
  });
  scope.octreeEnemies = new Octree();
  scope.octreeEnemies.fromGraphNode(scope.group);
  scope.scene.add(scope.group);
};

export const enemyToActiveMode = (scope, enemy) => {
  enemy.mode = DESIGN.ENEMIES.mode.active;
  scope.events.messagesByIdDispatchHelper(scope, 3, 'discovered', enemy.mesh.name);
  if (!enemy.isPlay) {
    enemy.isPlay = true;
    if (enemy.name !== OBJECTS.DRONES.name) scope.audio.startObjectSound(enemy.id, 'mechanism');
    else scope.audio.startObjectSound(enemy.id, 'fly');
  }
};

export const setNewEnemy = (name) => {
  return {
    mode: DESIGN.ENEMIES.mode.idle,
    health: DESIGN.ENEMIES[name].health,
    height: DESIGN.ENEMIES[name].size,
    velocity: new Three.Vector3(),
    speed: DESIGN.ENEMIES[name].speed,
    distance: DESIGN.ENEMIES[name].distance,
    jump: DESIGN.ENEMIES[name].jump ? DESIGN.ENEMIES[name].jump : null,
    distanceToHero: null,
    enjoyClock: new Three.Clock(false),
    enjoyTime: 0,
    updateClock: new Three.Clock(false),
    updateTime: 0,
    isEnjoy: false,
    isOnJump: false,
    isOnFloor: true,
    speedCooeficient: 1,
    bend: plusOrMinus(),
    fly: name === OBJECTS.DRONES.name ? plusOrMinus() : null,
    isPlay: false,
  };
};
