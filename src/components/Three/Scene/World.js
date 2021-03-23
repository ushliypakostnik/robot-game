import * as Three from 'three';

import { GLTFLoader } from '@/components/Three/Modules/Utils/GLTFLoader';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  loaderDispatchHelper,
  yesOrNo,
  degreesToRadians,
  radiansToDegrees,
} from '@/utils/utilities';

function World() {
  const loader = new GLTFLoader();

  let sky;

  const lamps = [];

  let rx;

  this.init = (scope) => {
    // Lights

    // Hemisphere
    const light = new Three.HemisphereLight(0xffffff, 0xdddddd, 0.5);
    light.position.set(0, DESIGN.WORLD_SIZE / 4, 0).normalize();
    scope.scene.add(light);

    // Ambient
    scope.scene.add(new Three.AmbientLight(0xffffff));


    // Sky
    const geometry = new Three.SphereGeometry(DESIGN.WORLD_SIZE * 2, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    const texture = new Three.TextureLoader().load('./images/textures/sky.jpg');
    const material = new Three.MeshBasicMaterial({ map: texture });
    sky = new Three.Mesh(geometry, material);

    sky.rotateX(Math.PI / 4);
    sky.rotateY(Math.PI / 5);
    sky.rotateZ(Math.PI / 4);

    scope.scene.add(sky);


    // World

    const textureFloor = new Three.TextureLoader().load('./images/textures/concrete1.jpg', () => {
      scope.render();
      loaderDispatchHelper(scope.$store, 'isConcreteLoaded');
    });
    const materialFloor = new Three.MeshStandardMaterial({ color: 0x555555 });

    const textureWallsNormal = new Three.TextureLoader().load('./images/textures/concrete2.jpg', () => {
      scope.render();
      loaderDispatchHelper(scope.$store, 'isConcrete1Loaded');
    });

    const textureWallsLarge = new Three.TextureLoader().load('./images/textures/concrete3.jpg', () => {
      // scope.render();
      loaderDispatchHelper(scope.$store, 'isConcrete2Loaded');
    });

    const materialWallsNormal = new Three.MeshStandardMaterial({ color: 0x999999 });
    const materialWallsLarge = new Three.MeshStandardMaterial({ color: 0x999999 });

    loader.load('./images/models/Scene.glb', (glb) => {
      scope.octree.fromGraphNode(glb.scene);

      glb.scene.traverse((child) => {
        if (child.isMesh) {
          // console.log(child.name);
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.name.includes('ground')) {
            child.material = materialFloor;
            child.material.map = textureFloor;
            child.material.map.repeat.set(1, 1);
          } else if (child.name.includes('wall')) {
            child.material = materialWallsLarge;
            child.material.map = textureWallsLarge;
            child.material.map.repeat.set(0.25, 2);
          } else {
            child.material = materialWallsNormal;
            child.material.map = textureWallsNormal;
            child.material.map.repeat.set(0.25, 0.5);
          }

          child.material.map.anisotropy = 8;
          child.material.map.wrapS = child.material.map.wrapT = Three.RepeatWrapping;
          child.material.map.encoding = Three.sRGBEncoding;
        }
      });

      scope.scene.add(glb.scene);
      scope.render();
      loaderDispatchHelper(scope.$store, 'isWorldLoaded');
    });


    // Leader

    const textureLeader = new Three.TextureLoader().load('./images/textures/leader.jpg', () => {
      const leaderMaterial = new Three.MeshStandardMaterial({ color: 0xfffffff, map: textureLeader });
      const leaderGeometry = new Three.PlaneGeometry(10, 10);
      const leaderMesh = new Three.Mesh(leaderGeometry, leaderMaterial);

      leaderMesh.material.map.repeat.set(1, 1);
      leaderMesh.material.map.wrapS = leaderMesh.material.map.wrapT = Three.RepeatWrapping;
      leaderMesh.material.map.encoding = Three.sRGBEncoding;

      leaderMesh.position.set(-18.9, 9, 8);
      leaderMesh.rotateY(Math.PI / 2);
      leaderMesh.receiveShadow = true;

      leaderMesh.updateMatrix();
      leaderMesh.matrixAutoUpdate = false;

      scope.scene.add(leaderMesh);

      scope.render();
      loaderDispatchHelper(scope.$store, 'isLeaderLoaded');
    });


    // Lamps

    const lampLight = new Three.PointLight(0xffff99, 1.5, 100);
    let lampLightClone;

    const lampMaterial = new Three.MeshStandardMaterial({ color: 0xffff99 });
    lampMaterial.blending = Three.NoBlending;
    lampMaterial.receiveShadow = false;
    lampMaterial.castShadow = false;
    const lampGeometry = new Three.SphereBufferGeometry(1, 32, 32);
    const lampMesh = new Three.Mesh(lampGeometry, lampMaterial);
    let lampMeshClone;

    const lampElementsMaterial = new Three.MeshStandardMaterial({ color: 0x000000 });
    lampElementsMaterial.blending = Three.NoBlending;
    lampElementsMaterial.receiveShadow = false;
    lampElementsMaterial.castShadow = false;
    const lampElement1Geometry = new Three.CylinderGeometry(0.5, 0.5, 0.5, 32, 1);
    const lampElement2Geometry = new Three.CylinderGeometry(0.05, 0.05, 4, 32, 1);
    const lampElement1Mesh = new Three.Mesh(lampElement1Geometry, lampElementsMaterial);
    const lampElement2Mesh = new Three.Mesh(lampElement2Geometry, lampElementsMaterial);
    let lampElement1MeshClone;
    let lampElement2MeshClone;

    for (let i = 0; i < OBJECTS.LAMPS.position.length; i++) {
      lampLightClone = lampLight.clone();
      lampMeshClone = lampMesh.clone();
      lampElement1MeshClone = lampElement1Mesh.clone();
      lampElement2MeshClone = lampElement2Mesh.clone();

      lampLightClone.position.y = OBJECTS.LAMPS.position[i][1] - 14;
      lampMeshClone.position.y = OBJECTS.LAMPS.position[i][1] - 14;
      lampElement1MeshClone.position.y = OBJECTS.LAMPS.position[i][1] - 13;
      // eslint-disable-next-line prefer-destructuring
      lampElement2MeshClone.position.y = OBJECTS.LAMPS.position[i][1] - 11;

      lampMeshClone.updateMatrix();
      lampMeshClone.matrixAutoUpdate = false;
      lampElement1MeshClone.updateMatrix();
      lampElement1MeshClone.matrixAutoUpdate = false;
      lampElement2MeshClone.updateMatrix();
      lampElement2MeshClone.matrixAutoUpdate = false;

      const lamp = new Three.Group();
      lamp.add(lampLightClone);
      lamp.add(lampMeshClone);
      lamp.add(lampElement1MeshClone);
      lamp.add(lampElement2MeshClone);
      lamp.position.set(OBJECTS.LAMPS.position[i][0], OBJECTS.LAMPS.position[i][1] + 11, OBJECTS.LAMPS.position[i][2]);
      rx = yesOrNo();

      console.log(lampLightClone);

      lamps.push({
        group: lamp,
        light: lampLightClone,
        rotationDirection: rx,
      });

      scope.scene.add(lamp);
    }
  };

  this.animate = (scope) => {
    sky.rotateY(scope.delta / 25);

    lamps.forEach((lamp) => {
      lamp.group.rotation.z += degreesToRadians(lamp.rotationDirection * scope.delta * 10);

      if (radiansToDegrees(lamp.group.rotation.z) > 30) lamp.rotationDirection = -1;
      else if (radiansToDegrees(lamp.group.rotation.z) < -30) lamp.rotationDirection = 1;
    });
  };
}

export default World;
