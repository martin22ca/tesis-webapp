<template>
    <form @submit.prevent="submit" class="updateContainer" style="margin-right: 20px;">
        <v-dialog v-model="dialog" width="auto">
            <v-card title="Informacion" prepend-icon="mdi-information" style="font-size: large; min-width: 50vh;"
                align="start" rounded="true">
                <v-card-text style="padding-left: 50px;">
                  <v-icon icon="mdi-check" color="secondary"></v-icon>  {{ dialogText }} 
                </v-card-text>
                <v-card-item class="pb-2"> <v-btn title="Ok" @click="dialog=false" variant="outlined" color="secondary">OK</v-btn></v-card-item>
            </v-card>
        </v-dialog>
        <v-container class="ma-3 mr-10">
            <v-divider :thickness="7" class="pa-2"></v-divider>
            <div class="text"> Datos del curso </div>
            <v-row>
                <v-col align-self="center" cols="8">
                    <v-text-field class="pa-2" type="number" variant="outlined" v-model="year.value.value"
                        :error-messages="year.errorMessage.value" label="Año" @input="onYearInput"
                        prepend-inner-icon="mdi-card-account-details"></v-text-field>
                </v-col>
                <v-col align-self="center">
                    <v-text-field class="pa-2" variant="outlined" v-model="section.value.value"
                        :error-messages="section.errorMessage.value" label="Seccion"
                        prepend-inner-icon="mdi-card-account-details"></v-text-field>
                </v-col>
            </v-row>
            <div class="text"> Selecionar preceptor <strong> (opcional)</strong> </div>
            <v-row>
                <v-col align-self="center">
                    <v-select class="pa-2" clearable label="Preceptor" variant="outlined" :items="options"
                        v-model="select.value.value" :error-messages="select.errorMessage.value" item-title="text"
                        :maxlength="1" item-value="value" prepend-inner-icon="mdi-alert-circle"></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col align-self="center">
                    <v-btn class="ma-2" type="submit" variant="outlined" color="secondary">
                        Actualizar
                    </v-btn>
                    <v-btn class="ma-2" @click="handleReset" variant="tonal">
                        Limpiar
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </form>
</template>
  
<script>
import store from 'storejs';
import { useStore } from 'vuex'
import { ref } from 'vue'
import * as Yup from "yup";
import { axiosClient } from '@/plugins/axiosClient';
import { useField, useForm } from 'vee-validate'

export default {
    name: 'UpdateClass',
    data: () => ({
        visible: false,
        visibleC: false,
    }),
    setup() {
        const storeX = useStore();
        const validationSchema = Yup.object().shape({
            year: Yup.number("Debe ser un Numero").typeError('Año Debe ser un Numero').required('Selecionar Año').positive("El Año debe ser positivo").integer(),
            section: Yup.string().required('La seccion es requerida').max(1, 'Solo un Caracter'),
            select: Yup.string().required('Select an item')
        });

        const { handleSubmit, handleReset, errors } = useForm({
            validationSchema,
            validateOnMount: false
        });
        const editedObj = storeX.state.editedObj

        const year = useField('year');
        const section = useField('section');
        const select = useField('select');
        const idClass = editedObj.id_cls

        year.value.value = editedObj.school_year
        section.value.value = editedObj.school_section
        select.value.value = editedObj.id_emp

        const dialog = ref(false);
        const dialogText = ref('');
        const options = ref([]);

        const onYearInput = (event) => {
            const input = event.target.value;
            const regex = /[^0-9]/g;
            const isValid = !regex.test(input);

            if (!isValid) {
                event.preventDefault();
                year.value.value = input.replace(regex, '');
            }
        }
        const fetchOptions = async () => {
            try {
                const accessToken = store.get('accessToken');
                const response = await axiosClient({
                    method: 'get',
                    timeout: 2000,
                    url: '/employees',
                    params: {
                        'accessToken': accessToken
                    }
                });
                options.value = response.data.employeesInfo.map(item => ({
                    text: item.first_name + " " + item.last_name,
                    value: item.id_emp,
                }));
            } catch (error) {
                console.log(error);
            }
        };

        fetchOptions();

        const submit = handleSubmit(async (values) => {
            const accessToken = store.get('accessToken');
            const upperSection = values.section.toUpperCase()

            try {
                const result = await axiosClient({
                    method: 'put',
                    timeout: 2000,
                    url: '/classes/update',
                    params: {
                        'accessToken': accessToken,
                        'idClass': idClass,
                        'year': values.year,
                        'section': upperSection,
                        'id_emp': values.select
                    }
                });
                if (result.status == 200) {
                    console.log('success');
                    dialogText.value = result.data.message;
                    dialog.value = true;
                } else {
                    alert(JSON.stringify(result.status));
                }
            } catch (error) {
                console.log(error);
                if (error.response.m)
                    dialogText.value = 'Error message goes here';
                dialog.value = true;
            }
        });

        return {
            year,
            editedObj,
            section,
            idClass,
            select,
            options,
            dialog,
            dialogText,
            onYearInput,
            submit,
            handleReset,
            errors
        };
    },

};

</script>
  
<style>
.gradient {
    height: 100vh;
    background: rgb(0, 0, 0);
    background: linear-gradient(190deg, rgba(0, 0, 0, 1) 80%, rgba(47, 47, 47, 1) 80%, rgb(173, 173, 173) 100%);
}

h1 {
    margin: 10px;
}

.updateContainer {
    background: transparent;
}

.text {
    font-size: medium;
    font-weight: 300;
    padding-left: 10px;
}
</style>
  

