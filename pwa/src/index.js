
import * as _ from "lodash";
import './styles.scss';
import Vue from 'vue'
import App from './app.vue'
import '../node_modules/vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify'

Vue.use(Vuetify, {
    theme: {
        primary: "#E53935", // #E53935
        secondary: "#FFCDD2", // #FFCDD2
        accent: "#3F51B5" // #3F51B5
    }
})
var app = new Vue({
    el: '#app',
    template: '<App/>',
    components: {App},
})

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            registration.pushManager.subscribe({userVisibleOnly: true});
            console.log("SW registered: ", registration);
        }).catch(registrationError => {
            console.log("SW Registration failed! ", registrationError);
        });
    });
}
