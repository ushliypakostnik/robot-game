/* eslint-disable dot-notation,prefer-destructuring */
import * as Three from 'three';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  loaderDispatchHelper,
} from '@/utils/utilities';

function Leader() {
  this.init = (scope) => {
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
    }
    loaderDispatchHelper(scope.$store, 'isLeadersBuild');
  };
}

export default Leader;
