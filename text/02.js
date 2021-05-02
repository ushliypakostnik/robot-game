/* eslint-disable no-unused-vars */
import * as Three from 'three';

import { DESIGN } from '@/utils/constants';

function Module() {
  let variable; // локальная переменная - когда очень удобна или необходима при инициализации или во всей логике
  // ...

  // Инициализация
  this.init = (
    scope,
    texture1,
    material1,
    // ...
  ) => {
    // variable = ...
    // ...
  };

  // Функция анимационного цикла для этого модуля - опционально (предметы, например, не нужно анимировать)
  this.animate = (scope) => {
    // А вот тут и в остальной логике стараемся использовать уже только переменные Scene.vue:
    scope.moduleObjectsSore.filter(object => object.mode === DESIGN.ENEMIES.mode.active).forEach((object) => {
      // scope.number = ...
      // scope.direction = new Three.Vector3(...);
      // variable = ... - но так, конечно, тоже можно, главное не let variableNew;
      // ...
    });
  };
}

export default Module;
