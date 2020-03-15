<template>
    
    <div class="nuevoPedido">

        <v-container class="my-5">

        <v-row>
            <v-col cols="12" sm="3">
                <v-select :items="pagination.options" :value="pagination.itemsPerPage" label="Registros" @input="pagination.itemsPerPage = parseInt($event, 10)"></v-select>
            </v-col>
            <v-col cols="12" sm="9">
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar por titulo o autor" hide-details v-on:change="buscarTituloAutor"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-select v-model="departamentoSelected" :items="departamentosOptions" item-text="nombre" item-value="valor" label="Departamento" return-object v-on:change="selectDepartamento"></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-select v-model="nivelSelected" :items="filteredNiveles" item-text="nombre" item-value="valor" label="Nivel" return-object v-on:change="selectNivel"></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-select v-model="catedraSelected" :items="filteredCatedras" item-text="nombre" item-value="valor" label="Catedra" return-object v-on:change="selectCatedra"></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-select v-model="tipoSelected" :items="tiposOptions" item-text="nombre" item-value="valor" label="Tipo" return-object v-on:change="selectTipo"></v-select>
            </v-col>
        </v-row>

        <v-data-table :headers="headers" :items="filteredApuntes" :page.sync="pagination.page" :items-per-page="pagination.itemsPerPage" hide-default-footer @page-count="pagination.pageCount = $event" :loading="loading" loading-text="Cargando...">
            
            <template v-slot:item.accion="{ item }">
                <v-btn fab small class="green" @click="agregar(item)">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </template>

        </v-data-table>

        <v-pagination v-model="pagination.page" :length="pagination.pageCount" :total-visible="10"></v-pagination>

        </v-container>

    </div>

</template>

