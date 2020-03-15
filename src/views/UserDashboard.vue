<template>
  <div class="dashboard">
    <h1 class="subheading grey--text">Dashboard</h1>

    <v-container class="my-5">
      
      <v-alert type="info" v-model="mostrarMensaje" :value="mostrarMensaje" dismissible>
        {{mensaje}}
      </v-alert>

      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-select v-model="select" :items="items" :expanded.sync="expanded" item-text="estado" item-value="valor" label="Seleccionar" return-object v-on:change="change"></v-select>
        </v-col>
      </v-row>

      <div v-if="pedidos.length>0">
        
        <v-data-table :headers="headers" :items="pedidos" :single-expand="true" item-key="id_pedido" :loading="loading" loading-text="Cargando..." show-expand class="elevation-1">

            <template v-slot:item.estado_pedido="{item}">
              <div v-if="item.estado_pedido=='Impreso'">
                <v-chip color="green" text-color="white">¡LISTO!</v-chip>
              </div>
              <div v-else>
                {{item.estado_pedido}}
              </div>
            </template>

            <template v-slot:item.precio_pedido="{item}">
              $ {{item.precio_pedido}}
            </template>

            <template v-slot:item.data-table-expand="{ expand, isExpanded}">
                <v-icon @click="expand(!isExpanded)">$arrowdown</v-icon>
            </template>
            
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                
                <div v-for="(linea,index) in item.lineas" :key="index" class="pa-1">
                  
                  <v-row :class="`pedido ${item.estado_pedido}`">
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

                <v-row v-if="item.estado_pedido=='Pendiente'">
                  <v-col cols="12">
                    <v-btn color="error" @click.native.stop="cancelarPedido(item.id_pedido)">Cancelar</v-btn>
                  </v-col>
                </v-row>

              </td>
            </template>
          
        </v-data-table>

      </div>

    </v-container>

  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
  data() {
    return {
      headers:[
        { text: 'Id', value: 'id_pedido' },
        { text: 'Fecha', value: 'fecha_pedido' },
        { text: 'Precio', value: 'precio_pedido' },
        { text: 'Estado', value: 'estado_pedido' },
        { text: 'Comentario', value: 'comentario_pedido' },
        { text: '', value: 'data-table-expand' },
      ],
      expanded: [],
      mostrarMensaje: false,
      mensaje: '',
      pedidos: [],
      loading: true,
      select: { estado: 'Impresos', valor: 'impreso'},
      items: [
          { estado: 'Todos', valor: 'todos'},
          { estado: 'Pendientes', valor: 'pendiente'},
          { estado: 'Impresos', valor: 'impreso'},
          { estado: 'Cobrados', valor: 'cobrado'},
          { estado: 'Vencidos', valor: 'vencido'},
          { estado: 'Cancelados', valor: 'cancelado'},
      ]
    }
  },
  methods: {
    getPedidos(selectObject){
      axios({
        method: "GET",
        url: "http://localhost:8080/api/users/user/pedidos",
        headers: {"authorization" : "Bearer "+localStorage.getItem('token')},
        params: {
            estado: selectObject.valor
        },
      })
      .then(response => {
        this.pedidos = response.data.data
        this.loading = false
        this.validarCantPedidos(this.pedidos)
      })
      .catch(error => {
        if (error.response.status === 403){
          this.$store.dispatch('logout')
          .then(resp => this.$router.push(resp))
        }
      })
    },
    cancelarPedido(idPedido){
      Swal.fire({
        title: '¿Cancelar pedido?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Si, cancelar!',
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'No, volver',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.value) {
          axios({
            method: "PUT",
            url: "http://localhost:8080/api/users/user/pedido",
            params: {
              id_pedido: idPedido
            },
            headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
          })
          .then(() => {
            this.getPedidos(this.select)
            Swal.fire(
            '¡Cancelado!',
            'El pedido fue cancelado.',
            'success'
            )
          })
          .catch(error => {
            switch(error.response.status){
              case 403: {
                this.$store.dispatch('logout')
                .then(resp => this.$router.push(resp))
              break;
              }
              case 404:
              case 409: {
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
      })
    },
    change(){
      this.getPedidos(this.select)
    },
    validarCantPedidos(pedidos){
      if (pedidos.length<=0){
        this.mostrarMensaje = true
        this.mensaje = 'No hay pedidos '+this.select.estado
      } else {
        this.mostrarMensaje = false
        this.mensaje = ''
      }
    },
  },
  created(){
    this.getPedidos(this.select)
  }
  
}

</script>

<style scoped>

.pedido{
  border-left: 5px solid #9E9E9E;
}

.pedido.Impreso{
  border-left: 5px solid #4CAF50;
}

</style>