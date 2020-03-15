<template>
  <div class="about">
    <h1 class="subheading grey--text">About</h1>

    <v-container class="my-5">
      
      <v-btn rounded color="teal accent-3" dark>Logout</v-btn>
    
    </v-container>

  </div>
</template>

<script>
export default {
    computed: {
        isLoggedIn: function(){
            return this.$store.getters.isLoggedIn
        }
    },
    methods: {
        logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      }
    }
}
</script>