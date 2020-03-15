<template>

    <tr>
        <td width="15%">{{linea.apunte.titulo_apunte}}</td>
        <td width="15%">{{linea.apunte.autor_apunte}}</td>
        <td width="10%">{{linea.apunte.cantidad_paginas_apunte}}</td>
        <td>
            <v-text-field v-model="linea.copias_linea_pedido" type="number" min="1"></v-text-field>
        </td>
        <td width="15%">
            <v-select v-model="linea.encuadernacion_linea_pedido" :items="encuadernacion"></v-select>
        </td>
        <td width="15%">
            <v-select v-model="linea.plegado_linea_pedido" :items="plegado"></v-select>
        </td>
        <td width="10%">
            <v-select v-model="linea.color_linea_pedido" :items="color"></v-select>
        </td>
        <td width="10%">$ {{linea.precio_linea_pedido}}</td>
        <td width="10%">
            <v-btn fab small class="red" @click="eliminarLinea">
                <v-icon color="white">mdi-minus</v-icon>
            </v-btn>
        </td>

    </tr>

</template>

<script>
export default {
   data(){
       return {
            cantMinHojasParaAbrochar: 2,
            cantMaxHojasParaAbrochar: 100,
            cantMinHojasParaAnillar: 20,
            encuadernacion: ['Sin','Abrochado','Anillado'],
            plegado: ['Simple', 'Doble'],
            color: ['N/B', 'Color'],
            linea: {}
       }
   },
   props:{
       lineaRecibida: {type: Object},
       precio: {type: Object}
   },
   watch: {
        'linea.copias_linea_pedido'(){
            this.setEncuadernacion()
            this.actualizarPrecio()
            this.enviarLinea()
        },
        'linea.encuadernacion_linea_pedido'(){
            this.actualizarPrecio()
            this.enviarLinea()
        },
        'linea.plegado_linea_pedido'(){
            this.setEncuadernacion()
            this.enviarLinea()
        },
        'linea.color_linea_pedido'(){
            this.actualizarPrecio()
            this.enviarLinea()
        }
   },
   methods: {
       enviarLinea(){
           this.$emit('enviarLinea',this.linea)
       },
       eliminarLinea(){
           this.$emit('eliminarLinea',this.linea)
       },
       actualizarPrecio(){
           if (this.precio!=null) {
                let p = this.linea.apunte.cantidad_paginas_apunte * this.precio.preciocopia_precioactual
                if (this.linea.color_linea_pedido == 'Color') {
                    p = this.linea.apunte.cantidad_paginas_apunte * this.precio.preciocolor_precioactual
                }
                p *= this.linea.copias_linea_pedido
                if (this.linea.encuadernacion_linea_pedido == 'Anillado'){
                    p += this.precio.precioanillado_precioactual
                }
                this.linea.precio_linea_pedido = p.toFixed(2)
           }
       },
       setEncuadernacion() {
            this.encuadernacion = ['Sin']
            let cantHojasLinea = this.linea.apunte.cantidad_paginas_apunte*this.linea.copias_linea_pedido
            
            if (this.linea.plegado_linea_pedido == "Doble"){
                if ((this.linea.apunte.cantidad_paginas_apunte*this.linea.copias_linea_pedido)%2 == 1){
                    cantHojasLinea = ((this.linea.apunte.cantidad_paginas_apunte*this.linea.copias_linea_pedido)+1)/2;
                } else {
                    cantHojasLinea = (this.linea.apunte.cantidad_paginas_apunte*this.linea.copias_linea_pedido)/2;
                }
            }

            if (cantHojasLinea>=this.cantMinHojasParaAbrochar && cantHojasLinea<=this.cantMaxHojasParaAbrochar){
                this.encuadernacion.push('Abrochado')
            }
            if (cantHojasLinea>=this.cantMinHojasParaAnillar){
                this.encuadernacion.push('Anillado')
            }

            if (this.linea.encuadernacion_linea_pedido == 'Abrochado' && (cantHojasLinea<this.cantMinHojasParaAbrochar || cantHojasLinea>this.cantMaxHojasParaAbrochar)){
                this.linea.encuadernacion_linea_pedido = 'Sin'
            } else if (this.linea.encuadernacion_linea_pedido == 'Anillado' && cantHojasLinea<this.cantMinHojasParaAnillar){
                this.linea.encuadernacion_linea_pedido = 'Sin'
            }
       }
   },
   created(){
       this.linea = this.lineaRecibida
   }
}
</script>