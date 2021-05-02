/* eslint-disable no-unused-vars */
import * as Three from 'three';

import { loaderDispatchHelper } from '@/utils/utilities';

function Module() {
  this.init = (
    scope,
    // ...
  ) => {
    const sandTexture = new Three.TextureLoader().load(
      './images/textures/sand.jpg',
      () => {
        scope.render(); // нужно вызвать рендер если объекты использующию эту текстуру заметны "на первом экране"
        loaderDispatchHelper(scope.$store, 'isSandLoaded');
      },
    );

  };
}

export default Module;

// В @/utils/utilities.js:

export const loaderDispatchHelper = (store, field) => {
  store.dispatch('preloader/preloadOrBuilt', field).then(() => {
    store.dispatch('preloader/isAllLoadedAndBuilt');
  }).catch((error) => { console.log(error); });
};
