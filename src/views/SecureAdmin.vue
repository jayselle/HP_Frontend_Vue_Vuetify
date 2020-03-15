<template>
  <div class="secureadmin">

    <v-container class="my-5">
      <NavBarAdmin/>
      <router-view></router-view>
    </v-container>

  </div>
</template>

<script>
import NavBarAdmin from "@/components/NavBarAdmin"

export default {
  components: {
    NavBarAdmin
  },
}

</script>