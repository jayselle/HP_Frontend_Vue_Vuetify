<template>
    
    <v-btn color="error" @click.native.stop="cambiarEstado()">Imprimir</v-btn>

</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
    props: {
        idPedido: {type: Number}
    },
    methods: {
        cambiarEstado(){
            Swal.fire({
                title: '¿Registrar impresion?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '¡Si, registrar!',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
            }).then((result) => {
                if (result.value) {
                    axios({
                        method: "PUT",
                        url: "http://localhost:8080/api/encargados/pedidos/nuevoEstado",
                        params: {
                            idPedido: this.idPedido,
                            nuevoEstado: 'Impreso'
                        },
                        headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
                    })
                    .then(response => {
                        response
                        this.$emit('cambiarEstado')
                    })
                    Swal.fire(
                        '¡Registrada!',
                        'La impresion fue registrada.',
                        'success'
                    )
                }
            })
        }
    }
}
</script>