import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi', // default - only for display purposes
        values: {
            dashboard: 'mdi-view-dashboard',
            menu : 'mdi-menu',
            verticaldots: 'mdi-dots-vertical',
            account: 'mdi-account',
            logout: 'mdi-logout',
            plus: 'mdi-plus',
            arrowdown: 'mdi-arrow-down-drop-circle'
        }
    },
});
