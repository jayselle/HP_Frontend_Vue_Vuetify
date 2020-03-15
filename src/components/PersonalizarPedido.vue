<template>
    <div>
        
        <v-container class="my-5">

            <div v-if="tablaConDatos">
            
                <v-simple-table>
        
                    <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Autor</th>
                        <th>Paginas</th>
                        <th>Copias</th>
                        <th>Encuadernacion</th>
                        <th>Plegado</th>
                        <th>Color</th>
                        <th>Precio</th>
                        <th>Accion</th>
                    </tr>
                    </thead>
                    
                    <tbody v-for="item in carrito.lineas" :key="item.apunte.id_apunte">

                        <Linea v-bind:lineaRecibida="item" v-bind:precio="precio" v-on:enviarLinea="recibirLinea($event)" v-on:eliminarLinea="quitarLinea($event)"/>

                    </tbody>

                </v-simple-table>

                <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="2" class="font-weight-bold">
                        Total: $ {{carrito.precio_pedido}}
                    </v-col>
                </v-row>
                
            </div>

            <div v-else class="alert alert-primary" role="alert">
                ¡Todavia no hay apuntes en el carrito!
            </div>

        </v-container>

    </div>
</template>

<script>
import Linea from "@/components/Linea"
export default {
    data() {
        return {
            carrito: null,
            tablaConDatos: false
        }
    },
    components:{
        Linea
    },
    props:{
        precio: {type: Object}
    },
    methods: {
        completarTabla(){
            if (localStorage.getItem("carrito") === null) {
                this.tablaConDatos = false
            } else {
                this.carrito = JSON.parse(localStorage.getItem("carrito"))
                if (this.carrito.lineas.length == 0){
                    this.tablaConDatos = false
                } else {
                    this.tablaConDatos = true
                }
            }
        },
        recibirLinea(linea){
            this.carrito = JSON.parse(localStorage.getItem("carrito"))
            for (let index = 0; index < this.carrito.lineas.length; index++) {
                if (this.carrito.lineas[index].apunte.id_apunte == linea.apunte.id_apunte){
                    this.carrito.lineas[index] = linea
                    break
                }
            }
            this.carrito.precio_pedido = this.calcularTotal(this.carrito.lineas)
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
        },
        quitarLinea(linea){
            this.carrito = JSON.parse(localStorage.getItem("carrito"))
            this.carrito.lineas = this.carrito.lineas.filter(l => l.apunte.id_apunte != linea.apunte.id_apunte)
            if (this.carrito.lineas.length == 0){
                this.carrito.precio_pedido = 0
            } else {
                this.carrito.precio_pedido = this.calcularTotal(this.carrito.lineas)
            }
            localStorage.setItem('carrito', JSON.stringify(this.carrito))
            this.$emit('validar')
        },
        calcularTotal(lineas){
            let total = 0
            lineas.forEach(linea => {
                let precio = Number(linea.precio_linea_pedido)
                total += precio
            });
            return total.toFixed(2)
        }
    },
    created(){
        this.completarTabla()
    }
}
</script>