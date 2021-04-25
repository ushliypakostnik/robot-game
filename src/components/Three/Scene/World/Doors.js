/* eslint-disable dot-notation,prefer-destructuring */
import * as Three from 'three';

import { Octree } from '../../Modules/Math/Octree';

import { DESIGN, OBJECTS } from '@/utils/constants';

import { loaderDispatchHelper } from '@/utils/utilities';

function Doors() {
  const audioLoader = new Three.AudioLoader();

  let group;
  let door;
  let box;
  let direction;

  this.init = (scope) => {
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
        id: OBJECTS.DOORS[scope.l].data[i].id,
        pass: OBJECTS.DOORS[scope.l].data[i].pass,
        direction: OBJECTS.DOORS[scope.l].data[i].direction,
        height: OBJECTS.DOORS[scope.l].data[i].height,
        y: OBJECTS.DOORS[scope.l].data[i].y,
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

    audioLoader.load('./audio/door.mp3', (buffer) => {
      scope.audio.addAudioToObjects(scope, scope.doors, buffer, 'mesh', 'door', DESIGN.VOLUME.doors, false);
      loaderDispatchHelper(scope.$store, 'isDoorsSoundLoaded');
    });
  };

  this.openDoor = (scope, id) => {
    door = scope.doors.find(door => door.id === id && !door.isStart && !door.isPause && !door.isEnd);
    if (door && !door.isStart) {
      door.isStart = true;
      scope.audio.replayObjectSound(door.id, 'door');
    }
  };

  const updateDoors = (scope) => {
    scope.group = new Three.Group();
    scope.doors.forEach(door => scope.group.add(door.mesh));
    scope.octreeDoors = new Octree();
    scope.octreeDoors.fromGraphNode(scope.group);
    scope.scene.add(scope.group);

    scope.world.atmosphere.checkEnemies(scope);
  };

  this.animate = (scope) => {
    scope.doors.filter(door => door.isStart || door.isPause || door.isEnd).forEach((door) => {
      door.time += scope.delta;

      if (door.isStart) {
        if (door.direction === 'up') direction = 1;
        if (door.direction === 'down') direction = -1;
      } else if (door.isEnd) {
        if (door.direction === 'up') direction = -1;
        if (door.direction === 'down') direction = 1;
      }

      if (door.isStart || door.isEnd) {
        door.mesh.position.y += direction * scope.delta * DESIGN.STAFF.doors.speed;
        door.marker1.position.y += direction * scope.delta * DESIGN.STAFF.doors.speed;
        door.marker2.position.y += direction * scope.delta * DESIGN.STAFF.doors.speed;
        door.distance += scope.delta * DESIGN.STAFF.doors.speed;
      }

      if (door.isStart) {
        if (door.distance > DESIGN.HERO.HEIGHT + 2 && !door.isUpdate) {
          updateDoors(scope);
          door.isUpdate = true;
        }

        if (door.distance > door.height - 0.5) {
          door.isStart = false;
          door.isUpdate = false;
          door.isPause = true;
          door.distance = 0;

          updateDoors(scope);
        }
      }

      if (door.isPause && door.time > DESIGN.STAFF.doors.pause) {
        box.copy(door.pseudo.geometry.boundingBox).applyMatrix4(door.pseudo.matrixWorld);
        if (!box.containsPoint(scope.controls.getObject().position)) {
          door.isPause = false;
          door.isEnd = true;
          scope.audio.startObjectSound(door.id, 'door');
        }
      }

      if (door.isEnd) {
        box.copy(door.pseudo.geometry.boundingBox).applyMatrix4(door.pseudo.matrixWorld);
        if (box.containsPoint(scope.controls.getObject().position)) {
          door.isStart = true;
          door.isEnd = false;
          door.distance = door.height - door.distance;
        }

        if (door.distance > door.height - DESIGN.HERO.HEIGHT - 2 && !door.isUpdate) {
          updateDoors(scope);
          door.isUpdate = true;
        }

        if (door.distance > door.height - 0.5) {
          door.mesh.position.y = door.y;
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

export default Doors;
