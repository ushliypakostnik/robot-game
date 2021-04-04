import * as Three from 'three';

import { GLTFLoader } from '@/components/Three/Modules/Utils/GLTFLoader';
import { Octree } from '../Modules/Math/Octree';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  loaderDispatchHelper,
  degreesToRadians,
  randomInteger,
  addAudioToObjects,
  playSoundWhoCanPlay,
} from '@/utils/utilities';

function World() {
  let sky;

  let doorsGroup;
  let door;
  let direction;
  let box;
  const places = [];
  const things = [];

  const audioLoader1 = new Three.AudioLoader();

  this.init = (scope) => {
    // Level objects
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const object in OBJECTS) {
      OBJECTS[object][scope.l] = {};
      OBJECTS[object][scope.l].data = [];
    }


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
              } else if (child.name.includes('X')) {
                if (child.name.includes('R')) rotate = Math.PI;
                else rotate = 0;
              }

              OBJECTS.LEADER[scope.l].data.push({
                x: child.position.x,
                y: child.position.y,
                z: child.position.z,
                rotate,
              });

              places.push(child);

              child.visible = false;
            } else if (child.name.includes(OBJECTS.PASSES.name)) {
              let pass;
              if (child.name.includes('Red')) pass = DESIGN.PASSES.red;
              else if (child.name.includes('Orange')) pass = DESIGN.PASSES.orange;
              else if (child.name.includes('Green')) pass = DESIGN.PASSES.green;
              else if (child.name.includes('Purple')) pass = DESIGN.PASSES.purple;
              else if (child.name.includes('Blue')) pass = DESIGN.PASSES.blue;


              OBJECTS.PASSES[scope.l].data.push({
                x: child.position.x,
                y: child.position.y,
                z: child.position.z,
                pass,
              });

              things.push(child);

              child.visible = false;
            } else if (child.name.includes(OBJECTS.DOORS.name)) {
              let direction;
              if (child.name.includes('Up')) direction = 'up';
              else if (child.name.includes('Down')) direction = 'down';

              let pass;
              if (child.name.includes('Red')) pass = DESIGN.PASSES.red;
              else if (child.name.includes('Orange')) pass = DESIGN.PASSES.orange;
              else if (child.name.includes('Green')) pass = DESIGN.PASSES.green;
              else if (child.name.includes('Purple')) pass = DESIGN.PASSES.purple;
              else if (child.name.includes('Blue')) pass = DESIGN.PASSES.blue;

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

            // На "местах-пустышках" - не ставим текстуру
            if (!child.name.includes(OBJECTS.LEADER.name)
                && !child.name.includes(OBJECTS.PASSES.name)) {
              child.material.map.wrapS = child.material.map.wrapT = Three.RepeatWrapping;
              child.material.map.encoding = Three.sRGBEncoding;
            }
          }
        });

        // Переносим двери в отдельное октодерево
        // и удаляем "места"-пустышки для элементов оформления и предметов

        doorsGroup = new Three.Group();
        doorsGroup.name = 'Doors';
        scope.doors.forEach((door) => {
          glb.scene.remove(door);
          doorsGroup.add(door);
        });

        places.forEach((place) => {
          glb.scene.remove(place);
        });

        things.forEach((object) => {
          glb.scene.remove(object);
        });

        // Создаем октодеревья
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

        scope.doors = [];
        for (let i = 0; i < OBJECTS.DOORS[scope.l].data.length; i++) {
          if (OBJECTS.DOORS[scope.l].data[i].height < 10) {
            doorsMarkerClone1 = doorMarkerSmallMesh.clone();
            doorsMarkerClone2 = doorMarkerSmallMesh.clone();
          } else {
            doorsMarkerClone1 = doorMarkerLargeMesh.clone();
            doorsMarkerClone2 = doorMarkerLargeMesh.clone();
          }

          switch (OBJECTS.DOORS[scope.l].data[i].pass) {
            case DESIGN.PASSES.red:
              doorsMarkerClone1.material = doorsMarkerRedMaterial;
              doorsMarkerClone2.material = doorsMarkerRedMaterial;
              break;
            case DESIGN.PASSES.orange:
              doorsMarkerClone1.material = doorsMarkerOrangeMaterial;
              doorsMarkerClone2.material = doorsMarkerOrangeMaterial;
              break;
            case DESIGN.PASSES.green:
              doorsMarkerClone1.material = doorsMarkerGreenMaterial;
              doorsMarkerClone2.material = doorsMarkerGreenMaterial;
              break;
            case DESIGN.PASSES.purple:
              doorsMarkerClone1.material = doorsMarkerPurpleMaterial;
              doorsMarkerClone2.material = doorsMarkerPurpleMaterial;
              break;
            case DESIGN.PASSES.blue:
              doorsMarkerClone1.material = doorsMarkerBlueMaterial;
              doorsMarkerClone2.material = doorsMarkerBlueMaterial;
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

          door = new Three.Group();
          door.add(doorsMarkerClone1);
          door.add(doorsMarkerClone2);
          door.add(doorPseudoMesh);

          door.position.set(
            OBJECTS.DOORS[scope.l].data[i].x,
            OBJECTS.DOORS[scope.l].data[i].y,
            OBJECTS.DOORS[scope.l].data[i].z,
          );
          door.rotateY(OBJECTS.DOORS[scope.l].data[i].rotate);

          scope.doors.push({
            data: OBJECTS.DOORS[scope.l].data[i],
            mesh: scope.objects.find(object => object.id === OBJECTS.DOORS[scope.l].data[i].id),
            marker1: doorsMarkerClone1,
            marker2: doorsMarkerClone2,
            pseudo: doorPseudoMesh,
            time: 0,
            isStart: false,
            isPause: false,
            isEnd: false,
            isUpdate: false,
            distance: 0,
            isStoped: false,
          });

          scope.scene.add(door);
        }
        loaderDispatchHelper(scope.$store, 'isDoorsBuild');

        audioLoader1.load('./audio/door.mp3', (buffer) => {
          scope.audio.addAudioToObjects(scope, scope.doors, buffer, 'mesh', 'door', DESIGN.VOLUME.doors, false);
          loaderDispatchHelper(scope.$store, 'isDoorsSoundLoaded');
        });


        // Things

        const pseudoGeometry = new Three.SphereBufferGeometry(DESIGN.HERO.HEIGHT, 32, 32);
        const pseudoMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.white });

        // Passes

        const passGeometry = new Three.BoxBufferGeometry(
          OBJECTS.PASSES.size,
          OBJECTS.PASSES.size,
          OBJECTS.PASSES.size / 5,
        );
        const passMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.grayDark, map: metallTexture });
        const passMesh = new Three.Mesh(passGeometry, passMaterial);
        let passMeshClone;

        const passMarkerGeometry = new Three.CircleBufferGeometry(OBJECTS.PASSES.size / 4, 32);
        const passMarkerDefaultMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.white, map: metallTexture });
        const passMarkerRedMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.red, map: metallTexture });
        const passMarkerOrangeMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.orange, map: metallTexture });
        const passMarkerGreenMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.green, map: metallTexture });
        const passMarkerPurpleMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.purple, map: metallTexture });
        const passMarkerBlueMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.blue, map: metallTexture });
        const passMarkerMesh = new Three.Mesh(passMarkerGeometry, passMarkerDefaultMaterial);
        let passMarkerMeshClone;

        const passPseudoMesh = new Three.Mesh(pseudoGeometry, pseudoMaterial);
        let passPseudoMeshClone;

        let passGroup;
        // eslint-disable-next-line no-unused-vars
        let place;

        scope.things = [];
        for (let i = 0; i < OBJECTS.PASSES[scope.l].data.length; i++) {
          passMeshClone = passMesh.clone();
          passMarkerMeshClone = passMarkerMesh.clone();
          passPseudoMeshClone = passPseudoMesh.clone();

          switch (OBJECTS.PASSES[scope.l].data[i].pass) {
            case DESIGN.PASSES.red:
              passMarkerMeshClone.material = passMarkerRedMaterial;
              break;
            case DESIGN.PASSES.orange:
              passMarkerMeshClone.material = passMarkerOrangeMaterial;
              break;
            case DESIGN.PASSES.green:
              passMarkerMeshClone.material = passMarkerGreenMaterial;
              break;
            case DESIGN.PASSES.purple:
              passMarkerMeshClone.material = passMarkerPurpleMaterial;
              break;
            case DESIGN.PASSES.blue:
              passMarkerMeshClone.material = passMarkerBlueMaterial;
              break;
            default:
              break;
          }

          passMeshClone.rotateX(Math.PI / 2);

          passMarkerMeshClone.rotateX(Math.PI / -2);
          passMarkerMeshClone.position.y += OBJECTS.PASSES.size / 10 + 0.01;

          passPseudoMeshClone.name = `${OBJECTS.PASSES.name}${OBJECTS.PASSES[scope.l].data[i].pass}`;
          passPseudoMeshClone.visible = false;

          passGroup = new Three.Group();

          passGroup.add(passMeshClone);
          passGroup.add(passMarkerMeshClone);
          passGroup.add(passPseudoMeshClone);
          passGroup.position.set(
            OBJECTS.PASSES[scope.l].data[i].x,
            OBJECTS.PASSES[scope.l].data[i].y + OBJECTS.PASSES.size / 10,
            OBJECTS.PASSES[scope.l].data[i].z,
          );
          passGroup.rotateY(degreesToRadians(randomInteger(0, 359)));

          place = things.find(object => object.id === OBJECTS.DOORS[scope.l].data[i].id);
          scope.things.push({
            id: passPseudoMeshClone.id,
            data: OBJECTS.PASSES[scope.l].data[i],
            group: passGroup,
          });

          scope.objects.push(passPseudoMeshClone);
          scope.scene.add(passGroup);
        }
        loaderDispatchHelper(scope.$store, 'isPassesBuild');


        // Toruch

        scope.toruch = new Three.PointLight(
          DESIGN.COLORS.sun,
          1.5,
          50,
        );
        scope.scene.add(scope.toruch);


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
      },
    );
  };

  this.openDoor = (scope, id) => {
    door = scope.doors.find(door => door.data.id === id && !door.isStart && !door.isPause && !door.isEnd);
    if (door && !door.isStart) {
      door.isStart = true;
      scope.audio.playObjectSoundFromStart(door.data.id, 'door');
    }
  };

  const updateDoors = (scope) => {
    doorsGroup = new Three.Group();
    scope.doors.forEach(door => doorsGroup.add(door.mesh));
    scope.octreeMutable = new Octree();
    scope.octreeMutable.fromGraphNode(doorsGroup);
    scope.scene.add(doorsGroup);
  };

  this.animate = (scope) => {
    sky.rotateY(scope.delta / 25);

    scope.doors.filter(door => door.isStart || door.isPause || door.isEnd).forEach((door) => {
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
        if (door.distance > DESIGN.HERO.HEIGHT + 1 && !door.isUpdate) {
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
          scope.audio.startObjectSound(door.data.id, 'door');
        }
      }

      if (door.isEnd) {
        box.copy(door.pseudo.geometry.boundingBox).applyMatrix4(door.pseudo.matrixWorld);
        if (box.containsPoint(scope.controls.getObject().position)) {
          door.isStart = true;
          door.isEnd = false;
          door.distance = door.data.height - door.distance;
        }

        if (door.distance > door.data.height - DESIGN.HERO.HEIGHT - 1 && !door.isUpdate) {
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
