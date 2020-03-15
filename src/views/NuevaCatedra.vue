<template>
    <div class="nuevoApunte">
        <h1 class="subheading grey--text">Nueva Catedra</h1>

        <v-container class="my-5">
            <v-card flat>
                
                <v-form ref="form" v-model="valid">

                    <v-row>
                      <v-spacer></v-spacer>
                        
                        <v-col cols="12" sm="10" md="8">
                          <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="nombreCatedra" label="Nombre de la catedra" :rules="nombreCatedraRules" color="teal accent-3" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-select :items="depyniveles" v-model="depynivel" label="Departamento y Nivel" :rules="selectRules" required>

                              </v-select>
                            </v-col>
                            <v-col cols="12">
                              <v-btn :disabled="!valid" rounded color="teal accent-3" :dark="valid" @click="register">Registrar</v-btn>
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
        valid: true,
        nombreCatedra: '',
        nombreCatedraRules: [
          v => !!v || 'Completar',
          v => !/^\s/.test(v) || 'Sin espacio en blanco al principio',
          v => /^[a-zA-ZÁ-ÿ0-9 ]*$/.test(v) || 'Solo texto y/o letras',
          v => (v.length >= 3 && v.length <=25 ) || 'Entre 3 y 25 caracteres',
        ],
        selectRules: [
          v => !!v || 'Seleccionar',
        ],
        depynivel: null,
        depyniveles: [],
      }
    },
    mounted() {
      axios({
        method: "GET",
        url: "http://localhost:8080/api/departamentos",
        headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
      })
      .then(response => {
        response.data.data.forEach(departamento => {
            departamento.niveles.forEach(nivel => {
                let depynivel = {}
                depynivel.departamento = departamento.nombre_departamento
                depynivel.nivel = nivel.nombre_nivel
                
                let depynivelItem = {}
                depynivelItem.text = 'Departamento: '+depynivel.departamento +' -> Nivel: '+ depynivel.nivel
                depynivelItem.value = depynivel
                
                this.depyniveles.push(depynivelItem)
            });
        });
      })
      .catch(error => {
        if (error.response.status === 403){
          this.$store.dispatch('logout')
          .then(resp => this.$router.push(resp))
        }
      })
    },
    methods: {
      register(){
        if (this.$refs.form.validate()){
          let nuevaCatedra = {}
          nuevaCatedra.nombre_catedra = this.nombreCatedra
          nuevaCatedra.nombre_departamento = this.depynivel.departamento
          nuevaCatedra.nombre_nivel = this.depynivel.nivel
          axios({
              method: "POST",
              url: "http://localhost:8080/api/admins/catedra",
              data: nuevaCatedra,
              headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
          })
          .then(response => {
            Swal.fire({
              title: '¡Listo!',
              text: response.data.mensaje,
              icon: 'success',
            })
            this.$refs.form.reset()
          })
          .catch(error => {
            switch(error.response.status){
              case 422:
              case 409:
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
    }
  } 
}
</script>