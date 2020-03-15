<template>
  <div class="secureusuario">

    <v-container class="my-5">
      <NavBarUser/>
      <router-view></router-view>
    </v-container>

  </div>
</template>

<script>
import NavBarUser from "@/components/NavBarUser"

export default {
  components: {
    NavBarUser
  },
}

</script>