<template>
    <v-app>
    <v-navigation-drawer
            v-model="drawer"
            fixed
            app
    >
        <v-list dense>
            <v-list-tile @click="">
                <v-list-tile-action>
                    <v-icon>Home</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Test</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="">
                <v-list-tile-action>
                    <v-icon>contact_mail</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Contact</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
    <v-toolbar color="primary" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Application</v-toolbar-title>
    </v-toolbar>
    <v-content>
                <router-view></router-view>
    </v-content>
    <v-footer color="primary" app justify-right>
        <span class="white--text text-xs-right" > <3 </span>
    </v-footer>
    </v-app>
</template>

<script>

export default {
    name: 'App',
    data: () => ({
        drawer: null
    }),
    props: {
        source: String
    },

}
</script>