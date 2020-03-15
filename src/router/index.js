import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import VueJwtDecode from 'vue-jwt-decode'
import Login from '../components/Login.vue'
import SecureAdmin from '../views/SecureAdmin.vue'
import SecureAlumno from '../views/SecureAlumno.vue'
import SecureEncargado from '../views/SecureEncargado.vue'
import UserDashboard from '../views/UserDashboard.vue'
import NuevoPedido from '../views/NuevoPedido.vue'
import EncargadoDashboard from '../views/EncargadoDashboard.vue'
import NuevoApunte from '../views/NuevoApunte.vue'
import HabilitarAlumno from '../views/HabilitarAlumno.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import NuevaCatedra from '../views/NuevaCatedra.vue'
import ActualizarPrecio from '../views/ActualizarPrecio.vue'

Vue.use(Router)

let router = new Router({
  store,
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/securealumno',
      name: 'securealumno',
      component: SecureAlumno,
      meta: { 
        requiresAuth: true,
        authAllow: 'alumno'
      },
      children: [
        {
          path: '/userDashboard',
          component: UserDashboard
        },
        {
          path: '/nuevoPedido',
          component: NuevoPedido
        },
      ]
    },
    {
      path: '/secureencargado',
      name: 'secureencargado',
      component: SecureEncargado,
      meta: { 
        requiresAuth: true,
        authAllow: 'encargado'
      },
      children: [
        {
          path: '/encargadoDashboard',
          component: EncargadoDashboard
        },
        {
          path: '/nuevoApunte',
          component: NuevoApunte
        },
        {
          path: '/habilitarAlumno',
          component: HabilitarAlumno
        }
      ]
    },
    {
      path: '/secureadmin',
      name: 'secureadmin',
      component: SecureAdmin,
      meta: { 
        requiresAuth: true,
        authAllow: 'admin'
      },
      children: [
        {
          path: '/adminDashboard',
          component: AdminDashboard
        },
        {
          path: '/nuevaCatedra',
          component: NuevaCatedra
        },
        {
          path: '/actualizarPrecio',
          component: ActualizarPrecio
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth) {
    if (store.getters.isLoggedIn) {
      let userData = VueJwtDecode.decode(store.getters.getToken)
      if (userData.authority.localeCompare(to.meta.authAllow)==0) {
        next()
      } else {
        if (userData.authority == 'alumno'){
          next('/securealumno')
        } else if (userData.authority == 'encargado'){
          next('/secureencargado')
        } else if (userData.authority == 'admin'){
          next('/secureadmin')
        }
      }
      
    } else {
      next('/login')
    } 
  } else {
    next() 
  }
})

export default router;