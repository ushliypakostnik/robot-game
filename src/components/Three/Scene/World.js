import * as Three from 'three';

import { GLTFLoader } from '@/components/Three/Modules/Utils/GLTFLoader';
import { Octree } from '../Modules/Math/Octree';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  loaderDispatchHelper,
} from '@/utils/utilities';

function World() {
  let sky;

  const doors = [];
  let doorsGroup;
  let door;
  let direction;
  let box;

  this.init = (scope) => {
    // Lights

    // Hemisphere
    const light = new Three.HemisphereLight(DESIGN.COLORS.white, DESIGN.COLORS.grayLight2, 0.5);
    light.position.set(0, DESIGN.WORLD_SIZE[scope.l] / 4, 0).normalize();
    scope.scene.add(light);

    // Ambient
    scope.scene.add(new Three.AmbientLight(DESIGN.COLORS.white));


    // Sky
    const skyGeometry = new Three.SphereBufferGeometry(DESIGN.WORLD_SIZE[scope.l] * 2.25, 64, 64);
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

    const floorTexture = new Three.TextureLoader().load(
      './images/textures/concrete1.jpg',
      () => {
        scope.render();
        loaderDispatchHelper(scope.$store, 'isConcrete1Loaded');
      },
    );

    const wallsNormalTexture = new Three.TextureLoader().load(
      './images/textures/concrete2.jpg',
      () => {
        scope.render();
        loaderDispatchHelper(scope.$store, 'isConcrete2Loaded');
      },
    );

    const wallsLargeTexture = new Three.TextureLoader().load(
      './images/textures/concrete2.jpg',
      () => {
        loaderDispatchHelper(scope.$store, 'isConcrete3Loaded');
      },
    );

    const wallsHightTexture = new Three.TextureLoader().load(
      './images/textures/concrete2.jpg',
      () => {
        scope.render();
        loaderDispatchHelper(scope.$store, 'isConcrete4Loaded');
      },
    );

    const metallTexture = new Three.TextureLoader().load(
      './images/textures/metall.jpg',
      () => {
        scope.render();
        loaderDispatchHelper(scope.$store, 'isMetall1Loaded');
      },
    );

    const doorsTexture = new Three.TextureLoader().load(
      './images/textures/metall.jpg',
      () => {
        scope.render();
        loaderDispatchHelper(scope.$store, 'isMetall2Loaded');
      },
    );

    const metallRodsTexture = new Three.TextureLoader().load(
      './images/textures/metall.jpg',
      () => {
        scope.render();
        loaderDispatchHelper(scope.$store, 'isMetal3Loaded');
      },
    );

    const sandTexture = new Three.TextureLoader().load(
      './images/textures/sand.jpg',
      () => {
        scope.render();
        loaderDispatchHelper(scope.$store, 'isSandLoaded');
      },
    );

    const floorMaterial = new Three.MeshStandardMaterial({
      color: DESIGN.COLORS.grayDark,
      blending: Three.NoBlending,
    });
    const wallsNormalMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.gray });
    const wallsLargeMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.gray });
    const wallsHightMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.gray });
    const rodsMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.gray });
    const compsMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.grayDark });
    const doorsMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.grayLight });
    const sandMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.white });

    new GLTFLoader().load(
      `./images/models/${scope.l}/Scene.glb`,
      (glb) => {
        glb.scene.traverse((child) => {
          if (child.isMesh) {
            if (child.name.includes('ground')) {
              child.material = floorMaterial;
              child.material.map = floorTexture;
              child.material.map.repeat.set(1, 1);
              child.material.map.anisotropy = 8;
            } else if (child.name.includes('sand')) {
              child.material = sandMaterial;
              child.material.map = sandTexture;
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
              child.material.map.repeat.set(0.75, 0.5);
            } else if (child.name.includes('rod')) {
              child.material = rodsMaterial;
              child.material.map = metallRodsTexture;
              child.material.map.repeat.set(0.05, 0.05);
            } else if (child.name.includes('comp')) {
              child.material = compsMaterial;
              child.material.map = metallTexture;
              child.material.map.repeat.set(2, 2);
            } else if (child.name.includes(OBJECTS.LEADER.name)) {
              let rotate;
              if (child.name.includes('Z')) {
                if (child.name.includes('R')) rotate = Math.PI / -2;
                else rotate = Math.PI / 2;
              }
              else if (child.name.includes('X')) {
                if (child.name.includes('R')) rotate = Math.PI;
                else rotate = 0;
              }

              OBJECTS.LEADER[scope.l].data.push({
                x: child.position.x,
                y: child.position.y,
                z: child.position.z,
                rotate,
              });

              child.visible = false;
            } else if (child.name.includes(OBJECTS.DOORS.name)) {
              let direction;
              if (child.name.includes('Up')) direction = 'up';
              else if (child.name.includes('Down')) direction = 'down';

              let pass;
              if (child.name.includes('Purple')) pass = 'purple';
              else if (child.name.includes('Red')) pass = 'red';
              else if (child.name.includes('Green')) pass = 'green';
              else if (child.name.includes('Blue')) pass = 'blue';
              else if (child.name.includes('Orange')) pass = 'orange';

              let rotate;
              if (child.name.includes('Z')) rotate = Math.PI / 2;
              else if (child.name.includes('X')) rotate = 0;

              let width;
              let height;
              if (child.name.includes('Small')) {
                width = 8;
                height = 8;
              } else if (child.name.includes('Large')) {
                width = 20;
                height = 12;
              }

              OBJECTS.DOORS[scope.l].data.push({
                id: child.id,
                x: child.position.x,
                y: child.position.y,
                z: child.position.z,
                width,
                height,
                rotate,
                direction,
                pass,
              });

              scope.objects.push(child);
              scope.doors.push(child);

              child.material = doorsMaterial;
              child.material.map = doorsTexture;
              child.material.map.repeat.set(0.1, 0.1);
            } else {
              child.material = wallsNormalMaterial;
              child.material.map = wallsNormalTexture;
              child.material.map.repeat.set(0.25, 0.5);
            }

            if (!child.name.includes(OBJECTS.LEADER.name)) {
              child.material.map.wrapS = child.material.map.wrapT = Three.RepeatWrapping;
              child.material.map.encoding = Three.sRGBEncoding;
            }
          }
        });

        doorsGroup = new Three.Group();
        doorsGroup.name = 'Doors';
        scope.doors.forEach((door) => {
          glb.scene.remove(door);
          doorsGroup.add(door);
        });

        scope.octree.fromGraphNode(glb.scene);
        scope.octreeMutable.fromGraphNode(doorsGroup);

        scope.scene.add(glb.scene);
        scope.scene.add(doorsGroup);
        scope.render();


        // Doors customization

        const doorsMarkerTexture = new Three.TextureLoader().load(
          './images/textures/metall.jpg',
          () => {
            scope.render();
            loaderDispatchHelper(scope.$store, 'isMetall3Loaded');
          },
        );

        const doorsMarkerSmallGeometry = new Three.CircleBufferGeometry(1.5, 32);
        const doorsMarkerLargeGeometry = new Three.CircleBufferGeometry(2.25, 32);

        const doorsMarkerDefaultMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.white, map: doorsMarkerTexture });
        const doorsMarkerBlueMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.blue, map: doorsMarkerTexture });
        const doorsMarkerPurpleMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.purple, map: doorsMarkerTexture });
        const doorsMarkerRedMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.red, map: doorsMarkerTexture });
        const doorsMarkerGreenMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.green, map: doorsMarkerTexture });
        const doorsMarkerOrangeMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.orange, map: doorsMarkerTexture });

        const doorMarkerSmallMesh = new Three.Mesh(doorsMarkerSmallGeometry, doorsMarkerDefaultMaterial);
        const doorMarkerLargeMesh = new Three.Mesh(doorsMarkerLargeGeometry, doorsMarkerDefaultMaterial);
        let doorsMarkerClone1;
        let doorsMarkerClone2;

        let doorsPseudoGeometry;
        const doorsPseudoMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.white });
        let doorPseudoMesh;

        box = new Three.Box3();

        for (let i = 0; i < OBJECTS.DOORS[scope.l].data.length; i++) {
          if (OBJECTS.DOORS[scope.l].data[i].height < 10) {
            doorsMarkerClone1 = doorMarkerSmallMesh.clone();
            doorsMarkerClone2 = doorMarkerSmallMesh.clone();
          } else {
            doorsMarkerClone1 = doorMarkerLargeMesh.clone();
            doorsMarkerClone2 = doorMarkerLargeMesh.clone();
          }

          switch (OBJECTS.DOORS[scope.l].data[i].pass) {
            case 'purple':
              doorsMarkerClone1.material = doorsMarkerPurpleMaterial;
              doorsMarkerClone2.material = doorsMarkerPurpleMaterial;
              break;
            case 'red':
              doorsMarkerClone1.material = doorsMarkerRedMaterial;
              doorsMarkerClone2.material = doorsMarkerRedMaterial;
              break;
            case 'green':
              doorsMarkerClone1.material = doorsMarkerGreenMaterial;
              doorsMarkerClone2.material = doorsMarkerGreenMaterial;
              break;
            case 'blue':
              doorsMarkerClone1.material = doorsMarkerBlueMaterial;
              doorsMarkerClone2.material = doorsMarkerBlueMaterial;
              break;
            case 'orange':
              doorsMarkerClone1.material = doorsMarkerOrangeMaterial;
              doorsMarkerClone2.material = doorsMarkerOrangeMaterial;
              break;
            default:
              break;
          }

          doorsMarkerClone2.rotateY(Math.PI);
          doorsMarkerClone1.rotateZ(OBJECTS.DOORS[scope.l].data[i].rotate);
          doorsMarkerClone2.rotateZ(OBJECTS.DOORS[scope.l].data[i].rotate);

          doorsMarkerClone1.position.set(0, 0, 0.51);
          doorsMarkerClone2.position.set(0, 0, -0.51);

          doorsPseudoGeometry = new Three.BoxBufferGeometry(
            OBJECTS.DOORS[scope.l].data[i].width,
            OBJECTS.DOORS[scope.l].data[i].height,
            3,
          );
          doorPseudoMesh = new Three.Mesh(doorsPseudoGeometry, doorsPseudoMaterial);

          doorPseudoMesh.geometry.computeBoundingBox();
          doorPseudoMesh.visible = false;

          doorPseudoMesh.updateMatrix();
          doorPseudoMesh.matrixAutoUpdate = false;

          const door = new Three.Group();
          door.add(doorsMarkerClone1);
          door.add(doorsMarkerClone2);
          door.add(doorPseudoMesh);

          door.position.set(
            OBJECTS.DOORS[scope.l].data[i].x,
            OBJECTS.DOORS[scope.l].data[i].y,
            OBJECTS.DOORS[scope.l].data[i].z,
          );
          door.rotateY(OBJECTS.DOORS[scope.l].data[i].rotate);

          doors.push({
            data: OBJECTS.DOORS[scope.l].data[i],
            mesh: scope.doors.find(object => object.id === OBJECTS.DOORS[scope.l].data[i].id),
            marker1: doorsMarkerClone1,
            marker2: doorsMarkerClone2,
            pseudo: doorPseudoMesh,
            time: 0,
            isStart: false,
            isPause: false,
            isEnd: false,
            isUpdate: false,
            distance: 0,
          });

          scope.scene.add(door);
        }
        loaderDispatchHelper(scope.$store, 'isDoorsBuild');

        // Leader

        const leaderTexture = new Three.TextureLoader().load(
          './images/textures/leader.jpg',
          () => {
            scope.render();
            loaderDispatchHelper(scope.$store, 'isLeaderLoaded');
          },
        );

        const leaderMaterial = new Three.MeshStandardMaterial({
          color: DESIGN.COLORS.white,
          map: leaderTexture,
        });
        const leaderGeometry = new Three.PlaneBufferGeometry(OBJECTS.LEADER.size, OBJECTS.LEADER.size);
        const leaderMesh = new Three.Mesh(leaderGeometry, leaderMaterial);
        let leaderMeshClone;

        for (let i = 0; i < OBJECTS.LEADER[scope.l].data.length; i++) {
          leaderMeshClone = leaderMesh.clone();

          leaderMeshClone.material.map.repeat.set(1, 1);
          leaderMeshClone.material.map.wrapS = leaderMeshClone.material.map.wrapT = Three.RepeatWrapping;
          leaderMeshClone.material.map.encoding = Three.sRGBEncoding;

          leaderMeshClone.position.set(
            OBJECTS.LEADER[scope.l].data[i].x,
            OBJECTS.LEADER[scope.l].data[i].y,
            OBJECTS.LEADER[scope.l].data[i].z,
          );
          leaderMeshClone.rotateY(OBJECTS.LEADER[scope.l].data[i].rotate);

          leaderMeshClone.updateMatrix();
          leaderMeshClone.matrixAutoUpdate = false;

          scope.scene.add(leaderMeshClone);
          loaderDispatchHelper(scope.$store, 'isLeadersBuild');
        }


        // Toruch

        scope.toruch = new Three.PointLight(
          DESIGN.COLORS.sun,
          1.5,
          50,
        );
        scope.scene.add(scope.toruch);
      },
    );
  };

  this.openDoor = (id) => {
    door = doors.find(door => door.data.id === id && !door.isStart && !door.isPause && !door.isEnd);
    if (door) door.isStart = true;
  };

  const updateDoors = (scope) => {
    doorsGroup = new Three.Group();
    scope.doors.forEach(door => doorsGroup.add(door));
    scope.octreeMutable = new Octree();
    scope.octreeMutable.fromGraphNode(doorsGroup);
    scope.scene.add(doorsGroup);
  };

  this.animate = (scope) => {
    sky.rotateY(scope.delta / 25);

    doors.filter(door => door.isStart || door.isPause || door.isEnd).forEach((door) => {
      door.time += scope.delta;

      if (door.isStart) {
        if (door.data.direction === 'up') direction = 1;
        if (door.data.direction === 'down') direction = -1;
      } else if (door.isEnd) {
        if (door.data.direction === 'up') direction = -1;
        if (door.data.direction === 'down') direction = 1;
      }

      if (door.isStart || door.isEnd) {
        door.mesh.position.y += direction * scope.delta * OBJECTS.DOORS.speed;
        door.marker1.position.y += direction * scope.delta * OBJECTS.DOORS.speed;
        door.marker2.position.y += direction * scope.delta * OBJECTS.DOORS.speed;
        door.distance += scope.delta * OBJECTS.DOORS.speed;
      }

      if (door.isStart) {
        if (door.distance > 3 && !door.isUpdate) {
          updateDoors(scope);
          door.isUpdate = true;
        }

        if (door.distance > door.data.height - 0.5) {
          door.isStart = false;
          door.isUpdate = false;
          door.isPause = true;
          door.distance = 0;

          updateDoors(scope);
        }
      }

      if (door.isPause && door.time > OBJECTS.DOORS.pause) {
        box.copy(door.pseudo.geometry.boundingBox).applyMatrix4(door.pseudo.matrixWorld);
        if (!box.containsPoint(scope.controls.getObject().position)) {
          door.isPause = false;
          door.isEnd = true;
        }
      }

      if (door.isEnd) {
        box.copy(door.pseudo.geometry.boundingBox).applyMatrix4(door.pseudo.matrixWorld);
        if (box.containsPoint(scope.controls.getObject().position)) {
          door.isStart = true;
          door.isEnd = false;
          door.distance = door.data.height - door.distance;
        }

        if (door.distance > 3 && !door.isUpdate) {
          updateDoors(scope);
          door.isUpdate = true;
        }

        if (door.distance > door.data.height - 0.5) {
          door.mesh.position.y = door.data.y;
          door.marker1.position.y = 0;
          door.marker2.position.y = 0;
          door.isEnd = false;
          door.isUpdate = false;
          door.distance = 0;
          door.time = 0;

          updateDoors(scope);
        }
      }
    });
  };
}

export default World;
