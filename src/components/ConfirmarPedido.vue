<template>
    <div>
        
        <v-container class="my-5">

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
                    </tr>
                    </thead>
                    
                    <tbody>

                        <tr v-for="linea in carrito.lineas" :key="linea.apunte.id_apunte">
                            <td width="15%">{{linea.apunte.titulo_apunte}}</td>
                            <td width="15%">{{linea.apunte.autor_apunte}}</td>
                            <td width="10%">{{linea.apunte.cantidad_paginas_apunte}}</td>
                            <td width="10%">{{linea.copias_linea_pedido}}</td>
                            <td width="15%">{{linea.encuadernacion_linea_pedido}}</td>
                            <td width="15%">{{linea.plegado_linea_pedido}}</td>
                            <td width="10%">{{linea.color_linea_pedido}}</td>
                            <td width="10%">$ {{linea.precio_linea_pedido}}</td>
                        </tr>
                        
                    </tbody>

                </v-simple-table>

                <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="2" class="font-weight-bold">
                        Total: $ {{carrito.precio_pedido}}
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        {{carrito.comentario_pedido}}
                    </v-col>
                </v-row>

        </v-container>

    </div>
</template>

<script>
export default {
    data() {
        return {
            carrito: null,
        }
    },
    created() {
        this.carrito = JSON.parse(localStorage.getItem("carrito"))
    }
}
</script>