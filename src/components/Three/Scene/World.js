import * as Three from 'three';

import { GLTFLoader } from '@/components/Three/Modules/Utils/GLTFLoader';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  loaderDispatchHelper,
} from '@/utils/utilities';

function World() {
  let sky;
  const laserTraps = [];

  this.init = (scope) => {
    // Lights

    // Hemisphere
    const light = new Three.HemisphereLight(DESIGN.COLORS.white, DESIGN.COLORS.grayLight2, 0.5);
    light.position.set(0, DESIGN.WORLD_SIZE[scope.l] / 4, 0).normalize();
    scope.scene.add(light);

    // Ambient
    scope.scene.add(new Three.AmbientLight(DESIGN.COLORS.white));


    // Sky
    const skyGeometry = new Three.SphereBufferGeometry(DESIGN.WORLD_SIZE[scope.l] * 2, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    skyGeometry.scale(-1, 1, 1);

    const skyTexture = new Three.TextureLoader().load('./images/textures/sky.jpg');
    const skyMaterial = new Three.MeshBasicMaterial({ map: skyTexture });
    sky = new Three.Mesh(skyGeometry, skyMaterial);

    sky.rotateX(Math.PI / 4);
    sky.rotateY(Math.PI / 5);
    sky.rotateZ(Math.PI / 4);

    scope.scene.add(sky);


    // World

    const floorTexture = new Three.TextureLoader().load('./images/textures/concrete1.jpg', () => {
      scope.render();
      loaderDispatchHelper(scope.$store, 'isConcrete1Loaded');
    });

    const wallsNormalTexture = new Three.TextureLoader().load('./images/textures/concrete2.jpg', () => {
      scope.render();
      loaderDispatchHelper(scope.$store, 'isConcrete2Loaded');
    });

    const wallsLargeTexture = new Three.TextureLoader().load('./images/textures/concrete2.jpg', () => {
      loaderDispatchHelper(scope.$store, 'isConcrete3Loaded');
    });

    const wallsHightTexture = new Three.TextureLoader().load('./images/textures/concrete2.jpg', () => {
      scope.render();
      loaderDispatchHelper(scope.$store, 'isConcrete4Loaded');
    });

    const metallTexture = new Three.TextureLoader().load('./images/textures/metall.jpg', () => {
      scope.render();
      loaderDispatchHelper(scope.$store, 'isMetall1Loaded');
    });

    const doorsTexture = new Three.TextureLoader().load('./images/textures/metall.jpg', () => {
      scope.render();
      loaderDispatchHelper(scope.$store, 'isMetall2Loaded');
    });

    const floorMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.grayDark, blending: Three.NoBlending });
    const wallsNormalMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.gray });
    const wallsLargeMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.gray });
    const wallsHightMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.gray });
    const rodsMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.gray });
    const compsMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.grayDark });
    const doorsMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.grayLight });

    new GLTFLoader().load(`./images/models/${scope.l}/Scene.glb`, (glb) => {
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.name.includes('ground')) {
            child.material = floorMaterial;
            child.material.map = floorTexture;
            child.material.map.repeat.set(1, 1);
            child.material.map.anisotropy = 8;
          } else if (child.name.includes('wall')) {
            child.material = wallsLargeMaterial;
            child.material.map = wallsLargeTexture;
            child.material.map.repeat.set(0.25, 2);
            child.material.map.anisotropy = 8;
          } else if (child.name.includes('Hight')) {
            child.material = wallsHightMaterial;
            child.material.map = wallsHightTexture;
            child.material.map.anisotropy = 8;
            child.material.map.repeat.set(4, 1);
          } else if (child.name.includes('rod')) {
            child.material = rodsMaterial;
            child.material.map = metallTexture;
            child.material.map.repeat.set(1, 1);
          } else if (child.name.includes('comp')) {
            child.material = compsMaterial;
            child.material.map = metallTexture;
            child.material.map.repeat.set(2, 2);
          } else if (child.name.includes('door')) {
            if (!child.name.includes('Out')) {
              let direction;
              if (child.name.includes('Up')) direction = 'up';
              else if (child.name.includes('Down')) direction = 'down';

              let pass;
              if (child.name.includes('Purple')) pass = 'purple';
              else if (child.name.includes('Red')) pass = 'red';

              let rotate;
              if (child.name.includes('Z')) rotate = Math.PI / 2;
              else if (child.name.includes('X')) rotate = 0;

              OBJECTS.DOORS[scope.l].position.push([child.position.x, child.position.y, child.position.z, direction, pass, rotate]);
            }

            child.material = doorsMaterial;
            child.material.map = doorsTexture;
            child.material.map.repeat.set(0.1, 0.1);
          } else {
            child.material = wallsNormalMaterial;
            child.material.map = wallsNormalTexture;
            child.material.map.repeat.set(0.25, 0.5);
          }

          child.material.map.wrapS = child.material.map.wrapT = Three.RepeatWrapping;
          child.material.map.encoding = Three.sRGBEncoding;
        }
      });

      scope.octree.fromGraphNode(glb.scene);

      console.log(OBJECTS.DOORS[scope.l].position);

      scope.scene.add(glb.scene);
      scope.render();
      loaderDispatchHelper(scope.$store, 'isWorldBuild');


      // Doors customization

      const doorsMarkerTexture = new Three.TextureLoader().load('./images/textures/metall.jpg', () => {
        scope.render();
        loaderDispatchHelper(scope.$store, 'isMetall3Loaded');
      });

      // Маркер на двери на волю на уровне 1
      if (scope.l === 'level1') {
        const doorOutMarkerGeometry = new Three.CircleBufferGeometry(3.75, 32);
        const doorOutMarkerMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.blue, map: doorsMarkerTexture });
        const doorOutMarkerMesh = new Three.Mesh(doorOutMarkerGeometry, doorOutMarkerMaterial);

        doorOutMarkerMesh.material.map.repeat.set(0.25, 0.25);
        doorOutMarkerMesh.material.map.wrapS = doorOutMarkerMesh.material.map.wrapT = Three.RepeatWrapping;
        doorOutMarkerMesh.material.map.encoding = Three.sRGBEncoding;

        doorOutMarkerMesh.position.set(198.49, 10, 0);
        doorOutMarkerMesh.rotateY(Math.PI / -2);

        doorOutMarkerMesh.updateMatrix();
        doorOutMarkerMesh.matrixAutoUpdate = false;

        scope.scene.add(doorOutMarkerMesh);
      }

      const doorsMarkerGeometry = new Three.CircleBufferGeometry(1.5, 32);
      const doorsMarkerDefaultMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.white, map: doorsMarkerTexture });
      const doorsMarkerPurpleMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.purple, map: doorsMarkerTexture });
      const doorsMarkerRedMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.red, map: doorsMarkerTexture });
      const doorMarkerMesh = new Three.Mesh(doorsMarkerGeometry, doorsMarkerDefaultMaterial);
      let doorsMarkerClone1;
      let doorsMarkerClone2;

      for (let i = 0; i < OBJECTS.DOORS[scope.l].position.length; i++) {
        doorsMarkerClone1 = doorMarkerMesh.clone();
        doorsMarkerClone2 = doorMarkerMesh.clone();

        switch (OBJECTS.DOORS[scope.l].position[i][4]) {
          case 'purple':
            doorsMarkerClone1.material = doorsMarkerPurpleMaterial;
            doorsMarkerClone2.material = doorsMarkerPurpleMaterial;
            break;
          case 'red':
            doorsMarkerClone1.material = doorsMarkerRedMaterial;
            doorsMarkerClone2.material = doorsMarkerRedMaterial;
            break;
          default:
            break;
        }

        doorsMarkerClone2.rotateY(Math.PI);

        doorsMarkerClone1.receiveShadow = true;
        doorsMarkerClone2.receiveShadow = true;

        doorsMarkerClone1.position.set(0, 0, 0.51);
        doorsMarkerClone2.position.set(0, 0, -0.51);

        doorsMarkerClone1.updateMatrix();
        doorsMarkerClone1.matrixAutoUpdate = false;
        doorsMarkerClone2.updateMatrix();
        doorsMarkerClone2.matrixAutoUpdate = false;

        const door = new Three.Group();
        door.add(doorsMarkerClone1);
        door.add(doorsMarkerClone2);

        door.position.set(OBJECTS.DOORS[scope.l].position[i][0], OBJECTS.DOORS[scope.l].position[i][1], OBJECTS.DOORS[scope.l].position[i][2]);
        door.rotateY(Math.PI / 2);

        scope.scene.add(door);
      }
      loaderDispatchHelper(scope.$store, 'isDoorsBuild');
    });


    // Laser traps

    const coneMesh = new Three.Mesh(
      new Three.CylinderBufferGeometry(OBJECTS.LASERS.size / 4, OBJECTS.LASERS.size / 2, OBJECTS.LASERS.size / 2, 32),
      new Three.MeshStandardMaterial({ color: DESIGN.COLORS.gray, map: metallTexture }),
    );
    coneMesh.material.map.wrapS = coneMesh.material.map.wrapT = Three.RepeatWrapping;
    coneMesh.material.map.encoding = Three.sRGBEncoding;

    let coneMesh1Clone;
    let coneMesh2Clone;
    let coneMesh3Clone;
    let coneMesh4Clone;
    let coneMesh5Clone;
    let coneMesh6Clone;

    let rayMesh1;
    let rayMesh2;
    let rayMesh3;

    for (let i = 0; i < OBJECTS.LASERS[scope.l].position.length; i++) {
      coneMesh1Clone = coneMesh.clone();
      coneMesh2Clone = coneMesh.clone();

      rayMesh1 = new Three.Mesh(
        new Three.CylinderBufferGeometry( OBJECTS.LASERS.size / 4, OBJECTS.LASERS.size / 4, OBJECTS.LASERS[scope.l].position[i][3] + OBJECTS.LASERS.size / 4, 32 ),
        new Three.MeshStandardMaterial({
          color: DESIGN.COLORS.lightnings,
          transparent: true,
          opacity: 0.5,
          side: Three.DoubleSide,
        }),
      );

      coneMesh1Clone.rotation.x = Math.PI;
      coneMesh1Clone.position.y = OBJECTS.LASERS[scope.l].position[i][3] + OBJECTS.LASERS.size;

      coneMesh2Clone.position.y = OBJECTS.LASERS.size / 2;

      rayMesh1.position.y = OBJECTS.LASERS.size * 3 / 4 + OBJECTS.LASERS[scope.l].position[i][3] / 2 - 0.01;

      coneMesh3Clone = coneMesh1Clone.clone();
      coneMesh4Clone = coneMesh2Clone.clone();
      rayMesh2 = rayMesh1.clone();
      coneMesh3Clone.position.z -= DESIGN.HERO.HEIGHT * 2;
      coneMesh4Clone.position.z -= DESIGN.HERO.HEIGHT * 2;
      rayMesh2.position.z -= DESIGN.HERO.HEIGHT * 2;

      coneMesh5Clone = coneMesh1Clone.clone();
      coneMesh6Clone = coneMesh2Clone.clone();
      rayMesh3 = rayMesh1.clone();
      coneMesh5Clone.position.z -= DESIGN.HERO.HEIGHT * 4;
      coneMesh6Clone.position.z -= DESIGN.HERO.HEIGHT * 4;
      rayMesh3.position.z -= DESIGN.HERO.HEIGHT * 4;

      rayMesh1.visible = false;
      rayMesh2.visible = false;
      rayMesh3.visible = false;
      rayMesh1.name = 'ray';
      rayMesh2.name = 'ray';
      rayMesh3.name = 'ray';

      coneMesh1Clone.updateMatrix();
      coneMesh1Clone.matrixAutoUpdate = false;
      coneMesh2Clone.updateMatrix();
      coneMesh2Clone.matrixAutoUpdate = false;
      coneMesh3Clone.updateMatrix();
      coneMesh3Clone.matrixAutoUpdate = false;
      coneMesh4Clone.updateMatrix();
      coneMesh4Clone.matrixAutoUpdate = false;
      coneMesh5Clone.updateMatrix();
      coneMesh5Clone.matrixAutoUpdate = false;
      coneMesh6Clone.updateMatrix();
      coneMesh6Clone.matrixAutoUpdate = false;
      rayMesh1.updateMatrix();
      rayMesh1.matrixAutoUpdate = false;
      rayMesh2.updateMatrix();
      rayMesh2.matrixAutoUpdate = false;
      rayMesh3.updateMatrix();
      rayMesh3.matrixAutoUpdate = false;

      const trap = new Three.Group();
      trap.add(coneMesh1Clone);
      trap.add(coneMesh2Clone);
      trap.add(coneMesh3Clone);
      trap.add(coneMesh4Clone);
      trap.add(coneMesh5Clone);
      trap.add(coneMesh6Clone);
      trap.add(rayMesh1);
      trap.add(rayMesh2);
      trap.add(rayMesh3);
      trap.rotateX(Math.PI / 2);
      trap.position.set(OBJECTS.LASERS[scope.l].position[i][0], OBJECTS.LASERS[scope.l].position[i][1], OBJECTS.LASERS[scope.l].position[i][2]);

      laserTraps.push({
        mesh: trap,
        time: 0,
        isStart: false,
        startDelay: (Math.random() + 1) * OBJECTS.LASERS.delay,
        isOn: false,
      });

      scope.scene.add(trap);
      loaderDispatchHelper(scope.$store, 'isTrapsBuild');
    }


    // Leader

    const leaderTexture = new Three.TextureLoader().load('./images/textures/leader.jpg', () => {
      scope.render();
      loaderDispatchHelper(scope.$store, 'isLeaderLoaded');
    });

    const leaderMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.white, map: leaderTexture });
    const leaderGeometry = new Three.PlaneBufferGeometry(OBJECTS.LEADER.size, OBJECTS.LEADER.size);
    const leaderMesh = new Three.Mesh(leaderGeometry, leaderMaterial);
    let leaderMeshClone;

    for (let i = 0; i < OBJECTS.LEADER[scope.l].position.length; i++) {
      leaderMeshClone = leaderMesh.clone();

      leaderMeshClone.material.map.repeat.set(1, 1);
      leaderMeshClone.material.map.wrapS = leaderMeshClone.material.map.wrapT = Three.RepeatWrapping;
      leaderMeshClone.material.map.encoding = Three.sRGBEncoding;

      leaderMeshClone.position.set(OBJECTS.LEADER[scope.l].position[i][0], OBJECTS.LEADER[scope.l].position[i][1], OBJECTS.LEADER[scope.l].position[i][2]);
      leaderMeshClone.rotateY(Math.PI / 2);
      leaderMeshClone.receiveShadow = true;

      leaderMeshClone.updateMatrix();
      leaderMeshClone.matrixAutoUpdate = false;

      scope.scene.add(leaderMeshClone);
      loaderDispatchHelper(scope.$store, 'isLeadersBuild');
    }


    // Lamps

    let lampLight;

    const lampMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.sun });
    lampMaterial.blending = Three.NoBlending;
    lampMaterial.receiveShadow = false;
    lampMaterial.castShadow = false;
    const lampGeometry = new Three.SphereBufferGeometry(0.75, 32, 32);
    const lampMesh = new Three.Mesh(lampGeometry, lampMaterial);
    let lampMeshClone;

    const lampElementsMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.black });
    lampElementsMaterial.blending = Three.NoBlending;
    lampElementsMaterial.receiveShadow = false;
    lampElementsMaterial.castShadow = false;
    const lampElement1Geometry = new Three.CylinderBufferGeometry(0.5, 0.5, 0.5, 32, 1);
    const lampElement1Mesh = new Three.Mesh(lampElement1Geometry, lampElementsMaterial);
    let lampElement1MeshClone;

    for (let i = 0; i < OBJECTS.LAMPS[scope.l].position.length; i++) {
      lampLight = new Three.PointLight(DESIGN.COLORS.sun, OBJECTS.LAMPS[scope.l].position[i][3], OBJECTS.LAMPS[scope.l].position[i][4]);
      lampMeshClone = lampMesh.clone();
      lampElement1MeshClone = lampElement1Mesh.clone();

      lampLight.position.y = OBJECTS.LAMPS[scope.l].position[i][1] - 0.75;
      lampMeshClone.position.y = OBJECTS.LAMPS[scope.l].position[i][1] - 0.75;
      // eslint-disable-next-line prefer-destructuring
      lampElement1MeshClone.position.y = OBJECTS.LAMPS[scope.l].position[i][1];

      lampMeshClone.updateMatrix();
      lampMeshClone.matrixAutoUpdate = false;
      lampElement1MeshClone.updateMatrix();
      lampElement1MeshClone.matrixAutoUpdate = false;

      const lamp = new Three.Group();
      lamp.add(lampLight);
      lamp.add(lampMeshClone);
      lamp.add(lampElement1MeshClone);
      lamp.position.set(OBJECTS.LAMPS[scope.l].position[i][0], OBJECTS.LAMPS[scope.l].position[i][1], OBJECTS.LAMPS[scope.l].position[i][2]);

      scope.scene.add(lamp);
      loaderDispatchHelper(scope.$store, 'isLampsBuild');
    }
  };

  this.animate = (scope) => {
    sky.rotateY(scope.delta / 25);

    laserTraps.forEach((trap) => {
      trap.time += scope.delta;
      if (!trap.isStart) {
        if (trap.time > trap.startDelay) trap.isStart = true;
      } else if (trap.time > OBJECTS.LASERS.delay) {
        trap.isOn = !trap.isOn;
        trap.mesh.traverse((child) => {
          if (child.isMesh && child.name === 'ray') child.visible = trap.isOn;
        });
        trap.time = 0;
      }
    });
  };
}

export default World;
