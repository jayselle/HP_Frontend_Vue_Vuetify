<template>
  <div class="dashboard">
    <h1 class="subheading grey--text">Dashboard</h1>

    <v-container class="my-5">
      
      <v-row>
        <v-col v-for="(data,index) in dataCard" :key="index" cols="12" sm="6" md="3">
          <DashboardCard v-bind:dataCard="data"/>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" lg="8" class="pt-0">

          <v-row>

            <v-col cols=12>
              <v-card>
                <v-card-title>Ganancias mensuales en el año 2019</v-card-title>
                <v-divider class="mx-4"></v-divider>
                <div v-show="!readyAreaChart">
                  <v-progress-linear indeterminate color="primary"></v-progress-linear>
                </div>
                <div v-show="readyAreaChart">
                  <GChart
                    type="AreaChart"
                    :data="areaChartData"
                    :options="areaChartOptions"
                    :events="chartAreaReady"
                  />
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <SecondaryCard v-bind:secondaryCard="mesConMayorGanancia"/>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <SecondaryCard v-bind:secondaryCard="ingresoPromedioPorMes"/>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <SecondaryCard v-bind:secondaryCard="gananciaAnualTotal"/>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <SecondaryCard v-bind:secondaryCard="apunteMasRequerido"/>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <SecondaryCard v-bind:secondaryCard="catedraMasRequerida"/>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <SecondaryCard v-bind:secondaryCard="departamentoMasRequerido"/>
            </v-col>

          </v-row>
          
        </v-col>

        <v-col cols="12" lg="4">
          <v-card>
            <v-card-title>Cantidad de apuntes por estado</v-card-title>
            <v-divider class="mx-4"></v-divider>
            <div v-show="!readyPieChart">
              <v-progress-linear indeterminate color="primary"></v-progress-linear>
            </div>
            <div v-show="readyPieChart">
              <GChart
                type="PieChart"
                :data="pieChartData"
                :options="pieChartOptions"
                :events="chartPieReady"
              />
            </div>
            <v-divider></v-divider>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr v-for="estado in estadosDatos" :key="estado.nombre">
                    <td width="10"><v-avatar :color="estado.color" size="20"></v-avatar></td>
                    <td class="subtitle-2">{{estado.nombre}}</td>
                    <td>{{estado.cantidad}}</td>
                    <td>{{estado.porcentaje}}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" lg="4">
          <PorcentajeCard v-bind:porcentajeCard="porcentajeAlumnosRegistrados" v-bind:color="'deep-purple lighten-1'"/>
        </v-col>
        <v-col cols="12" lg="4">
          <PorcentajeCard v-bind:porcentajeCard="porcentajePedidosImpresos" v-bind:color="'#14abef'"/>
        </v-col>
        <v-col cols="12" lg="4">
          <PorcentajeCard v-bind:porcentajeCard="porcentajePedidosCobrados" v-bind:color="'#02ba5a'"/>
        </v-col>
      </v-row>

    </v-container>

  </div>
</template>

