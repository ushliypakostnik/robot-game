import * as Three from 'three';

import { GLTFLoader } from '@/components/Three/Modules/Utils/GLTFLoader';

import { DESIGN } from '@/utils/constants';

import {
  loaderDispatchHelper,
} from '@/utils/utilities';

function World() {
  const loader = new GLTFLoader();

  this.init = (scope) => {
    // Lights

    // Hemisphere
    const light = new Three.HemisphereLight(0xffffff, 0xdddddd, 0.5);
    light.position.set(0, DESIGN.GROUND_SIZE / 4, 0).normalize();
    scope.scene.add(light);

    // Ambient
    scope.scene.add(new Three.AmbientLight(0xffffff));

    const directionalLight = new Three.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 100, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.left = - 30;
    directionalLight.shadow.camera.top	= 30;
    directionalLight.shadow.camera.bottom = - 30;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.radius = 4;
    directionalLight.shadow.bias = - 0.00006;
    scope.scene.add(directionalLight);

    // World

    const textureFloor = new Three.TextureLoader().load('./images/textures/concrete1.jpg', () => {
      scope.render();
      loaderDispatchHelper(scope.$store, 'isConcreteLoaded');
    });
    const materialFloor = new Three.MeshStandardMaterial({ color: 0x555555 });

    const textureWalls = new Three.TextureLoader().load('./images/textures/concrete2.jpg', () => {
      scope.render();
      loaderDispatchHelper(scope.$store, 'isConcreteLoaded');
    });
    const materialWalls = new Three.MeshStandardMaterial({ color: 0x999999 });

    loader.load('./images/models/Scene.glb', (glb) => {
      scope.octree.fromGraphNode(glb.scene);

      glb.scene.traverse((child) => {
        if (child.isMesh) {
          // console.log(child.name);
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.name === 'Плоскость') {
            child.material = materialFloor;
            child.material.map = textureFloor;
            child.material.map.repeat.set(1, 1);
          } else {
            child.material = materialWalls;
            child.material.map = textureWalls;
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
  };
}

export default World;
