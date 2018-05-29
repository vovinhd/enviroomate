import * as _ from "lodash";
import './styles.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import '../node_modules/vuetify/dist/vuetify.min.css';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import Login from './components/Login.vue'
import LoggedIn from './components/LoggedIn.vue'
import Landing from './components/Landing.vue'
import Register from './components/Register.vue'

Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/home',
            name: 'loggedin',
            component: LoggedIn
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/',
            name: "Index",
            component: Landing
        }
    ]
});

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('vue_state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const ls = loadState();

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('vue_state', serializedState);
    } catch (err) {
        console.error(`Something went wrong: ${err}`);
    }
}


Vue.use(Vuex); // @see https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart
const store = new Vuex.Store({
    state: {
        userId: (ls ? ls.userId : -1),
        token: (ls ? ls.token : -1),
        groupId: (ls ? ls.groupId : -1)
    },
    mutations: {
        setUserId (state, n) {
            state.userId = n
            saveState(state);
        },
        setToken (state, t) {
            state.token = t
            saveState(state);
        },
        setGroupId (state, n) {
            state.groupId = n
            saveState(state);
        }
    },
})


Vue.use(Vuetify, {
    theme: {
        primary: "#f44336",
        secondary: "#e57373",
        accent: "#9c27b0",
        error: "#f44336",
        warning: "#ffeb3b",
        info: "#2196f3",
        success: "#4caf50"
    }
})



const app = new Vue({
    el: '#app',
    template: '<App/>',
    components: {App},
    router,
    store
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
