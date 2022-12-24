import { DESIGN } from '@/utils/constants';

function EventsBus() {
  let bus = [];
  this.id = 0;
  let id;
  let pause;

  this.addEventsToBus = (delay, data, callback) => {
    ++this.id;
    bus.push({
      id: this.id,
      time: 0,
      delay,
      data,
      callback,
    });
  };

  this.removeEventsFromBus = (id) => {
    // eslint-disable-next-line no-const-assign
    bus = bus.filter(record => record.id !== id);
  };

  this.messagesByIdDispatchHelper = (scope, view, name, data, delay) => {
    id = scope.message;
    scope.addMessage(id);
    pause = delay || DESIGN.MESSAGES_TIMEOUT / 1000;

    // eslint-disable-next-line object-curly-newline
    scope.$store.dispatch('layout/showMessage', { id, view, name, data });
    this.addEventsToBus(pause, id, (data) => {
      scope.$store.dispatch('layout/hideMessageById', data);
    });
  };

  this.heroOnHitDispatchHelper = (scope, value, delay) => {
    pause = delay || DESIGN.ANIMATION_TIMEOUT / 1000;
    scope.setScale({
      field: DESIGN.HERO.scales.health.name,
      value,
    });

    scope.$store.dispatch('hero/setScale', {
      field: 'isHeroOnHit',
      value: true,
    }).then(() => {
      this.addEventsToBus(pause, null, () => {
        scope.$store.dispatch('hero/setScale', {
          field: 'isHeroOnHit',
          value: false,
        });
      });
    }).catch((error) => { console.log(error); });
  };

  this.heroOnUpgradeDispatchHelper = (scope) => {
    scope.$store.dispatch('hero/setScale', {
      field: 'isHeroOnUpgrade',
      value: true,
    }).then(() => {
      this.addEventsToBus(DESIGN.ANIMATION_TIMEOUT / 250, null, () => {
        scope.$store.dispatch('hero/setScale', {
          field: 'isHeroOnUpgrade',
          value: false,
        });
      });
    }).catch((error) => { console.log(error); });
  };

  this.delayDispatchHelper = (scope, delay, callback) => {
    pause = delay || DESIGN.ANIMATION_TIMEOUT / 1000;

    this.addEventsToBus(pause, null, () => callback());
  };

  this.animate = (scope) => {
    bus.forEach((record) => {
      record.time += scope.delta;

      if (record.time > record.delay) {
        record.callback(record.data);
        this.removeEventsFromBus(record.id);
      }
    });
  };
}

export default EventsBus;
