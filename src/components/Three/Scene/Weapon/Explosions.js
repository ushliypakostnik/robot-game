import * as Three from 'three';

import { DESIGN } from '@/utils/constants';

import { loaderDispatchHelper } from '@/utils/utilities';

function Explosions() {
  let bus = [];
  this.id = 0;

  let explosion;

  let material = null;

  const audioLoader = new Three.AudioLoader();
  let boom;

  this.init = (
    scope,
    fireMaterial,
  ) => {
    material = fireMaterial;

    audioLoader.load('./audio/explosion.mp3', (buffer) => {
      loaderDispatchHelper(scope.$store, 'isExplosionLoaded');
      boom = buffer;
    });
  };

  this.addExplosionToBus = (scope, position, radius, maxScale) => {
    const geometry = new Three.SphereBufferGeometry(radius, 8, 8);
    explosion = new Three.Mesh(geometry, material);

    explosion.position.copy(position);

    scope.audio.playAudioAndRemoveObject(scope, explosion, boom, 'boom', DESIGN.VOLUME.explosion);

    ++this.id;
    bus.push({
      id: this.id,
      mesh: explosion,
      scale: 1,
      maxScale,
      isOff: false,
    });

    scope.scene.add(explosion);
  };

  this.removeExplosionFromBus = (scope, id) => {
    explosion = bus.find(record => record.id === id);
    bus = bus.filter(record => record.id !== id);
    explosion.mesh.visible = false;
  };

  this.animate = (scope) => {
    bus.forEach((record) => {
      if (!record.isOff) record.scale += scope.delta * 50;
      else record.scale -= scope.delta * 50;

      if (record.scale > record.maxScale) record.isOff = true;

      if (record.scale >= 0) record.mesh.scale.set(record.scale, record.scale, record.scale);
      if (record.scale >= record.maxScale) {
        record.mesh.material.opacity = 1;
      } else if (record.scale < 0) {
        record.mesh.material.opacity = 0;
      } else record.mesh.material.opacity = record.scale / record.maxScale;
      record.mesh.rotateX(scope.delta * -3);
      record.mesh.rotateZ(scope.delta * -3);
      record.mesh.rotateY(scope.delta * -3);

      if (record.scale < 0) this.removeExplosionFromBus(scope, record.id);
    });
  };
}

export default Explosions;
