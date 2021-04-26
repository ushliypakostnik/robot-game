import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      health: 'hero/health',
      endurance: 'hero/endurance',
      ammo: 'hero/ammo',
      weight: 'hero/weight',

      red: 'hero/red',
      orange: 'hero/orange',
      green: 'hero/green',
      purple: 'hero/purple',

      passes: 'hero/passes',

      isHeroOnUpgrade: 'hero/isHeroOnUpgrade',
      isHeroTired: 'hero/isHeroTired',
      isHeroOnDamage: 'hero/isHeroOnDamage',
      isHeroOnHit: 'hero/isHeroOnHit',

      isNotDamaged: 'hero/isNotDamaged',
      isNotTired: 'hero/isNotTired',
      isTimeMachine: 'hero/isTimeMachine',
      isGain: 'hero/isGain',

      isOptical: 'hero/isOptical',

      directionX: 'hero/directionX',
      directionY: 'hero/directionY',
      directionZ: 'hero/directionZ',
    }),
  },
};
