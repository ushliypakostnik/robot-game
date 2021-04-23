import * as Three from 'three';

import { GLTFLoader } from '@/components/Three/Modules/Utils/GLTFLoader';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  loaderDispatchHelper,
  randomInteger,
  degreesToRadians,
  updateEnemiesOctree,
  setNewEnemy,
} from '@/utils/utilities';

function Spiders() {
  let spiderClone;
  let pseudoClone;
  let pseudoLargeClone;
  let scaleClone;

  let height;
  let rotate;

  this.init = (
    scope,
    metallDarkMaterial,
    metallTexture,
    holeMaterial,
    glasslMaterial,
    pseudoMaterial,
    scaleGeometry,
    scaleMaterial,
  ) => {
    height = OBJECTS.SPIDERS.size;

    const pseudoGeometry = new Three.BoxBufferGeometry(
      height / 1.25,
      height / 1.75,
      height / 1.25,
    );
    const pseudoLargeGeometry = pseudoGeometry.clone();
    pseudoLargeGeometry.scale(2, 2, 2);

    new GLTFLoader().load(
      './images/models/Objects/Spider.glb',
      (spider) => {
        loaderDispatchHelper(scope.$store, 'isSpiderLoaded');

        spider.scene.traverse((child) => {
          if (child.isMesh) {
            if (child.name.includes('metall')) {
              child.material = metallDarkMaterial;
              child.material.map = metallTexture;
            } else if (child.name.includes('hole')) {
              child.material = holeMaterial;
            } else if (child.name.includes('glass')) {
              child.material = glasslMaterial;
              child.material.color = new Three.Color(DESIGN.COLORS.red);
            }
          }
        });

        const pseudo = new Three.Mesh(pseudoGeometry, pseudoMaterial);
        const pseudoLarge = new Three.Mesh(pseudoLargeGeometry, pseudoMaterial);
        const scale = new Three.Mesh(scaleGeometry, scaleMaterial);

        for (let i = 0; i < OBJECTS.SPIDERS[scope.l].data.length; i++) {
          spiderClone = spider.scene.clone();
          pseudoClone = pseudo.clone();
          pseudoLargeClone = pseudoLarge.clone();
          scaleClone = scale.clone();

          spiderClone.name = OBJECTS.SPIDERS.name;

          spiderClone.position.set(
            OBJECTS.SPIDERS[scope.l].data[i].x,
            OBJECTS.SPIDERS[scope.l].data[i].y + height / 2,
            OBJECTS.SPIDERS[scope.l].data[i].z,
          );

          scaleClone.position.set(
            OBJECTS.SPIDERS[scope.l].data[i].x,
            OBJECTS.SPIDERS[scope.l].data[i].y + height,
            OBJECTS.SPIDERS[scope.l].data[i].z,
          );
          scaleClone.scale.set(DESIGN.ENEMIES[OBJECTS.SPIDERS.name].health / 100, 1, DESIGN.ENEMIES[OBJECTS.SPIDERS.name].health / 100);

          pseudoClone.position.copy(spiderClone.position);
          pseudoClone.visible = false;
          pseudoLargeClone.position.copy(spiderClone.position);
          pseudoLargeClone.visible = false;

          rotate = degreesToRadians(randomInteger(-1, 360));
          spiderClone.rotateY(rotate);
          pseudoClone.rotateY(rotate);
          pseudoLargeClone.rotateY(rotate);

          scope.enemies.push({
            id: spiderClone.id,
            mesh: spiderClone,
            pseudo: pseudoClone,
            pseudoLarge: pseudoLargeClone,
            collider: new Three.Sphere(spiderClone.position, height / 2),
            scale: scaleClone,
            name: OBJECTS.SPIDERS.name,
            ...setNewEnemy('SPIDERS'),
          });

          scope.scene.add(spiderClone);
          scope.scene.add(pseudoClone);
          scope.scene.add(pseudoLargeClone);
          scope.scene.add(scaleClone);
        }
        loaderDispatchHelper(scope.$store, 'isSpidersBuilt');

        updateEnemiesOctree(scope);
        scope.world.enemies.setScales(scope);
      },
    );
  };
}

export default Spiders;
