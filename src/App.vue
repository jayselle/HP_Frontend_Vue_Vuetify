<template>
  
  <v-app class="grey lighten-4">

    <v-content class="mx-4 mb-4">
      <router-view></router-view>
    </v-content>
  
  </v-app>

</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data () {
    return {
    }
  },
  methods:{
    logout(){
      this.$store.dispatch('logout')
      .then(resp => this.$router.push(resp))
    }
  },
  created() {
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    });
  }
};
</script>
