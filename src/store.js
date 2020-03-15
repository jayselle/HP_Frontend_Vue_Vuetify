import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueJwtDecode from 'vue-jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      status: '',
      token: localStorage.getItem('token') || '',
      user : '',
      authority: ''
    },
    mutations: {
      auth_request(state){
        state.status = 'loading'
      },
      auth_success(state, data){
        state.status = 'success'
        state.token = data.token
        state.user = data.user
        state.authority = data.authority
      },
      auth_error(state){
        state.status = 'error'
      },
      logout(state){
        state.status = ''
        state.token = ''
      },
    },
    actions: {
      login({commit}, user){
        return new Promise((resolve, reject) => {
          commit('auth_request')
          axios({
            method: "POST",
            url: "http://localhost:8080/login",
            params: {
              username: user.user_usuario,
              password: user.password_usuario
            }
          })
          .then(resp => {
            let token = resp.data.mensaje
            let userData = VueJwtDecode.decode(token)
            let dataSuccess = {}
            dataSuccess.token = token
            dataSuccess.user = userData.user
            dataSuccess.authority = userData.authority
            localStorage.setItem('token', token)
            commit('auth_success', dataSuccess)
            if (userData.authority == 'alumno'){
              resolve('/userDashboard')
            } else if (userData.authority == 'encargado'){
              resolve('/encargadoDashboard')
            } else if (userData.authority == 'admin'){
              resolve('/adminDashboard')
            }
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
        })
      },
      register({commit}, nuevoUsuario){
        return new Promise((resolve, reject) => {
          commit('auth_request')
          axios({url: 'http://localhost:8080/register', data: nuevoUsuario, method: 'POST' })
            .then(resp => {
              let token = resp.data.mensaje
              let userData = VueJwtDecode.decode(token)
              let dataSuccess = {}
              dataSuccess.token = token
              dataSuccess.user = userData.user
              dataSuccess.authority = userData.authority
              localStorage.setItem('token', token)
              commit('auth_success', dataSuccess)
              if (userData.authority == 'alumno'){
                resolve('/userDashboard')
              } else if (userData.authority == 'encargado'){
                resolve('/encargadoDashboard')
              } else if (userData.authority == 'admin'){
                resolve('/secureadmin')
              }
            })
            .catch(err => {
              commit('auth_error')
              localStorage.removeItem('token')
              reject(err)
            })
        })
      },
      logout({commit}){
        return new Promise((resolve) => {
          commit('logout')
          localStorage.removeItem('token')
          if (localStorage.getItem("carrito") != null) {
            localStorage.removeItem('carrito')
          }
          resolve('/login')
        })
      }
    },
    getters: {
      isLoggedIn: state => !!state.token,
      getToken: state => state.token,
      authStatus: state => state.status,
      userAuthority: state => state.authority
    }
  })