<template>
    
    <v-card flat>
        <v-row align="center">
            <v-col cols="3" align="center">
                <v-progress-circular :value="porcentajeCard.valor" size=80 width=10 :color="color">{{porcentajeCard.valor}}%</v-progress-circular>
            </v-col>
            <v-col>
                <v-card-title>{{porcentajeCard.texto}}</v-card-title>
            </v-col>
        </v-row>
    </v-card>

</template>

<script>
export default {
    props: {
        porcentajeCard: {type: Object},
        color: {type: String}
    },
}
</script>