<script>
import axios from 'axios'
export default {
    data(){
        return {
            apuntes: [],
            search: '',
            headers: [
                { text: 'Titulo', value: 'titulo_apunte' },
                { text: 'Autor', value: 'autor_apunte' },
                { text: 'Paginas', value: 'cantidad_paginas_apunte' },
                { text: 'Departamento', value: 'nombre_departamento' },
                { text: 'Nivel', value: 'nombre_nivel' },
                { text: 'Catedra', value: 'nombre_catedra' },
                { text: 'Tipo', value: 'nombre_tipo_apunte' },
                { text: 'Acción', value: 'accion', sortable: false }
            ],
            pagination: {
                page: 1,
                pageCount: 0,
                itemsPerPage: 10,
                options: [10, 20, 50, 100]
            },
            valid: true,
            loading: true,
            depyniveles: null,
            catedras: null,
            ini: { nombre: 'Todos', valor: ''},
            departamentoSelected: null,
            nivelSelected: null,
            catedraSelected: null,
            tipoSelected: null,
            departamentosOptions: [],
            nivelesOptions: [],
            catedrasOptions: [],
            tiposOptions: [],
            filterQry: {
                qryTituloAutor: '',
                qryDepartamento: '',
                qryNivel: '',
                qryCatedra: '',
                qryTipo: '',
            }
        }
    },
    methods: {
        getApuntes(){
            axios({
                method: "GET",
                url: "http://localhost:8080/api/apuntes",
                headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
            })
            .then(response => {
                let arrayApuntes = response.data
                if (localStorage.getItem("carrito") === null) {
                    this.apuntes = arrayApuntes
                } else {
                    let carrito = JSON.parse(localStorage.getItem("carrito"))
                    if (carrito.lineas.length==0){
                        this.apuntes = arrayApuntes
                    } else {
                        carrito.lineas.forEach(linea => {
                            arrayApuntes = arrayApuntes.filter(apunte => apunte.id_apunte != linea.apunte.id_apunte)
                        })
                        this.apuntes = arrayApuntes
                    }
                }
                this.loading = false
                this.validar()
            })
            .catch(error => {
                if (error.response.status === 403){
                    if (localStorage.getItem("carrito") != null){
                        localStorage.removeItem("carrito")
                    }
                    this.$store.dispatch('logout')
                    .then(resp => this.$router.push(resp))
                }

            })
        },
        getDepartamentosYNiveles(){
            axios({
                method: "GET",
                url: "http://localhost:8080/api/departamentos",
                headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
            })
            .then(response => {
                this.depyniveles = response.data.data
                this.depyniveles.forEach(departamento => {
                    let dep = {}
                    dep.nombre = departamento.nombre_departamento
                    dep.valor = departamento.nombre_departamento
                    this.departamentosOptions.push(dep)
                });
            })
        },
        getCatedras(){
            axios({
                method: "GET",
                url: "http://localhost:8080/api/catedras",
                headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
            })
            .then(response => {
                this.catedras = response.data.data
                this.catedras.forEach(catedra => {
                    let cat = {}
                    cat.nombre = catedra.nombre_catedra
                    cat.valor = catedra.nombre_catedra
                    this.catedrasOptions.push(cat)
                });
            })
        },
        getTiposDeApuntes(){
            axios({
                method: "GET",
                url: "http://localhost:8080/api/tiposapunte",
                headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
            })
            .then(response => {
                response.data.forEach(tipoElement => {
                    let tipo = {}
                    tipo.nombre = tipoElement.nombre_tipo_apunte
                    tipo.valor = tipoElement.nombre_tipo_apunte
                    this.tiposOptions.push(tipo)
                });
            })
        },
        agregar(apunte) {
            this.apuntes = this.apuntes.filter(u => u != apunte)
            this.$emit('validar')
            this.$emit('enviarApunte',apunte)
        },
        buscarTituloAutor(tituloautor){
            this.filterQry.qryTituloAutor = tituloautor
        },
        selectDepartamento(selectDep){
            this.filterQry.qryDepartamento = selectDep.valor
            if (selectDep.valor == ''){
                this.filterQry.qryNivel = ''
                this.filterQry.qryCatedra = ''
                this.nivelSelected = this.ini
                this.catedraSelected = this.ini
            }
        },
        selectNivel(selectNivel){
            this.filterQry.qryNivel = selectNivel.valor
            if (selectNivel.valor == ''){
                this.filterQry.qryCatedra = ''
                this.catedraSelected = this.ini
            }
        },
        selectCatedra(selectCatedra){
            this.filterQry.qryCatedra = selectCatedra.valor
        },
        selectTipo(selectTipo){
            this.filterQry.qryTipo = selectTipo.valor
        },
        filterApuntes(arr, query){
            return arr.filter(function(item){
                let titulo = item.titulo_apunte.toLowerCase().includes(query.qryTituloAutor.toLowerCase())
                let autor = item.autor_apunte.toLowerCase().includes(query.qryTituloAutor.toLowerCase())
                let dep = item.nombre_departamento.toLowerCase().includes(query.qryDepartamento.toLowerCase())
                let nivel = item.nombre_nivel.toLowerCase().includes(query.qryNivel.toLowerCase())
                let catedra = item.nombre_catedra.toLowerCase().includes(query.qryCatedra.toLowerCase())
                let tipo = item.nombre_tipo_apunte.toLowerCase().includes(query.qryTipo.toLowerCase())
                return ((titulo || autor) && dep && nivel && catedra && tipo)
            })
        },
        filterNiveles(arr, query){
            let niveles = []
            let nivel = {}
            nivel.nombre = 'Todos'
            nivel.valor = ''
            niveles.push(nivel)
            if (arr !== null){
                let val = arr.filter(function(item){
                    let d = item.nombre_departamento.toLowerCase().includes(query.qryDepartamento.toLowerCase())
                    return (d)
                })
                val[0].niveles.forEach(nivelElement => {
                    nivel = {}
                    nivel.nombre = nivelElement.nombre_nivel
                    nivel.valor = nivelElement.nombre_nivel
                    niveles.push(nivel)
                });
            }
            return niveles
        },
        filterCatedras(arr, query){
            let catedras = []
            let catedra = {}
            catedra.nombre = 'Todos'
            catedra.valor = ''
            catedras.push(catedra)
            if (arr != null){
                let val = arr.filter(function(item){
                    let d = item.nombre_departamento.toLowerCase().includes(query.qryDepartamento.toLowerCase())
                    let n = item.nombre_nivel.toLowerCase().includes(query.qryNivel.toLowerCase())
                    return (d && n)
                })
                val.forEach(catedraElement => {
                    catedra = {}
                    catedra.nombre = catedraElement.nombre_catedra
                    catedra.valor = catedraElement.nombre_catedra
                    catedras.push(catedra)
                });
            }
            return catedras
        }
    },
    created(){
        this.getApuntes()
        this.getDepartamentosYNiveles()
        this.getCatedras()
        this.getTiposDeApuntes()
        this.departamentoSelected =  this.nivelSelected = this.catedraSelected = this.tipoSelected = this.ini
        this.departamentosOptions.push(this.ini)
        this.nivelesOptions.push(this.ini)
        this.catedrasOptions.push(this.ini)
        this.tiposOptions.push(this.ini)
    },
    computed: {
        filteredApuntes(){
            return this.filterApuntes(this.apuntes, this.filterQry)
        },
        filteredNiveles(){
            return this.filterNiveles(this.depyniveles, this.filterQry)
        },
        filteredCatedras(){
            return this.filterCatedras(this.catedras, this.filterQry)
        }
    }
}
</script>