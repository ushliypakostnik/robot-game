// В @/components/Three/Scene/World/Thing.js:
import * as Three from 'three';

import { GLTFLoader } from '@/components/Three/Modules/Utils/GLTFLoader';

import { OBJECTS } from '@/utils/constants';

import { loaderDispatchHelper } from '@/utils/utilities';

function Thing() {
  let thingClone;
  let thingGroup;
  let thingPseudo;
  let thingPseudoClone;

  this.init = (
    scope,
    pseudoGeometry,
    pseudoMaterial,
  ) => {
    thingPseudo = new Three.Mesh(pseudoGeometry, pseudoMaterial);

    new GLTFLoader().load(
      './images/models/Objects/Thing.glb',
      (thing) => {
        loaderDispatchHelper(scope.$store, 'isThingLoaded'); // загружена модель

        for (let i = 0; i < OBJECTS.THINGS[scope.l].data.length; i++) {
          // eslint-disable-next-line no-loop-func
          thing.scene.traverse((child) => {
            // ... - тут "покраска" материалами частей вещи
          });

          // Клонируем объект и псевдо
          thingClone = thing.scene.clone();
          thingPseudoClone = thingPseudo.clone();

          // Псевдо нужно дать правильное имя чтобы мы могли различать его при кастинге
          thingPseudoClone.name = OBJECTS.THINGS.name;
          thingPseudoClone.position.y += 1.5; // корректируем немного позицию по высоте
          thingPseudoClone.visible = false; // выключаем рендер

          thingPseudoClone.updateMatrix(); // обновляем
          thingPseudoClone.matrixAutoUpdate = false; // запрещаем автообновление

          // Делаем из обхекта и псевдо удобную группу
          thingGroup = new Three.Group();
          thingGroup.add(thingClone);
          thingGroup.add(thingPseudoClone);

          // Выставляем координаты из собранных из модели уровня данных
          thingGroup.position.set(
            OBJECTS.THINGS[scope.l].data[i].x,
            OBJECTS.THINGS[scope.l].data[i].y,
            OBJECTS.THINGS[scope.l].data[i].z,
          );

          // Записываем в "рабочие объеты" - по ним будем кастить и прочее
          scope.things.push({
            id: thingPseudoClone.id,
            group: thingGroup,
          });
          scope.objects.push(thingPseudoClone);

          scope.scene.add(thingGroup); // добавляем на сцену
        }
        loaderDispatchHelper(scope.$store, 'isThingsBuilt'); // построено
      },
    );
  };
}

export default Thing;


// В @/components/Three/Scene/Hero.js:
import { DESIGN, OBJECTS } from '@/utils/constants';

function Hero() {
  // ...

  this.animate = (scope) => {
    // ...

    // Raycasting

    // Forward ray
    scope.direction = scope.camera.getWorldDirection(scope.direction);
    scope.raycaster.set(scope.camera.getWorldPosition(scope.position), scope.direction);
    scope.intersections = scope.raycaster.intersectObjects(scope.objects);
    scope.onForward = scope.intersections.length > 0 ? scope.intersections[0].distance < DESIGN.HERO.CAST : false;

    if (scope.onForward) {
      scope.object = scope.intersections[0].object;

      // Кастим предмет THINGS
      if (scope.object.name.includes(OBJECTS.THINGS.name)) {
        // ...
      }
    }

    // ...
  };
}

export default Hero;
