<template>
    
    <nav v-resize="onResize">
        
        <v-app-bar app dark color="teal">
            
            <v-app-bar-nav-icon class="white--text" @click="openDrawer">
                <v-btn icon><v-icon>$menu</v-icon></v-btn>
            </v-app-bar-nav-icon>
            <v-toolbar-title>
                <span class="font-weigth-ligth">CopyNet</span>
            </v-toolbar-title>
            
            <v-spacer></v-spacer>
            
            <v-menu>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>$verticaldots</v-icon>
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

                <v-list-group color="white" prepend-icon="$account" active="true">
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title class="white--text font-weight-bold">{{nombre}}</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item @click="logout">
                        <v-list-item-icon>
                            <v-icon small class="white--text">$logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="white--text body-2">Logout</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>

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
import VueJwtDecode from 'vue-jwt-decode'
export default {
    data() {
        return {
            drawer: null,
            mini: false,
            width: 0,
            nombre: '',
            links: [
                {
                    url: '/userDashboard',
                    icon: '$dashboard',
                    text: 'Dashboard'
                },
                {
                    url: '/nuevoPedido',
                    icon: '$plus',
                    text: 'Nuevo Pedido'
                },
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
        },
        windowClosingHandler(){
            if (localStorage.getItem("carrito") != null){
                localStorage.removeItem("carrito")
            }
        }
    },
    mounted(){
        this.onResize()
    },
    created(){
        window.BeforeUnloadEvent = this.windowClosingHandler()
        let token = localStorage.getItem('token') || ''
        this.nombre = VueJwtDecode.decode(token).nombre
    }
}
</script>

<style>

.v-list-group__header__prepend-icon .v-icon {
    color: white;
}

.v-list-group__header__append-icon .v-icon {
    color: white;
}

</style>