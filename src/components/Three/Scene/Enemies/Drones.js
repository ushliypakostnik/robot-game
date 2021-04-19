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

function Drones() {
  let droneClone;
  let pseudoClone;
  let pseudoLargeClone;
  let scaleClone;

  let height;

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
    height = OBJECTS.DRONES.size;

    const pseudoGeometry = new Three.BoxBufferGeometry(
      height / 1.25,
      height / 1.75,
      height / 1.25,
    );
    const pseudoLargeGeometry = pseudoGeometry.clone();
    pseudoLargeGeometry.scale(2, 2, 2)

    new GLTFLoader().load(
      './images/models/Objects/Drone.glb',
      (drone) => {
        loaderDispatchHelper(scope.$store, 'isDroneLoaded');

        drone.scene.traverse((child) => {
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

        for (let i = 0; i < OBJECTS.DRONES[scope.l].data.length; i++) {
          droneClone = drone.scene.clone();
          pseudoClone = pseudo.clone();
          pseudoLargeClone = pseudoLarge.clone();
          scaleClone = scale.clone();

          droneClone.name = OBJECTS.DRONES.name;

          droneClone.position.set(
            OBJECTS.DRONES[scope.l].data[i].x,
            OBJECTS.DRONES[scope.l].data[i].y + height / 2,
            OBJECTS.DRONES[scope.l].data[i].z,
          );

          scaleClone.position.set(
            OBJECTS.DRONES[scope.l].data[i].x,
            OBJECTS.DRONES[scope.l].data[i].y + height,
            OBJECTS.DRONES[scope.l].data[i].z,
          );

          pseudoClone.position.copy(droneClone.position);
          pseudoClone.visible = false;
          pseudoLargeClone.position.copy(droneClone.position);
          pseudoLargeClone.visible = false;

          droneClone.rotateY(degreesToRadians(randomInteger(-1, 360)));

          scope.enemies.push({
            id: droneClone.id,
            mesh: droneClone,
            pseudo: pseudoClone,
            pseudoLarge: pseudoLargeClone,
            collider: new Three.Sphere(droneClone.position, height / 2),
            scale: scaleClone,
            name: OBJECTS.DRONES.name,
            ...setNewEnemy('DRONES'),
          });

          scope.scene.add(droneClone);
          scope.scene.add(pseudoClone);
          scope.scene.add(pseudoLargeClone);
          scope.scene.add(scaleClone);
        }
        loaderDispatchHelper(scope.$store, 'isDronesBuilt');

        updateEnemiesOctree(scope);
        scope.world.enemies.setScales(scope);
      },
    );
  };
}

export default Drones;
