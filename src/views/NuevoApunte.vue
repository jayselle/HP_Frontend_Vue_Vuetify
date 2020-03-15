<template>
    <div class="nuevoApunte">
        <h1 class="subheading grey--text">Nuevo Apunte</h1>

        <v-container class="my-5">
            <v-card flat>
                
                <v-form ref="form" v-model="validRegister">

                  <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="12" sm="6">
                      
                      <v-row>
                        <v-col cols="12" sm="12" md="5">
                            <v-text-field v-model="titulo" :rules="tituloRules" label="Titulo" color="teal accent-3" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="5">
                            <v-text-field v-model="autor" :rules="autorRules" label="Autor" color="teal accent-3" required></v-text-field>
                        </v-col>
                        <v-col cols="3" sm="4" md="2">
                            <v-text-field v-model="paginas" :rules="paginasRules" label="Paginas" type="number" min="1" color="teal accent-3" required></v-text-field>
                        </v-col>
                        <v-col cols="9" sm="8" md="6">
                            <v-select v-model="tipoapunte" :items="tiposapunte" label="Tipo de apunte" color="teal accent-3" :rules="selectRules" required></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-autocomplete v-model="catedraJSON" :items="catedras" :search-input.sync="catedra" label="Catedra" item-text="nombre_catedra" item-value="nombre_catedra" :rules="autocompleteRules" required return-object>
                            <template v-slot:item="data">
                              <template>
                                <v-list-item-content>
                                  <v-list-item-title v-html="data.item.nombre_catedra" class="font-weight-medium"></v-list-item-title>
                                  <v-list-item-subtitle v-html="'Departamento: '+data.item.nombre_departamento + ' - Nivel: ' +data.item.nombre_nivel"></v-list-item-subtitle>
                                </v-list-item-content>
                              </template>
                            </template>
                          </v-autocomplete>
                        </v-col>
                        <v-col>
                          <div cols=12>
                            <v-btn :disabled="!validRegister" rounded color="teal accent-3" :dark="validRegister" @click="register">Registrar</v-btn>
                          </div>
                        </v-col>
                      </v-row>

                    </v-col>
                    <v-spacer></v-spacer>
                  </v-row>

                </v-form>
            
            </v-card>
        </v-container>

    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
    data(){
      return {
        validRegister: true,
        titulo: '',
        tituloRules: [
          v => !!v || 'Completar Titulo',
          v => !/^\s/.test(v) || 'Sin espacio en blanco al principio',
          v => (v.length >= 3 && v.length <=40 ) || 'Entre 3 y 40 caracteres',
        ], 
        autor: '',
        autorRules: [
          v => !!v || 'Completar Autor',
          v => !/^\s/.test(v) || 'Sin espacio en blanco al principio',
          v => (v.length >= 3 && v.length <=20 ) || 'Entre 3 y 40 caracteres',
        ],
        paginas: '',
        paginasRules: [
          v => !!v || 'Completar Paginas',
          v => /^[1-9][0-9]*$/.test(v) || 'Numero positivo',
        ],
        selectRules: [
          v => !!v || 'Seleccionar',
        ],
        autocompleteRules: [
          v => !!this.validarAutocomplete(v) || 'Seleccionar',
        ],
        catedra: '',
        catedraJSON: {},
        tipoapunte: '',
        catedras: [],
        tiposapunte: []
      }
    },
    mounted() {
      axios({
        method: "GET",
        url: "http://localhost:8080/api/catedras",
        headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
      })
      .then(response => {
        this.catedras = response.data.data
      }),
      axios({
        method: "GET",
        url: "http://localhost:8080/api/tiposapunte",
        headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
      })
      .then(response => {
        response.data.forEach(element => {
          this.tiposapunte.push(element.nombre_tipo_apunte)
        });
      })
    },
    methods: {
      register(){
        if (this.$refs.form.validate()){
          let nuevoApunte = {}
          nuevoApunte.titulo_apunte = this.titulo
          nuevoApunte.autor_apunte = this.autor
          nuevoApunte.cantidad_paginas_apunte = this.paginas
          nuevoApunte.tipoapunte = this.tipoapunte
          nuevoApunte.nombre_catedra = this.catedraJSON.nombre_catedra
          nuevoApunte.nombre_departamento = this.catedraJSON.nombre_departamento
          nuevoApunte.nombre_nivel = this.catedraJSON.nombre_nivel
          axios({
            method: "POST",
            url: "http://localhost:8080/api/encargados/apuntes",
            data: nuevoApunte,
            headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
          })
          .then(() => {
            Swal.fire(
              '¡Registrado!',
              'El apunte fue registrado.',
              'success'
            )
            this.$refs.form.reset()
          })
          .catch(err => {
            switch(err.response.status){
              case 422: {
                let mensajesError = err.response.data.data
                let mensajeError = ''
                mensajesError.forEach(element => {
                  mensajeError = mensajeError.concat('<li>'+element+'</li>')
                });
                let listaErrores = '<ul style="list-style-type:none">'+mensajeError+'</ul>'
                Swal.fire({
                  title: '¡Fail!',
                  text: 'Campos inválidos',
                  html: listaErrores,
                  icon: 'error',
                  confirmButtonText: 'Volver'
                })
              break;
              }
              case 404:
              case 409: {
                Swal.fire({
                  title: '¡Fail!',
                  text: err.response.data.mensaje,
                  icon: 'error',
                  confirmButtonText: 'Volver'
                })
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
      validarAutocomplete(v){
        if (Object.keys(v).length === 0){
          return false
        } else {
          return true
        }
      }
    }
}
</script>