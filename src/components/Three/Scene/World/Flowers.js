/* eslint-disable dot-notation,prefer-destructuring */
import * as Three from 'three';

import { GLTFLoader } from '@/components/Three/Modules/Utils/GLTFLoader';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  loaderDispatchHelper,
  randomInteger,
} from '@/utils/utilities';

function Flowers() {
  let potClone;
  let flowerClone;
  let flowerGroup;
  let flowerPseudo;
  let flowerPseudoClone;
  let flowerColor;
  let color;

  this.init = (
    scope,
    wallsNormalMaterial,
    wallsNormalTexture,
    sandMaterial,
    sandTexture,
    pseudoGeometry,
    pseudoMaterial,
  ) => {
    flowerPseudo = new Three.Mesh(pseudoGeometry, pseudoMaterial);

    new GLTFLoader().load(
      './images/models/Objects/Pot.glb',
      (pot) => {
        loaderDispatchHelper(scope.$store, 'isPotLoaded');

        pot.scene.traverse((child) => {
          if (child.isMesh) {
            if (child.name.includes('pot')) {
              child.material = wallsNormalMaterial;
              child.material.map = wallsNormalTexture;
            } else if (child.name.includes('sand')) {
              child.material = sandMaterial;
              child.material.map = sandTexture;
            }

            child.material.map.wrapS = child.material.map.wrapT = Three.RepeatWrapping;
            child.material.map.encoding = Three.sRGBEncoding;
          }
        });

        for (let i = 0; i < OBJECTS.FLOWERS[scope.l].data.length; i++) {
          potClone = pot.scene.clone();

          potClone.position.set(
            OBJECTS.FLOWERS[scope.l].data[i].x,
            OBJECTS.FLOWERS[scope.l].data[i].y,
            OBJECTS.FLOWERS[scope.l].data[i].z,
          );

          potClone.updateMatrix();
          potClone.matrixAutoUpdate = false;

          scope.scene.add(potClone);
        }

        new GLTFLoader().load(
          './images/models/Objects/Flower.glb',
          (flower) => {
            loaderDispatchHelper(scope.$store, 'isFlowerLoaded');

            for (let i = 0; i < OBJECTS.FLOWERS[scope.l].data.length; i++) {
              flowerClone = flower.scene.clone();
              flowerColor = randomInteger(1, 4);
              // eslint-disable-next-line no-loop-func
              flowerClone.traverse((child) => {
                if (child.isMesh) {
                  if (child.name.includes('stem')) {
                    child.material = new Three.MeshPhongMaterial({ color: DESIGN.COLORS.greenDark });
                  } else if (child.name.includes('bud')) {
                    switch (flowerColor) {
                      case 1:
                        child.material = new Three.MeshPhongMaterial({ color: DESIGN.COLORS.redDark });
                        color = DESIGN.FLOWERS.red;
                        break;
                      case 2:
                        child.material = new Three.MeshPhongMaterial({ color: DESIGN.COLORS.orangeDark });
                        color = DESIGN.FLOWERS.orange;
                        break;
                      case 3:
                        child.material = new Three.MeshPhongMaterial({ color: DESIGN.COLORS.greenDark2 });
                        color = DESIGN.FLOWERS.green;
                        break;
                      case 4:
                        child.material = new Three.MeshPhongMaterial({ color: DESIGN.COLORS.purpleDark });
                        color = DESIGN.FLOWERS.purple;
                        break;
                      default:
                        break;
                    }
                    child.material.blending = Three.NoBlending;
                    child.material.side = Three.DoubleSide;
                  }
                }
              });

              flowerClone.updateMatrix();
              flowerClone.matrixAutoUpdate = false;

              flowerPseudoClone = flowerPseudo.clone();

              flowerPseudoClone.position.y += 1.5;

              flowerPseudoClone.name = `${OBJECTS.FLOWERS.name}${color}`;
              flowerPseudoClone.visible = false;

              flowerPseudoClone.updateMatrix();
              flowerPseudoClone.matrixAutoUpdate = false;

              flowerGroup = new Three.Group();
              flowerGroup.add(flowerClone);
              flowerGroup.add(flowerPseudoClone);

              flowerGroup.position.set(
                OBJECTS.FLOWERS[scope.l].data[i].x,
                OBJECTS.FLOWERS[scope.l].data[i].y,
                OBJECTS.FLOWERS[scope.l].data[i].z,
              );

              scope.things.push({
                id: flowerPseudoClone.id,
                group: flowerGroup,
                color,
              });

              scope.objects.push(flowerPseudoClone);
              scope.scene.add(flowerGroup);
            }

            scope.render();
            loaderDispatchHelper(scope.$store, 'isFlowersBuilt');
          },
        );
      },
    );
  };
}

export default Flowers;
