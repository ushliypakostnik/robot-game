/* eslint-disable dot-notation,prefer-destructuring */
import * as Three from 'three';

import { DESIGN, OBJECTS } from '@/utils/constants';

import {
  loaderDispatchHelper,
  randomInteger,
  degreesToRadians,
} from '@/utils/utilities';

function Passes() {
  this.init = (scope, metallTexture, pseudoGeometry, pseudoMaterial) => {
    const passGeometry = new Three.BoxBufferGeometry(
      DESIGN.STAFF.passes.size,
      DESIGN.STAFF.passes.size,
      DESIGN.STAFF.passes.size / 5,
    );
    const passMaterial = new Three.MeshStandardMaterial({ color: DESIGN.COLORS.grayDark, map: metallTexture });
    const passMesh = new Three.Mesh(passGeometry, passMaterial);
    let passMeshClone;

    const passMarkerGeometry = new Three.CircleBufferGeometry(DESIGN.STAFF.passes.size / 4, 32);
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
      passMarkerMeshClone.position.y += DESIGN.STAFF.passes.size / 10 + 0.01;

      passPseudoMeshClone.name = `${OBJECTS.PASSES.name}${OBJECTS.PASSES[scope.l].data[i].pass}`;
      passPseudoMeshClone.visible = false;

      passGroup = new Three.Group();

      passGroup.add(passMeshClone);
      passGroup.add(passMarkerMeshClone);
      passGroup.add(passPseudoMeshClone);
      passGroup.position.set(
        OBJECTS.PASSES[scope.l].data[i].x,
        OBJECTS.PASSES[scope.l].data[i].y + DESIGN.STAFF.passes.size / 10,
        OBJECTS.PASSES[scope.l].data[i].z,
      );
      passGroup.rotateY(degreesToRadians(randomInteger(0, 359)));

      scope.things.push({
        id: passPseudoMeshClone.id,
        group: passGroup,
        isPicked: false,
      });

      scope.objects.push(passPseudoMeshClone);
      scope.scene.add(passGroup);
    }
    loaderDispatchHelper(scope.$store, 'isPassesBuild');
  };
}

export default Passes;
