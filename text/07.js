// В @/utils/constatnts.js:
export const DESIGN = {
  OCTREE_UPDATE_TIMEOUT: 0.5,
  // ...
};


// В @/utils/utilities.js:
// Обновить персональное октодерево врагов для одного врага
import * as Three from "three";
import { Octree } from "../components/Three/Modules/Math/Octree";

export const updateEnemiesPersonalOctree = (scope, id) => {
  scope.group = new Three.Group();
  scope.enemies.filter(obj => obj.id !== id).forEach((enemy) => {
    scope.group.add(enemy.pseudoLarge);
  });
  scope.octreeEnemies = new Octree();
  scope.octreeEnemies.fromGraphNode(scope.group);
  scope.scene.add(scope.group);
};


// В @/components/Three/Scene/Enemies.js:
import { DESIGN } from '@/utils/constants';
let result = new Three.Vector3();

// Столкновения врагов
const enemyCollitions = (scope, enemy) => {
  // Столкновения c миром - полом, стенами, стеклами и трубами
  scope.result = scope.octree.sphereIntersect(enemy.collider);
  enemy.isOnFloor = false;

  if (scope.result) {
    enemy.isOnFloor = scope.result.normal.y > 0;
    // На полу?
    if (!enemy.isOnFloor) {
      enemy.velocity.addScaledVector(scope.result.normal, -scope.result.normal.dot(enemy.velocity));
    } else {
      // Подбитый враг становится совсем мертвым после падения на пол и тд
      // ...
    }

    enemy.collider.translate(scope.result.normal.multiplyScalar(scope.result.depth));
  }

  // Столкновения c дверями
  scope.resultDoors = scope.octreeDoors.sphereIntersect(enemy.collider);
  if (scope.resultDoors) {
    enemy.collider.translate(scope.resultDoors.normal.multiplyScalar(scope.resultDoors.depth));
  }

  // Делаем октодерево из всех врагов без этого, если давно не делали
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
