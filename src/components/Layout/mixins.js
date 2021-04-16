import {mapActions, mapGetters} from "vuex";

import storage from '@/utils/storage';

export default {
  methods: {
    ...mapActions({
      setLevel: 'layout/setLevel',
    }),

    levelReload(level, levelFrom) {
      if (level) {
        if (levelFrom && levelFrom !== 0) storage.rememberDirection(this.hero.getHeroDirection().x, this.hero.getHeroDirection().y, this.hero.getHeroDirection().z);
        this.setLevel({ level, levelFrom });
        window.location.reload();
      } else window.location.reload();
    },
  },
};
