<template>
    
    <v-card :color="dataCard.color" class="px-5">

        <v-row align="center">
            <v-col class="columna">
                <v-card-text class="text-center title white--text pa-3">
                    {{dataCard.valor}}
                </v-card-text>
            </v-col>
        </v-row>
        
        <v-row>
            <v-col class="columna">
                <v-progress-linear value="100" color="white"></v-progress-linear>
            </v-col>
        </v-row>
        
        <v-row align="center">
            <v-col cols="2" class="columna" align="center">
                <v-icon color="white">{{dataCard.icon}}</v-icon>
            </v-col>
            <v-col cols="8" class="columna">
                <v-card-text class="text-center white--text subtitle-2">
                    {{dataCard.texto}}
                </v-card-text>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>
          
    </v-card>

</template>

<script>
export default {
    props: {
        dataCard: {type: Object}
    },
}
</script>

<style scoped>

.columna{
    padding: 0;
    margin: 0;
}

</style>