<template>
  <div class="nuevoPedido">
    <h1 class="subheading grey--text">Nuevo Pedido</h1>

    <v-container class="my-5">

      <v-stepper v-model="step">

        <v-stepper-header>

          <template v-for="n in steps">

            <v-stepper-step :key="`${n}-step`" :complete="step > n" :step="n">
              Paso {{n}}
            </v-stepper-step>

            <v-divider v-if="n !== steps" :key="n"></v-divider>

          </template>

        </v-stepper-header>

        <v-stepper-items>

          <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n">

            <template v-if="step==1">
              <SeleccionarApunte v-on:validar="validar()" v-on:enviarApunte="recibirApunte($event)"/>
              <v-btn :disabled="!valid" color="primary" @click="nextStep(n)">Continuar</v-btn>
            </template>

            <template v-if="step==2">
              <PersonalizarPedido v-bind:precio="precio" v-on:validar="validar()"/>
              <v-textarea label="Comentario" background-color="grey lighten-2" class="mx-2" rows="1" auto-grow v-model="comentario_pedido"></v-textarea>
              <v-btn color="error" @click="lastStep(n)">Volver</v-btn>
              <v-btn :disabled="!valid" color="primary" @click="guardarComentario();nextStep(n)">Continuar</v-btn>
            </template>

            <template v-if="step==3">
              <ConfirmarPedido/>
              <v-btn color="error" @click="lastStep(n)">Volver</v-btn>
              <v-btn color="success" @click="confirmar()">Confirmar</v-btn>
            </template>

          </v-stepper-content>

        </v-stepper-items>

      </v-stepper>

    </v-container>

  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import SeleccionarApunte from "@/components/SeleccionarApunte"
import PersonalizarPedido from "@/components/PersonalizarPedido"
import ConfirmarPedido from "@/components/ConfirmarPedido"
export default {
  components: {
    SeleccionarApunte,
    PersonalizarPedido,
    ConfirmarPedido
  },
  data() {
    return {
      step: 1,
      steps: 3,
      valid: false,
      apuntes: [],
      precio: null,
      comentario_pedido: ''
    }
  },
  methods: {
    nextStep(n) {
      if (n === this.steps) {
        this.step = 1
      } else {
        this.step = n + 1
      }
    },
    lastStep(n) {
      if (n === this.steps) {
        this.step = 2
      } else {
        this.step = n - 1
      }
    },
    getPrecios(){
      axios({
        method: "GET",
        url: "http://localhost:8080/api/precioactual",
        headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
      }).then(response => {
        this.precio = response.data
      }).catch(error => {
        if (error.response.status === 403){
          if (localStorage.getItem("carrito") != null){
            localStorage.removeItem("carrito")
          }
          this.$store.dispatch('logout')
          .then(resp => this.$router.push(resp))
        }
      })
    },
    recibirApunte(apunte){
      
      if (localStorage.getItem("carrito") === null) {
        let carrito = new Object();
        carrito.comentario_pedido = ''
        carrito.precio_pedido = 0
        carrito.lineas = []
        localStorage.setItem('carrito', JSON.stringify(carrito))
      }

      let apunteLinea = {}
      apunteLinea.apunte = apunte
      apunteLinea.encuadernacion_linea_pedido = 'Sin'
      apunteLinea.plegado_linea_pedido = 'Simple'
      apunteLinea.color_linea_pedido = 'N/B'
      apunteLinea.copias_linea_pedido = 1
      apunteLinea.precio_linea_pedido = apunte.cantidad_paginas_apunte*this.precio.preciocopia_precioactual
      let carrito = JSON.parse(localStorage.getItem("carrito"))
      carrito.lineas.push(apunteLinea)
      localStorage.setItem('carrito', JSON.stringify(carrito))
      this.validar()
      
    },
    validar(){
      if (localStorage.getItem("carrito") == null){
        this.valid = false
      } else {
        let carrito = JSON.parse(localStorage.getItem("carrito"))
        if (carrito.lineas.length == 0){
          this.valid = false
          this.step = 1
        } else {
          this.valid = true
        }
      }
    },
    guardarComentario(){
      if (localStorage.getItem("carrito") != null){
        let carrito = JSON.parse(localStorage.getItem("carrito"))
        if (carrito.lineas.length>0){
          carrito.comentario_pedido = this.comentario_pedido
          localStorage.setItem('carrito', JSON.stringify(carrito))
        }
      }
    },
    confirmar(){
      if (localStorage.getItem("carrito") != null){
        let carrito = JSON.parse(localStorage.getItem("carrito"))
        axios({
          method: "POST",
          url: "http://localhost:8080/api/users/user/pedido",
          data: carrito,
          headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
        }).then(() => {
          this.$router.push('/userDashboard')
        }).catch(error => {
          switch(error.response.status){
            case 422:
            case 404: {
              Swal.fire({
                title: '¡Fail!',
                text: error.response.data.mensaje,
                icon: 'error',
                confirmButtonText: 'Volver'
              })
              break;
            }
            case 403: {
              this.$store.dispatch('logout')
              .then(resp => this.$router.push(resp))
              break;
            }
            default:
              Swal.fire({
                title: '¡Fail!',
                text: 'Intentar de nuevo',
                icon: 'error',
                confirmButtonText: 'Volver'
              })
              break;
          }
        })
      }
    },
  },
  watch:{
    steps (val) {
      if (this.step > val) {
        this.step = val
      }
    },
  },
  created(){
    this.getPrecios(),
    this.validar()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path != '/userDashboard'){
      if (localStorage.getItem("carrito") != null){
        let carrito = JSON.parse(localStorage.getItem("carrito"))
        if (carrito.lineas.length > 0){
          Swal.fire({
            title: '¿Continuas con tu pedido?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, continuar',
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'No',
            cancelButtonColor: '#d33',
          }).then((result) => {
            if (!result.value) {
              localStorage.removeItem("carrito")
              next()
            }
          })
        } else {
          localStorage.removeItem("carrito")
          next()
        }
      } else {
        next()
      }
    } else {
      if (localStorage.getItem("carrito") != null){
        localStorage.removeItem("carrito")
      }
      next()
    }
  
  }

}
</script>