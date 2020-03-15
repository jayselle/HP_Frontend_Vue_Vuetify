<template>
  <div class="secureencargado">

    <v-container class="my-5">
      <NavBarEncargado/>
      <router-view></router-view>
    </v-container>

  </div>
</template>

<script>
import NavBarEncargado from "@/components/NavBarEncargado"

export default {
  components: {
    NavBarEncargado
  },
}

</script>