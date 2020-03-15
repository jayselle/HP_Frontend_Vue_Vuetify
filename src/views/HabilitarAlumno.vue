<template>
    <div class="habilitarAlumno">
        <h1 class="subheading grey--text">Habilitar Alumno</h1>

        <v-container class="my-5">

            <v-alert type="info" v-model="mostrarMensaje" :value="mostrarMensaje" dismissible>
                {{mensaje}}
            </v-alert>
            
            <v-row>
                <v-col cols="12" sm="3">
                    <v-form ref="form" v-model="valid">
                        <v-text-field v-model="legajo" :rules="legajoRules" label="Legajo" color="teal accent-3" required></v-text-field>
                    </v-form>
                </v-col>
                <v-col cols="12" sm="3" align-self="center">
                    <div>
                        <v-btn :disabled="!valid" rounded color="teal accent-3" :dark="valid" @click="buscar">Buscar</v-btn>
                    </div>
                </v-col>
                <v-spacer></v-spacer>
            </v-row>

            <div v-if="alumno!=null && alumno.estado=='Inhabilitado'">
                
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
                                    <th class="text-left">Habilitar</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{ alumno.dni }}</td>
                                    <td>{{ alumno.nombreCompleto }}</td>
                                    <td>{{ alumno.estado }}</td>
                                    <td>{{ alumno.fechaHabilitacion }}</td>
                                    <td>
                                        <v-btn fab small class="red" @click="habilitarAlumno">
                                            <v-icon color="white">mdi-account-convert</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>

                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">

                        <h3 class="subheading grey--text">Pedidos del alumno</h3>

                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-select v-model="select" :items="items" item-text="estado" item-value="valor" label="Seleccionar" return-object v-on:change="change"></v-select>
                            </v-col>
                        </v-row>

                        <div v-if="pedidos.length>0">

                            <v-data-table :headers="headers" :items="pedidos" :single-expand="true" item-key="id_pedido" show-expand class="elevation-1">

                            <template v-slot:item.precio_pedido="{item}">
                                $ {{item.precio_pedido}}
                            </template>

                            <template v-slot:expanded-item="{ headers, item }">
                                <td :colspan="headers.length">
                                
                                <div v-for="(linea,index) in item.lineas" :key="index" class="pa-1">
                                    
                                    <v-row>
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
                                                <td width="5%">{{ linea.precio_linea_pedido }}</td>
                                            </tr>
                                            </tbody>
                                        </template>
                                        </v-simple-table>
                                    </v-col>
                                    </v-row>

                                </div>

                                </td>
                            </template>
                            
                            </v-data-table>

                        </div>

                    </v-col>
                </v-row>

            </div>
        
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
          mostrarMensaje: false,
          alumno: null,
          pedidos: [],
          mensaje: '',
          legajo: '',
          legajoRules: [
              v => !!v || 'Completar Legajo',
              v => v > 0 || 'Solo numeros',
              v => !/\s/.test(v) || 'Sin espacios en blanco',
              v => v.length >= 5 || 'Mínimo 5 numeros',
          ],
          headers:[
            { text: 'Id', value: 'id_pedido' },
            { text: 'Fecha', value: 'fecha_pedido' },
            { text: 'Precio', value: 'precio_pedido' },
            { text: 'Comentario', value: 'comentario_pedido' },
            { text: '', value: 'data-table-expand' },
          ],
          select: { estado: 'Vencidos', valor: 'vencido'},
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
        buscar(){
            if (this.$refs.form.validate()){
                axios({
                    method: "GET",
                    url: "http://localhost:8080/api/encargados/user",
                    headers: {"authorization" : "Bearer "+localStorage.getItem('token')},
                    params: {
                        legajo: this.legajo
                    },
                })
                .then(response => {
                    this.alumno = response.data.data
                    if (this.alumno.estado == 'Habilitado'){
                        Swal.fire({
                            title: 'Estado del Alumno',
                            text: 'El alumno '+this.alumno.nombreCompleto+' se encuentra habilitado',
                            icon: 'info',
                            confirmButtonText: 'Volver'
                        })
                    } else {
                        this.getPedidos(this.select,this.alumno.legajo)
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
            }
        },
        getPedidos(selectObject, legajoParam){
            axios({
                method: "GET",
                url: "http://localhost:8080/api/encargados/user/pedidos",
                headers: {"authorization" : "Bearer "+localStorage.getItem('token')},
                params: {
                    legajo: legajoParam,
                    estado: selectObject.valor
                },
            })
            .then(response => {
                this.pedidos = response.data.data
                if (this.pedidos.length<=0){
                    this.mostrarMensaje = true
                    this.mensaje = 'No hay pedidos '+selectObject.estado+' para el alumno '+legajoParam
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
        change(){
            this.getPedidos(this.select,this.alumno.legajo)
        },
        habilitarAlumno(){
            Swal.fire({
                title: '¿Habilitar alumno?',
                text: 'El alumno se encuentra inhabilitado',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Habilitar!',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
            }).then((result) => {
                if (result.value) {
                    axios({
                        method: "PUT",
                        url: "http://localhost:8080/api/encargados/user/habilitarAlumno",
                        params: {
                            legajo: this.legajo
                        },
                        headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
                    })
                    .then(() => {
                        Swal.fire(
                            '¡Listo!',
                            'El alumno se encuentra habilitado.',
                            'success'
                        )
                        this.pedidos = []
                        this.alumno = null
                    })
                    .catch(() => {
                        Swal.fire({
                            title: '¡Fail!',
                            text: 'Intentar de nuevo',
                            icon: 'error',
                            confirmButtonText: 'Volver'
                        })
                    })
                }
            })
        }
    }
}
</script>