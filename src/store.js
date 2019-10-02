import Vue from "vue";
import Vuex from "vuex";
import db from './firebase.js'
import firebase from 'firebase'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userId: "",
    userIsLoggedIn: false,
    error: ""
  },
  mutations: {
    setUser(state, payload) {
      state.userIsLoggedIn = payload || true;
    },
    setUserId(state, payload) {
      state.userId = payload;
    },
    setError(state, payload) {
      state.error = payload;
      setTimeout(() => {
        state.error = "";
      }, 5000);
    }
  },
  actions: {
    signUser({ commit }, payload) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          let userId = user.user.uid;
          if (userId) {
            db.collection("users")
              .add({
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                mobileNumber: payload.mobileNumber,
                id: user.user.uid
              })
              .then(() => {
                var user = firebase.auth().currentUser;
                if (user) {
                  commit("setUserId", user.uid);
                  commit("setUser", true);
                  console.log(user);
                } else {
                  console.log("error");
                }
              });
          }
        })
        .catch(err => {
          commit("setError", err);
        });
    },
    verifyEmail() {
     firebase.auth().onAuthStateChanged((user) => {
       if(user) {
         let user = firebase.auth().currentUser;
         user.sendEmailVerification()
          .then(() => {
            console.log('Email Sent to ' + user.email)
          })
          .catch((err) => {
            console.log(err)
          })
       }
     })
    }
  }
});
