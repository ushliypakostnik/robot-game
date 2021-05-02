/* eslint-disable no-unused-vars */
import * as Three from 'three';

import { DESIGN } from '@/utils/constants';

function Module() {
  let variable; // локальная переменная - когда очень удобна или необходима при инициализации
  // ...

  this.init = (
    scope,
    texture1,
    material1,
    // ...
  ) => {
    // variable = ...
    // ...
  };

  this.animate = (scope) => {
    // А вот тут используем уже только переменные ТОЛЬКО Scene.vue:
    scope.moduleObjectsSore.filter(object => object.mode === DESIGN.ENEMIES.mode.active).forEach((object) => {
      // scope.number = ...
      // scope.direction = new Three.Vector3(...);
      // ...
    });
  };
}

export default Module;
