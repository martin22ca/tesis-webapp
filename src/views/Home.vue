<template>
    <BaseContainer>
        <div class="dashContainer">
            <div class="left-panel">
                <h3><v-icon icon="mdi-information" class="pa-8" />
                    Mensajes</h3>
                <div v-if="messages.length === 0">
                    <h3>No hay mensajes.</h3>
                </div>
                <div v-else class="scroll">
                    <v-card v-for="message in messages" :key="message.id" :title="message.title"
                        subtitle="Mensaje de aistencia" :text="message.info"
                        :prepend-icon="message.viewd ? 'mdi-email-open' : 'mdi-email'" :color='surface - lighter - 1'
                        class="ma-2" variant="tonal"
                        :style="{ 'border-left': 'solid 2px ' + (message.viewd ? 'rgb(var(--v-theme-secondary)' : 'rgb(var(--v-theme-primary)') }">
                        <div class="msgText">{{ message.message }} </div>
                        <div>{{ message.info }}</div>
                        <v-card-actions style="display: block;">
                            <v-btn :color="primary" variant="tonal" @click="markAsRead(message.id)"
                                v-if="!message.viewd" class="ma-2 ">marcar como
                                leido</v-btn>
                            <div style="float: right;">
                                <v-btn icon="mdi-trash-can" variant="elevated" color="error" class="pa-2 mb-2" rounded="lg"
                                    @click="markAsRead(message.id)"></v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </div>
            </div>
            <div class="right-panel">
                <h3><v-icon icon="mdi-table-network" class="pa-8" />Clases</h3>
                <div class="classesContainer">
                    <div v-if="classes.length === 0">
                        <h3>No hay classes asignadas.</h3>
                    </div>
                    <div v-else class="scroll">
                        <v-row>
                            <v-col v-for="schoolClass in classes" :key="schoolClass.id" cols="12" sm="6" md="4" lg="3">
                                <v-card :title="'Curso ' + schoolClass.school_year + '-' + schoolClass.school_section"
                                    class="ma-2" subtitle="Curso Secundario" :text="schoolClass.school_section"
                                    color="surface-lighter-2" rounded="true">
                                    <v-card-actions>
                                        <v-btn variant="outlined"
                                            @click="viewClass(schoolClass.id, schoolClass.school_year, schoolClass.school_section)">Ver
                                            curso</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </div>
        </div>
    </BaseContainer>
</template>

<script>
import store from 'storejs';
import axios from 'axios'
import BaseContainer from '@/components/BaseContainer.vue';
import { useStore } from 'vuex'
import { checkAuth } from '@/plugins/auth';
import { useRouter } from 'vue-router';


export default {
    name: 'Home',
    data() {
        return {
            messages: [],
            classes: [],
            storage: useStore(),
            router: useRouter()
        }
    },
    beforeCreate() {
        checkAuth()
    },
    mounted() {
        this.fetchMessages();
        this.fetchClasses();
    },
    setup() {
        const store = useStore()
        store.commit('setPageTitle', { title: 'Home', subtitle: 'New ' })
    },
    methods: {
        async fetchMessages() {
            const accessToken = store.get('accessToken');
            const id = store.get('userId')

            try {
                let result = await axios({
                    method: 'get',
                    timeout: 2000,
                    url: "http://192.168.0.62:3001/messages",
                    params: {
                        'accessToken': accessToken,
                        'userId': id
                    }
                })
                if (result.status == 200)
                    this.messages = result.data.messages;
            } catch (error) {
                console.log(error)
            }
        },
        async markAsRead(id) {
            const accessToken = store.get('accessToken');

            try {
                let result = await axios({
                    method: 'put',
                    timeout: 2000,
                    url: 'http://192.168.0.62:3001/messages/viewd',
                    params: {
                        'accessToken': accessToken,
                        'idMessage': id
                    }
                })
                if (result.status == 200) {
                    const messageIndex = this.messages.findIndex(message => message.id === id);
                    if (messageIndex !== -1) {
                        this.messages[messageIndex].viewd = true;
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },
        async fetchClasses() {
            const accessToken = store.get('accessToken');
            const id = store.get('userId')

            try {
                let result = await axios({
                    method: 'get',
                    timeout: 2000,
                    url: "http://192.168.0.62:3001/classes",
                    params: {
                        'accessToken': accessToken,
                        'userId': id
                    }
                })
                if (result.status == 200)
                    this.classes = result.data.schoolClasses;
            } catch (error) {
                console.log(error)
            }
        }, async viewClass(id, year, section) {
            this.storage.commit('setClass', { classId: id, year: year, section: section })
            this.$router.push({
                name: 'Classes',
            })

        },
    },
    components: { BaseContainer }
}

</script>

<style scoped> .cardTitle {
     padding: 10px;
 }

 .dashContainer {
     display: flex;
     flex-direction: row;
 }

 .left-panel {
     flex: 1;
     border-radius: 1%;
     margin: 7px;
     margin-left: 10px;
     background-color: rgb(var(--v-theme-surface-lighter-1));
     min-height: 300px;
     max-height: 750px;
     overflow-y: scroll;

 }

 .right-panel {
     margin: 7px;
     margin-right: 10px;
     border-radius: 1%;
     flex: 2;
     background-color: rgb(var(--v-theme-surface-lighter-1));
 }

 .msgText {
     font-size: 16px;
     line-height: 1.5;
     padding-left: 20px;
 }
</style>