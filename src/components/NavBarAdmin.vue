<template>
    
    <nav v-resize="onResize">
        
        <v-app-bar app dark color="teal">
            
            <v-app-bar-nav-icon class="white--text" @click="openDrawer"></v-app-bar-nav-icon>
            <v-toolbar-title>
                <span class="font-weigth-ligth">CopyNet</span>
            </v-toolbar-title>
            
            <v-spacer></v-spacer>
            
            <v-menu>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                <v-list-item @click="logout">
                    <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

        </v-app-bar>

        <v-navigation-drawer app v-model="drawer" :mini-variant="mini" class="primary">
            
            <v-list>

                <v-list-item v-for="link in links" :key="link.text" :to="link.url">

                    <v-list-item-icon>
                        <v-icon class="white--text">{{link.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">{{link.text}}</v-list-item-title>
                    </v-list-item-content>
                    
                </v-list-item>
            
            </v-list>

        </v-navigation-drawer>
    
    </nav>

</template>

<script>
export default {
    data() {
        return {
            drawer: null,
            mini: false,
            width: 0,
            links: [
                {
                    url: '/adminDashboard',
                    icon: 'mdi-view-dashboard',
                    text: 'Dashboard'
                },
                {
                    url: '/nuevaCatedra',
                    icon: 'mdi-plus',
                    text: 'Nueva catedra'
                },
                {
                    url: '/actualizarPrecio',
                    icon: 'mdi-cash-multiple',
                    text: 'Registrar precio'
                }
            ]
        }
    },
    methods: {
        logout(){
            this.$store.dispatch('logout')
            .then(resp => this.$router.push(resp))
        },
        openDrawer(){
            this.drawer = !this.drawer
        },
        onResize(){
            this.width = window.innerWidth
            if (window.innerWidth <= 960){
                this.mini = true
            } else {
                this.mini = false
            }
        }
    },
    mounted(){
        this.onResize()
    }
}
</script>