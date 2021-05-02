// В @/utils/constatnts.js:
export const DESIGN = {
  DIFFICULTY: {
    civil: 'civil',
    anarchist: 'anarchist',
    communist: 'communist',
  },
  ENEMIES: {
    mode: {
      idle: 'idle',
      active: 'active',
      dies: 'dies',
      dead: 'dead',
    },
    spider: {
      // ...
      decision: {
        enjoy: 60,
        rotate: 25,
        shot: {
          civil: 40,
          anarchist: 30,
          communist: 25,
        },
        jump: 50,
        speed: 20,
        bend: 30,
      },
    },
    drone: {
      // ...
      decision: {
        enjoy: 50,
        rotate: 25,
        shot: {
          civil: 50,
          anarchist: 40,
          communist: 30,
        },
        fly: 40,
        speed: 20,
        bend: 25,
      },
    },
  },
  // ...
};

// В @/components/Three/Scene/Enemies.js:
import { DESIGN } from '@/utils/constants';

import {
  randomInteger,
  isEnemyCanShot,
  // ...
} from "@/utils/utilities";

function Enemies() {
  // ...


  const idle = (scope, enemy) => {
    // ...
  };

  const active = (scope, enemy) => {
    // ...

    // Где-то в логике агрессивного режима: hешение на выстрел (если отдыхает)
    scope.decision = randomInteger(1, DESIGN.ENEMIES[enemy.name].decision.shot[scope.difficulty]) === 1;
    if (scope.decision) {
      if (isEnemyCanShot(scope, enemy)) {
        scope.boolean = enemy.name === OBJECTS.DRONES.name;
        scope.world.shots.addShotToBus(scope, enemy.mesh.position, scope.direction, scope.boolean);
        scope.audio.replayObjectSound(enemy.id, 'shot');
      }
    }
  };

  const gravity = (scope, enemy) => {
    // ...
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
