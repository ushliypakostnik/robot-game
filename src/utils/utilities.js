export const randomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

export const yesOrNo = () => Math.random() >= 0.5;

export const plusOrMinus = () => {
  return Math.random() >= 0.5 ? 1 : -1;
};

export const loaderDispatchHelper = (store, field) => {
  store.dispatch('preloader/preloadOrBuilt', field).then(() => {
    store.dispatch('preloader/isAllLoadedAndBuilt');
  }).catch((error) => { console.log(error); });
};

export const messagesByViewDispatchHelper = (scope, view, name, data) => {
  if (!scope.messages.some(message => message[1] === view)) scope.showMessage({ id: null, view, name, data });
};

export const distance2D = (x1, y1, x2, y2) => {
  return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
};

export const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

export const radiansToDegrees = (radians) => {
  return radians * (180/ Math.PI);
};

export const randomPointInCircle = (radius, x, y) => {
  const r = radius * Math.sqrt(Math.random());
  const theta = Math.random() * 2 * Math.PI;
  return [x + Math.cos(theta) * r, y + Math.sin(theta) * r];
};

export const getNumberSign = (number) => {
  return number === 0 ? 0 : number > 0 ? 1 : -1;
};

export const getNotPartOfName = (name, part) => {
  return name.slice(name.indexOf(part) + part.length);
};
