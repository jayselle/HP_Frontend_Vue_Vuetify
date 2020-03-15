<template>
    
    <v-card max-height="100">
        <v-card-title class="justify-center">{{secondaryCard.valor}}</v-card-title>
        <v-card-subtitle class="text-center">{{secondaryCard.texto}}</v-card-subtitle>
    </v-card>

</template>

<script>
export default {
    props: {
        secondaryCard: {type: Object}
    },
}
</script>