<script>
import axios from 'axios'
import { GChart } from 'vue-google-charts'
import DashboardCard from "@/components/DashboardCard"
import SecondaryCard from "@/components/SecondaryCard"
import PorcentajeCard from "@/components/PorcentajeCard"
export default {
  data() {
    return {
      dataCard: [],
      mesConMayorGanancia: {},
      ingresoPromedioPorMes: {},
      gananciaAnualTotal: {},
      apunteMasRequerido: {},
      catedraMasRequerida: {},
      departamentoMasRequerido: {},
      estadosDatos: [],
      porcentajeAlumnosRegistrados: {},
      porcentajePedidosImpresos: {},
      porcentajePedidosCobrados: {},
      areaChartData: [['Mes','Ingresos']],
      areaChartOptions: {
        areaOpacity: 0.0,
        legend: 'none',
        lineWidth: 3,
        height: 300,
        hAxis:{
          title: 'Meses',
          titleTextStyle: {
            fontSize: 14,
            italic: false,
            bold: true,
          },
        },
        vAxis:{
          title: 'Ingresos ($)',
          titleTextStyle: {
            fontSize: 14,
            italic: false,
            bold: true,
          },
        },
        chartArea: {
          right: '5%',
          width: '80%',
        }
      },
      pieChartData: [],
      pieChartOptions: {
        pieHole: 0.4,
        height: 300,
        legend: 'none',
        pieSliceText: 'none',
        pieSliceBorderColor : "transparent",
        tooltip: {
          textStyle: {
            fontSize: 14,
            bold: true,
            italic: true,
          },
          text: 'value',
        },
        slices: [],
        chartArea: {
          width: '80%',
          height: '80%',
        }
      },
      chartAreaReady: {
        "ready": () => {
          this.areaChartOptions.lineWidth = 4
          this.readyAreaChart = true
        }
      },
      chartPieReady: {
        "ready": () => {
          this.pieChartOptions.pieHole = 0.5
          this.readyPieChart = true
        }
      },
      readyAreaChart: false,
      readyPieChart: false,
    }
  },
  components:{
    GChart,
    DashboardCard,
    SecondaryCard,
    PorcentajeCard
  },
  methods: {
    cargarPieChart(){
      this.pieChartData.push(['Estado', 'Cant. Apuntes'])
      for (let index = 0; index < this.estadosDatos.length; index++) {
        let estado = this.estadosDatos[index]
        let color = estado.color
        this.pieChartOptions.slices.push({color})
        this.pieChartData.push([estado.nombre,estado.cantidad])
      }
    }
  },
  created() {
    axios({
      method: "GET",
      url: "http://localhost:8080/api/admins/dashboard",
      headers: {"authorization" : "Bearer "+localStorage.getItem('token')}
    })
    .then(response => {
      let cantAlumnosRegistrados = {valor: response.data.data.cantAlumnosRegistrados.valor, icon: 'mdi-account-check', texto: response.data.data.cantAlumnosRegistrados.texto, color: 'deep-purple lighten-1'}
      let gananciaTotal = {valor: response.data.data.gananciaTotal.valor, icon: 'mdi-currency-usd', texto: response.data.data.gananciaTotal.texto, color: 'orange darken-3'}
      let cantPedidosCobrados = {valor: response.data.data.cantPedidosCobrados.valor, icon: 'mdi-check', texto: response.data.data.cantPedidosCobrados.texto, color: 'green darken-3'}
      let cantApuntesRegistrados = {valor: response.data.data.cantApuntesRegistrados.valor, icon: 'mdi-open-in-new', texto: response.data.data.cantApuntesRegistrados.texto, color: 'red darken-1'}
      this.dataCard.push(cantAlumnosRegistrados)
      this.dataCard.push(gananciaTotal)
      this.dataCard.push(cantPedidosCobrados)
      this.dataCard.push(cantApuntesRegistrados)

      response.data.data.gananciasMensualesPorAno.forEach(element => {
        let m = [element.texto,element.valor]
        this.areaChartData.push(m)
      });

      let cantPedidos = 0
      response.data.data.cantEstados.forEach(element => {
        cantPedidos = cantPedidos + element.valor
      });

      let estadoPendiente = {nombre: response.data.data.cantEstados[0].texto, cantidad: response.data.data.cantEstados[0].valor, porcentaje: ((response.data.data.cantEstados[0].valor)/cantPedidos).toFixed(2)*100 + '%', color: '#fba540'}
      let estadoImpreso = {nombre: response.data.data.cantEstados[1].texto, cantidad: response.data.data.cantEstados[1].valor, porcentaje: ((response.data.data.cantEstados[1].valor)/cantPedidos).toFixed(2)*100 + '%', color: '#14abef'}
      let estadoCobrado = {nombre: response.data.data.cantEstados[2].texto, cantidad: response.data.data.cantEstados[2].valor, porcentaje: ((response.data.data.cantEstados[2].valor)/cantPedidos).toFixed(2)*100 + '%', color: '#02ba5a'}
      let estadoCancelado = {nombre: response.data.data.cantEstados[3].texto, cantidad: response.data.data.cantEstados[3].valor, porcentaje: ((response.data.data.cantEstados[3].valor)/cantPedidos).toFixed(2)*100 + '%', color: '#E04423'}
      let estadoVencido = {nombre: response.data.data.cantEstados[4].texto, cantidad: response.data.data.cantEstados[4].valor, porcentaje: ((response.data.data.cantEstados[4].valor)/cantPedidos).toFixed(2)*100 + '%', color: '#787372'}
      this.estadosDatos.push(estadoPendiente)
      this.estadosDatos.push(estadoImpreso)
      this.estadosDatos.push(estadoCobrado)
      this.estadosDatos.push(estadoCancelado)
      this.estadosDatos.push(estadoVencido)
      this.cargarPieChart();

      this.mesConMayorGanancia = response.data.data.mesConMayorGanancia
      this.ingresoPromedioPorMes = response.data.data.ingresoPromedioPorMes
      this.gananciaAnualTotal = response.data.data.gananciaAnualTotal
      this.apunteMasRequerido = response.data.data.apunteMasRequerido
      this.catedraMasRequerida = response.data.data.catedraMasRequerida
      this.departamentoMasRequerido = response.data.data.departamentoMasRequerido

      this.porcentajeAlumnosRegistrados = response.data.data.porcentajeAlumnosRegistrados
      this.porcentajePedidosImpresos = response.data.data.porcentajePedidosImpresos
      this.porcentajePedidosCobrados = response.data.data.porcentajePedidosCobrados

    })
    .catch(error => {
      error
    })
  }
}

</script>

<style scoped>

.columna{
    padding: 0;
    margin: 0;
}

</style>