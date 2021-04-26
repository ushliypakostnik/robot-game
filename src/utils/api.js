import axios from 'axios';

import { API_URL, LOCALSTORAGE } from '@/utils/constants';

axios.defaults.withCredentials = false;

export default ({
  setUser() {
    return this.post('/user', { robotID: localStorage.getItem(LOCALSTORAGE.ROBOTID) });
  },

  saveUser(user) {
    return this.post('/save', { user });
  },

  // ----------------------
  // general API interfaces
  // ----------------------

  // axios get interface
  get(url) {
    return new Promise((resolve, reject) => {
      // console.log(`${new Date().toISOString()} | API request, GET: ${url}`);
      axios
        .get(API_URL + url)
        .then(
          (response) => {
            resolve(response.data);
          },
          (err) => {
            reject(err);
          },
        )
        .catch((error) => {
          reject(error);
        });
    });
  },

  // axios post interface
  post(url, data) {
    return new Promise((resolve, reject) => {
      // console.log(`${new Date().toISOString()} | API request, POST: ${url}`);
      axios
        .post(API_URL + url, data)
        .then(
          (response) => {
            resolve(response);
          },
          (err) => {
            reject(err);
          },
        )
        .catch((error) => {
          reject(error);
        });
    });
  },

  // axios delete interface
  delete(url) {
    return new Promise((resolve, reject) => {
      // console.log(`${new Date().toISOString()} | API request, DELETE: ${url}`);
      axios
        .delete(API_URL + url)
        .then(
          (response) => {
            resolve(response.data);
          },
          (err) => {
            reject(err);
          },
        )
        .catch((error) => {
          reject(error);
        });
    });
  },
});
