<template>
    <base-container>
        <v-row style="display: flex;">
            <div class="daemonContainer fadeInCenter">
                <v-sheet rounded="lg" color="transparent">
                    <v-row>
                        <v-col class="pa-0 leftD" style="flex: 1;">
                            <v-card title="Descargar aplicacion" subtitle="Informacion" variant="flat" align="center"
                                color="trasnparent">
                                <v-list-item prepend-icon="mdi-information"> Para la toma de asistencias es necesario
                                    descargar un programa que se instalará en el ordenador. Una vez instalado, este
                                    iniciará automáticamente todos los días al iniciar la computadora.</v-list-item>
                                <v-list-item prepend-icon="mdi-alert"> <strong>
                                        Es importante tener en cuenta que este programa solo debe instalarse en las
                                        computadoras
                                        que se utilizarán para tomar asistencias en los cursos.
                                    </strong></v-list-item>
                                <v-card-actions>
                                    <v-btn class="ma-2" @click="download" variant="outlined" :disabled="daemonInstalled">
                                        Descargar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                        <v-col class="pa-0 rightD">
                            <v-card title="Estado Aplicacion local"
                                subtitle="Verificacion de la aplicacion en esta computadora" variant="flat"
                                align-self-center align="center" color="transparent">

                                Instalacion:
                                <div v-if="daemonInstalled" style=" margin: 10px; padding: 10px;">
                                    <v-chip size="x-large" color="primary" prepend-icon="mdi-check">
                                        App instalada
                                    </v-chip>
                                </div>
                                <div v-else style=" margin: 10px; padding: 10px;">
                                    <v-chip size="x-large" color="error" prepend-icon="mdi-alert-box">
                                        App no encontrada
                                    </v-chip>
                                </div>
                                Estado:
                                <div v-if="daemonWorking" class="aniWob" style=" margin: 10px; padding: 10px;">
                                    <v-chip size="x-large" color="primary" prepend-icon="mdi-check">
                                        En Funcionamiento!
                                    </v-chip>
                                </div>
                                <div v-else style=" margin: 10px; padding: 10px;">
                                    <v-chip size="x-large" color="error" prepend-icon="mdi-alert-box">
                                        App no esta online
                                    </v-chip>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-sheet>
            </div>
        </v-row>

    </base-container>
</template>
  
<script>
import { useStore } from 'vuex'
import store from 'storejs';
import { checkAuth } from '@/plugins/auth';
import { axiosClient } from '@/plugins/axiosClient';
import BaseContainer from '@/components/BaseContainer.vue';

export default {
    data: () => ({
        daemonInstalled: false,
        daemonWorking: false,
        classrooms: []
    }),
    setup() {
        const store = useStore()
        store.commit('setTitle', { title: 'Aplicacion', icon: 'mdi-download-box' })
    },
    beforeCreate() {
        checkAuth([2, 3])
    },
    methods: {
        async checkDaemonStatus() {
            const accessToken = store.get('accessToken');
            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 2000,
                    url: "/classroom/daemon",
                    params: {
                        'accessToken': accessToken,
                        'clientIp': window.location.hostname
                    }
                })
                if (result) {
                    this.daemonInstalled = result.data.daemonInstalled;
                    this.daemonWorking = result.data.daemonWorking;
                }
            } catch (error) {
                console.log(error)
            }
        }, download() {
            const fileUrl = '/AIModuleSetup.exe'; // Replace with the correct path to your file
            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('download', 'AIModuleSetup.exe');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },
    mounted() {
        this.checkDaemonStatus();
    },
    components: { BaseContainer }

}

</script>
  
<style>
.daemonContainer {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    width: 95%;
    margin-top: 5%;
    height: 30vw;
}

.leftD {

    border-top-left-radius: 2%;
    border-bottom-left-radius: 2%;
    background: rgb(var(--v-theme-surface));
    min-width: 300px;
}

.rightD {

    text-align: center;
    border-top-right-radius: 2%;
    border-bottom-right-radius: 2%;
    background: rgb(var(--v-theme-surface-lighter-2));
}

.aniWob {
    animation: aniWob 4s ease-in 0s infinite alternate forwards;
}

@keyframes aniWob {

    0%,
    100% {
        transform: translateX(0%);
        transform-origin: 50% 50%;
    }

    15% {
        transform: translateX(-30px) rotate(-6deg);
    }

    30% {
        transform: translateX(15px) rotate(6deg);
    }

    45% {
        transform: translateX(-15px) rotate(-3.6deg);
    }

    60% {
        transform: translateX(9px) rotate(2.4deg);
    }

    75% {
        transform: translateX(-6px) rotate(-1.2deg);
    }
}
</style>
  

