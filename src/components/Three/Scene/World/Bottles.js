/* eslint-disable dot-notation,prefer-destructuring */
import * as Three from 'three';

import { GLTFLoader } from '@/components/Three/Modules/Utils/GLTFLoader';

import { DESIGN, OBJECTS } from '@/utils/constants';

import { loaderDispatchHelper } from '@/utils/utilities';

function Bottles() {
  let bottleClone;
  let bottleGroup;
  let bottlePseudo;
  let bottlePseudoClone;

  this.init = (
    scope,
    pseudoGeometry,
    pseudoMaterial,
  ) => {
    bottlePseudo = new Three.Mesh(pseudoGeometry, pseudoMaterial);

    new GLTFLoader().load(
      './images/models/Objects/Bottle.glb',
      (bottle) => {
        loaderDispatchHelper(scope.$store, 'isBottleLoaded');

        for (let i = 0; i < OBJECTS.BOTTLES[scope.l].data.length; i++) {
          // eslint-disable-next-line no-loop-func
          bottle.scene.traverse((child) => {
            if (child.isMesh) {
              if (child.name.includes('wine')) {
                child.material = new Three.MeshPhongMaterial({ color: DESIGN.COLORS.greenDark4 });
              } else if (child.name.includes('top')) {
                child.material = new Three.MeshPhongMaterial({ color: DESIGN.COLORS.black });
              } else if (child.name.includes('glass')) {
                child.material = new Three.MeshPhongMaterial({ color: DESIGN.COLORS.greenDark3 });
              }
              child.material.blending = Three.NoBlending;
            }
          });

          bottleClone = bottle.scene.clone();
          bottlePseudoClone = bottlePseudo.clone();

          bottlePseudoClone.name = OBJECTS.BOTTLES.name;
          bottlePseudoClone.position.y += 1.5;
          bottlePseudoClone.visible = false;

          bottlePseudoClone.updateMatrix();
          bottlePseudoClone.matrixAutoUpdate = false;

          bottleGroup = new Three.Group();
          bottleGroup.add(bottleClone);
          bottleGroup.add(bottlePseudoClone);

          bottleGroup.position.set(
            OBJECTS.BOTTLES[scope.l].data[i].x,
            OBJECTS.BOTTLES[scope.l].data[i].y,
            OBJECTS.BOTTLES[scope.l].data[i].z,
          );

          scope.things.push({
            id: bottlePseudoClone.id,
            group: bottleGroup,
          });

          scope.objects.push(bottlePseudoClone);
          scope.scene.add(bottleGroup);
        }
        loaderDispatchHelper(scope.$store, 'isBottlesBuilt');
      },
    );
  };
}

export default Bottles;
