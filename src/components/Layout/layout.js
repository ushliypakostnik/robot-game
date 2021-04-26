import {mapActions, mapGetters} from 'vuex';

import { isBackend, DESIGN } from '@/utils/constants';
import storage from '@/utils/storage';

export default {
  computed: {
    ...mapGetters({
      isUser: 'layout/isUser',
    }),
  },

  methods: {
    ...mapActions({
      setUser: 'layout/setUser',
      saveUser: 'layout/saveUser',
      updateUser: 'layout/updateUser',

      setLevel: 'layout/setLevel',
    }),

    reloadToStartFromSandbox() {
      if (!isBackend) {
        this.setLevel({
          level: 1,
          levelFrom: 0
        });

        storage.updateHero(0, false);

        window.location.reload(true);
      } else {
        this.updateUser({
          scope: this,
          isFirst: false,
          level: 1,
          levelFrom: 0,
        });
      }
    },

    reloadToStart(isWin) {
      if (!isBackend) {
        this.setLevel({
          level: this.level,
          levelFrom: this.level,
        });

        if (isWin) storage.saveHero(this, false, true);
        else storage.updateHero(this.level, false);

        window.location.reload(true);
        /* setTimeout(() => {
          window.location.reload();
        }, 3000); */
      } else {
        if (isWin) this.saveUser({
          scope: this,
          isF5: false,
          level: this.level,
          levelFrom: this.level,
        });
        else {
          this.updateUser({
            scope: this,
            isFirst: false,
            level: this.level,
            levelFrom: this.levelFrom,
          });
        }
      }
    },

    reloadToStartFirst() {
      if (!isBackend) {
        this.setLevel({
          level: DESIGN.LEVELS.start,
          levelFrom: DESIGN.LEVELS.start,
        });

        storage.updateHero(this.level, true);

        window.location.reload(true);
      } else {
        this.updateUser({
          scope: this,
          isFirst: true,
          level: DESIGN.LEVELS.start,
          levelFrom: DESIGN.LEVELS.start,
        });
      }
    },

    levelReload(level, levelFrom) {
      if (!isBackend) {
        this.setLevel({ level, levelFrom });

        if (levelFrom !== 0) storage.saveHero(this, false, false);
        else storage.updateUser(0, false);

        window.location.reload(true);
      } else {
        if (levelFrom !== 0) this.saveUser({
          scope: this,
          isF5: false,
          level,
          levelFrom,
        });
        else {
          this.updateUser({
            scope: this,
            isFirst: false,
            level,
            levelFrom,
          });
        }
      }
    },
  },
};
