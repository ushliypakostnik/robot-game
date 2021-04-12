import * as Three from 'three';

import { DESIGN } from '@/utils/constants';

import { loaderDispatchHelper } from '@/utils/utilities';

function HeroWeapon() {
  const ammos = [];
  let ammoIndex;
  let ammo;

  let weapon;
  let result;

  this.init = (scope) => {
    const fireTexture = new Three.TextureLoader().load(
      './images/textures/purple.jpg',
      () => {
        loaderDispatchHelper(scope.$store, 'isPurpleLoaded');
        scope.render();
      },
    );

    const fireMaterial = new Three.MeshPhongMaterial({
      map: fireTexture,
      color: DESIGN.COLORS.white
    });
    fireMaterial.map.repeat.set(4, 4);
    fireMaterial.map.wrapS = fireMaterial.map.wrapT = Three.RepeatWrapping;
    fireMaterial.map.encoding = Three.sRGBEncoding;

    const fireGeometry = new Three.SphereBufferGeometry(DESIGN.HERO.weapon.radius, 8, 8);

    for (let ammoIndex = 0; ammoIndex <= DESIGN.HERO.weapon.quantity - 1; ammoIndex++) {
      ammo = new Three.Mesh(fireGeometry, fireMaterial);

      ammos.push({
        mesh: ammo,
        collider: new Three.Sphere(new Three.Vector3(0, 0, 0), DESIGN.HERO.weapon.radius),
        velocity: new Three.Vector3(),
        start: new Three.Vector3(),
        removed: true,
      });
    }

    ammoIndex = 0;
  };

  const update = (ammo) => {
    ammo.removed = false;
  };

  this.shot = (scope) => {
    ammo = ammos[ammoIndex];
    update(ammo);

    if (scope.isOptical) weapon = scope.weaponOptical;
    else weapon = scope.weapon; // eslint-disable-line prefer-destructuring

    ammo.start.set(weapon.position.x, weapon.position.y, weapon.position.z);
    ammo.collider.center.copy(ammo.start);

    scope.camera.getWorldDirection(scope.direction);
    ammo.velocity.copy(scope.direction).multiplyScalar(30);

    scope.scene.add(ammo.mesh);

    scope.setScale({
      field: DESIGN.HERO.scales.ammo.name,
      value: -1,
    });

    ammoIndex++;
    if (ammoIndex > ammos.length - 1) ammoIndex = 0;
  };

  const fly = (scope, ammo) => {
    ammo.collider.center.addScaledVector(ammo.velocity, scope.delta * 2.5);

    ammo.mesh.position.copy(ammo.collider.center);

    ammo.mesh.rotateX(scope.delta * 3);
    ammo.mesh.rotateZ(scope.delta * 3);
    ammo.mesh.rotateY(scope.delta * 3);
  };

  const remove = (scope, ammo) => {
    scope.scene.remove(ammo.mesh);
    ammo.removed = true;
  };

  const isAmmoCollitions = (scope, сollider) => {
    scope.result = scope.octree.sphereIntersect(сollider);
    scope.resultMutable = scope.octreeMutable.sphereIntersect(сollider);
    if (scope.result || scope.resultMutable) return true;
    return false;
  };

  this.animate = (scope) => {
    ammos.filter(ammo => !ammo.removed).forEach((ammo) => {
      fly(scope, ammo);

      result = isAmmoCollitions(scope, ammo.collider);

      // Улетело
      if (ammo.mesh.position.distanceTo(ammo.start) > DESIGN.WORLD_SIZE / 2 || result) {
        if (result) scope.world.explosions.addExplosionToBus(scope, ammo.collider.center, 0.5, 5);
        remove(scope, ammo);
      }
    });
  };
}

export default HeroWeapon;