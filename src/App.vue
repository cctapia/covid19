<template>
  <div id="app" :class="`container ${!isLoading ? 'mt-3':''}`">
    <div class="d-flex justify-content-center align-items-center" :style="{height:height+'px'}" v-if="isLoading">
      <moon-loader v-bind:loading="isLoading" v-bind:color="'#68d391'" v-bind:size="100"></moon-loader>
    </div>
    <b-row v-if="!isLoading">
      <b-col>
        <b-card no-body header-tag="header">
          <template #header>
            <h4 class="mb-0">Casos COVID-19 en Perú al {{ maximumDate }}</h4>
          </template>
          <b-card-body>
            <line-chart :data="chartData" :xmin="minimumDate" :xmax="maximumDate" :discrete="true" :download="true"/>
            <hr>

            <b-table small responsive hover :items="items" :per-page="perPage" :current-page="currentPage" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" id="tabCases"></b-table>

            <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="tabCases"></b-pagination>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from '@/api'
import date from '@/date'
export default {
  name: 'App',
  data(){
    return {
      perPage: 5,
      currentPage: 1,
      sortBy: 'Date',
      sortDesc: true,
      fields: [
        { key: 'Date', label: 'Fecha', sortable: true },
        { key: 'Confirmed', label: 'Confirmados' },
        { key: 'Deaths', label: 'Muertes' },
        { key: 'Recovered', label: 'Recuperados' },
        { key: 'Active', label: 'Activos' },
      ],
      items: [
        //{ Date: '16-03-2021', Confirmed: 0, Deaths: 0, Recovered: 0, Active: 0},
      ],
      chartData: [
        //{name: 'Confirmados', data: {'2017-01-01': 1, '2017-02-02': 2,'2017-03-01': 1, '2017-04-02': 7}},
        //{name: 'Muertes', data: {'2017-01-01': 3, '2017-02-02': 4,'2017-03-01': 5, '2017-02-04': 2}},
        //{name: 'Recuperados', data: {'2017-01-01': 5, '2017-02-02': 6,'2017-03-01': 1, '2017-04-02': 2}},
        //{name: 'Activos', data: {'2017-01-01': 7, '2017-02-02': 8,'2017-03-01': 1, '2017-04-02': 2}}
      ],
      isLoading: false
    }
  },
  computed: {
    minimumDate(){
      if(this.items.length > 0){
        return this.items[0].Date
      }
      return ''
    },
    maximumDate(){
      if(this.items.length > 0){
        return this.items[this.items.length-1].Date
      }
      return ''
    },
    height(){
      return window.innerHeight
    },
    rows() {
        return this.items.length
    }
  },
  created(){
    this.isLoading = true
    let chart_data = [{name: 'Confirmados', data: {}},{name: 'Muertes', data: {}},{name: 'Recuperados', data: {}},{name: 'Activos', data: {}}]

    api.getCases().then(cases => {
      cases = cases.map(function(c){
        let d = new Date(c.Date)
        d.setDate(d.getDate()+1)
        d = date.dateFormat(d,'yyyy-mm-dd')

        chart_data[0].data[d] = c.Confirmed
        chart_data[1].data[d] = c.Deaths
        chart_data[2].data[d] = c.Recovered
        chart_data[3].data[d] = c.Active

        return {
          Date: d,
          Confirmed: c.Confirmed,
          Deaths: c.Deaths,
          Recovered: c.Recovered,
          Active: c.Active
        }
      })
      this.items = cases
      this.chartData = chart_data
      this.isLoading = false
    }).catch((error) => {
      this.isLoading = true
      console.log('Ocurrió un error:')
      console.error(error)
    })
  }
}
</script>
