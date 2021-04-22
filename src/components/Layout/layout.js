import { mapActions } from 'vuex';

import { DESIGN } from '@/utils/constants';
import storage from '@/utils/storage';

export default {
  methods: {
    ...mapActions({
      setLevel: 'layout/setLevel',
    }),

    reloadToStartFromSandbox() {
      storage.updateHero(this.level, false);

      this.setLevel({ level: 1, levelFrom: 0 });

      window.location.reload();
    },

    reloadToStart(isWin) {
      if (isWin) storage.saveHero(this, false, true);
      else storage.updateHero(this.level, false);

      this.setLevel({ level: this.level, levelFrom: this.level });

      window.location.reload();
      /* setTimeout(() => {
        window.location.reload();
      }, 3000); */
    },

    reloadToStartFirst() {
      storage.updateHero(this.level, true);

      this.setLevel({ level: DESIGN.LEVELS.start, levelFrom: DESIGN.LEVELS.start });

      window.location.reload();
    },

    levelReload(level, levelFrom) {
      if (levelFrom !== 0) storage.saveHero(this, false, false);
      else storage.updateHero(this.level, false);

      this.setLevel({ level, levelFrom });

      window.location.reload();
    },
  },
};
