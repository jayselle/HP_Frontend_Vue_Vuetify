<template>
  <div class="about">

    <h1 v-if="accion=='Impresion'" class="subheading grey--text">Registrar Impresion</h1>

    <h1 v-else class="subheading grey--text">Registrar Cobro</h1>

    <v-container class="my-5">

      <v-alert type="info" v-model="mostrarMensaje" :value="mostrarMensaje" dismissible>
        {{mensaje}}
      </v-alert>

      <v-row>
        <v-col cols="12" md="4">
          <v-select :items="acciones" v-model="accion" v-on:change="getPedidos" label="Registrar" outlined></v-select>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>

      <div v-if="accion=='Cobro'">
        <v-row>
          <v-col cols="12" sm="3">
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="legajo" :rules="legajoRules" label="Legajo" color="teal accent-3" required></v-text-field>
            </v-form>
          </v-col>
          <v-col cols="12" sm="3" align-self="center">
            <div>
              <v-btn :disabled="!valid" rounded color="teal accent-3" :dark="valid" @click="buscarAlumnoByLegajo">Buscar</v-btn>
            </div>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </div>
      
      <div v-if="alumno!=null">
      
        <v-row>
          <v-col cols="12">

              <h3 class="subheading grey--text">Datos del alumno</h3>

              <v-simple-table>
                  <thead>
                      <tr>
                          <th class="text-left">DNI</th>
                          <th class="text-left">Nombre</th>
                          <th class="text-left">Estado</th>
                          <th class="text-left">Fecha habilitacion</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>{{ alumno.dni }}</td>
                          <td>{{ alumno.nombreCompleto }}</td>
                          <td>{{ alumno.estado }}</td>
                          <td>{{ alumno.fechaHabilitacion }}</td>
                      </tr>
                  </tbody>
              </v-simple-table>

          </v-col>
        </v-row>
      
      </div>

      <div v-if="pedidos.length>0">

        <v-row>
          <v-col col="12">

            <h3 class="subheading grey--text">Pedidos para cobrar</h3>

            <v-data-table :headers="headers" :items="pedidos" :single-expand="true" item-key="id_pedido" show-expand class="elevation-1">

              <template v-slot:item.precio_pedido="{item}">
                $ {{item.precio_pedido}}
              </template>

              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  
                  <div v-for="(linea,index) in item.lineas" :key="index" class="pa-1">
                    
                    <v-row :class="accion">
                      <v-col>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">Titulo</th>
                                <th class="text-left">Autor</th>
                                <th class="text-left">Catedra</th>
                                <th class="text-left">Departamento</th>
                                <th class="text-left">Nivel</th>
                                <th class="text-left">Encuadernacion</th>
                                <th class="text-left">Plegado</th>
                                <th class="text-left">Color</th>
                                <th class="text-left">Copias</th>
                                <th class="text-left">Precio</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td width="15%">{{ linea.apunte.titulo_apunte }}</td>
                                <td width="15%">{{ linea.apunte.autor_apunte }}</td>
                                <td width="15%">{{ linea.apunte.nombre_catedra }}</td>
                                <td width="10%">{{ linea.apunte.nombre_departamento }}</td>
                                <td width="10%">{{ linea.apunte.nombre_nivel }}</td>
                                <td width="10%">{{ linea.encuadernacion_linea_pedido }}</td>
                                <td width="10%">{{ linea.plegado_linea_pedido }}</td>
                                <td width="5%">{{ linea.color_linea_pedido }}</td>
                                <td width="5%">{{ linea.copias_linea_pedido }}</td>
                                <td width="5%">$ {{ linea.precio_linea_pedido }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-col>
                    </v-row>

                  </div>

                  <v-row v-if="accion=='Impresion'">
                    <v-col>
                      <BtnImprimir v-bind:idPedido="item.id_pedido" v-on:cambiarEstado="getPedidos"/>
                    </v-col>
                  </v-row>
                  <v-row v-else>
                    <v-col>
                      <BtnCobrar v-bind:idPedido="item.id_pedido" v-on:cambiarEstado="getPedidos"/>
                    </v-col>
                  </v-row>

                </td>
              </template>
            
            </v-data-table>

          </v-col>
        </v-row>

      </div>
      
    </v-container>

  </div>

</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import BtnImprimir from "@/components/BtnImprimir"
import BtnCobrar from "@/components/BtnCobrar"
export default {
    components: {
      BtnImprimir,
      BtnCobrar
    },
    data(){
        return {
          headers:[],
          headersImprimir:[
            { text: 'Id', value: 'id_pedido' },
            { text: 'Fecha', value: 'fecha_pedido' },
            { text: 'Comentario', value: 'comentario_pedido' },
            { text: '', value: 'data-table-expand' },
          ],
          headersCobrar:[
            { text: 'Id', value: 'id_pedido' },
            { text: 'Fecha', value: 'fecha_pedido' },
            { text: 'Precio', value: 'precio_pedido' },
            { text: 'Comentario', value: 'comentario_pedido' },
            { text: '', value: 'data-table-expand' },
          ],
          valid: true,
          mostrarMensaje: false,
          alumno: null,
          mensaje: '',
          pedidos: [],
          acciones: ['Impresion','Cobro'],
          accion: 'Impresion',
          legajo: '',
          legajoRules: [
              v => !!v || 'Completar Legajo',
              v => v > 0 || 'Solo numeros',
              v => !/\s/.test(v) || 'Sin espacios en blanco',
              v => v.length >= 5 || 'Mínimo 5 numeros',
          ],
        }
    },
    methods: {
      getPedidos(){
        switch(this.accion){
          case 'Impresion':{
            this.headers = this.headersImprimir
            axios({
              method: "GET",
              url: "http://localhost:8080/api/encargados/pedidos",
              headers: {"authorization" : "Bearer "+localStorage.getItem('token')},
              params: {
                estado: 'pendiente'
              },
            })
            .then(response => {
              this.pedidos = response.data.data
              this.validarCantPedidos(this.pedidos)
            })
            .catch(error => {
              if (error.response.status === 403){
                this.$store.dispatch('logout')
                .then(resp => this.$router.push(resp))
              }
            })
            break
          }
          case 'Cobro':{
            this.headers = this.headersCobrar
            this.pedidos = {}
            break
          }
          default: break
        }
      },
      buscarAlumnoByLegajo(){
        if (this.$refs.form.validate()){
          axios({
            method: "GET",
            url: "http://localhost:8080/api/encargados/user",
            headers: {"authorization" : "Bearer "+localStorage.getItem('token')},
            params: {
              legajo: this.legajo
            },
          }).then(response => {
            this.alumno = response.data.data
            if (this.alumno.estado == 'Inhabilitado'){
              Swal.fire({
                title: 'Estado del Alumno',
                text: 'El alumno '+this.alumno.nombreCompleto+' se encuentra inhabilitado',
                icon: 'warning',
                confirmButtonText: 'Volver'
              })
            } else {
              this.getPedidosACobrar()
              this.validarCantPedidos(this.pedidos)
            }
          }).catch(error => {
            switch(error.response.status){
              case 403: {
                this.$store.dispatch('logout')
                .then(resp => this.$router.push(resp))
              break;
              }
              case 404: {
                Swal.fire({
                  title: '¡Fail!',
                  text: error.response.data.mensaje,
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
      getPedidosACobrar(){
        axios({
          method: "GET",
          url: "http://localhost:8080/api/encargados/user/pedidos",
          headers: {"authorization" : "Bearer "+localStorage.getItem('token')},
          params: {
            legajo: this.alumno.legajo,
            estado: 'Impreso'
          },
        })
        .then(response => {
          this.pedidos = response.data.data
          if (this.pedidos.length<=0){
            this.mostrarMensaje = true
            this.mensaje = 'No hay pedidos para cobrar del alumno '+this.alumno.legajo
          } else {
            this.mostrarMensaje = false
            this.mensaje = ''
          }
        })
        .catch(error => {
          switch(error.response.status){
            case 403: {
              this.$store.dispatch('logout')
              .then(resp => this.$router.push(resp))
            break;
            }
            case 404: {
              Swal.fire({
                title: '¡Fail!',
                text: error.response.data.mensaje,
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
      },
      validarCantPedidos(pedidos){
        if (pedidos.length<=0){
          this.mostrarMensaje = true
          this.mensaje = 'No hay pedidos'
        } else {
          this.mostrarMensaje = false
          this.mensaje = ''
        }
      },
    },
    mounted() {
      this.getPedidos()
    }
}

</script>

<style scoped>

.Impresion{
  border-left: 3px solid #EF5350;
}

.Cobro{
  border-left: 3px solid #1E88E5;
}

</style>