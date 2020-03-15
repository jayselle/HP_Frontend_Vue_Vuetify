<template>
    <div class="actualizarPrecio">
        <h1 class="subheading grey--text">Registrar Precio</h1>

        <v-container class="my-5">

          <v-row>
            <v-col>
              <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn color="success" dark v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <p class="display-1">
                      Nuevo Precio
                    </p>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form ref="form" v-model="valid">
                        <v-row>
                          <v-col cols="4">
                            <v-text-field v-model="preciocopia" :rules="precioActualRules" label="Copia" type="number" step="0.01" min="0"></v-text-field>
                          </v-col>
                          <v-col cols="4">
                            <v-text-field v-model="preciocolor" :rules="precioActualRules" label="Color" type="number" step="0.01" min="0"></v-text-field>
                          </v-col>
                          <v-col cols="4">
                            <v-text-field v-model="precioanillado" :rules="precioActualRules" label="Anillado" type="number" step="0.01" min="0"></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="dialog = false">Cerrar</v-btn>
                    <v-btn :disabled="!valid" rounded color="primary" :dark="valid" @click="actualizarPrecio">Guardar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            
            <v-col cols="12">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Copia</th>
                      <th class="text-left">Color</th>
                      <th class="text-left">Anillado</th>
                      <th class="text-left">Fecha y Hora Desde</th>
                      <th class="text-left">Fecha y Hora Hasta</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(precio,index) in precios" :key="index">
                      <td>$ {{ precio.preciocopia_precioactual }}</td>
                      <td>$ {{ precio.preciocolor_precioactual }}</td>
                      <td>$ {{ precio.precioanillado_precioactual }}</td>
                      <td>{{ precio.fechadesde_precioactual }}</td>
                      <td>{{ precio.fechahasta_precioactual }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

            </v-col>
          </v-row>

        </v-container>

    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
    data(){
      return {
        precios: [],
        dialog: false,
        valid: true,
        precioActual: [],
        preciocopia: null,
        preciocolor: null,
        precioanillado: null,
        precioActualRules: [
          v => !!v || 'Completar',
          v => (v>0) || 'Numero positivo',
          v => /^(\d*\.)?\d+$/.test(v) || 'Numero entero o decimal positivo',
        ],
      }
    },
    methods: {
      actualizarPrecio(){
        if (this.$refs.form.validate()){
          let precio = {}
          precio.preciocopia_precioactual = this.preciocopia
          precio.preciocolor_precioactual = this.preciocolor
          precio.precioanillado_precioactual = this.precioanillado
          axios({
              method: "PUT",
              url: "http://localhost:8080/api/admins/precioactual",
              headers: {"authorization" : "Bearer "+localStorage.getItem('token')},
              data: precio,
          })
          .then(response => {
            this.getPrecios()
            this.dialog = false
            Swal.fire({
              title: '¡Listo!',
              text: response.data.mensaje,
              icon: 'success',
            })
          })
          .catch(error => {
            this.dialog = false
            switch(error.response.status){
              case 422:{
                Swal.fire({
                  title: '¡Fail!',
                  text: error.response.data.mensaje,
                  icon: 'error',
                  confirmButtonText: 'Volver'
                })
                break;
              }
              case 409:{
                Swal.fire({
                  title: '¡Sin cambios!',
                  text: error.response.data.mensaje,
                  icon: 'info',
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
      getPrecios(){
          axios({
          method: "GET",
          url: "http://localhost:8080/api/precios",
          headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
        })
        .then(response => {
          this.precios = response.data.data
          this.preciocopia = this.precios[0].preciocopia_precioactual
          this.preciocolor = this.precios[0].preciocolor_precioactual
          this.precioanillado = this.precios[0].precioanillado_precioactual
        })
        .catch(error => {
          if (error.response.status === 403){
            this.$store.dispatch('logout')
            .then(resp => this.$router.push(resp))
          }
        })
      }
    },
    created(){
      this.getPrecios()
    }
  }
</script>