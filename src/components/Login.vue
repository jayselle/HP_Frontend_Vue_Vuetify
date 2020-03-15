<template>
  <div class="about">
    <v-container class="my-5">
      
     <v-row align="center" justify="center">
         
         <v-col cols="12" sm="8" md="8">

             <v-card class="elevation-12">

                 <v-window v-model="step">

                     <v-window-item :value="1">

                         <v-row>

                             <v-col cols="12" md="8">
                                 <v-card-text class="mt-12">
                                     <h1 class="text-center display-2 primary--text text--accent-3">Iniciar sesión en CopyNet</h1>
                                     <h4 class="text-center mt-4">Ingresá tu usuario y contraseña</h4>
                                     <v-form>
                                         <v-text-field v-model="username" :rules="campoRules" label="Usuario" name="Usuario" type="text" color="primary accent-3"></v-text-field>
                                         <v-text-field v-model="password" :rules="campoRules" label="Contraseña" name="Contraseña" type="password" color="primary accent-3"></v-text-field>
                                     </v-form>
                                 </v-card-text>
                                 <div class="text-center mt-3">
                                    <v-btn rounded color="primary accent-3" dark @click="login">Iniciar sesión</v-btn>
                                 </div>
                             </v-col>

                            <v-col cols="12" md="4" class="primary accent-3">
                                <v-card-text class="white--text mt-12">
                                    <h1 class="text-center display-1">¿Crear cuenta?</h1>
                                    <h5 class="text-center">¡Ingresa tus datos personales y comenzá encargando tus apuntes!</h5>
                                </v-card-text>
                                <div class="text-center">
                                    <v-btn rounded outlined="" dark @click="step++">Registrarse</v-btn>
                                </div>
                            </v-col>

                         </v-row>

                     </v-window-item>

                     <v-window-item :value="2">

                         <v-row class="fill-height">

                             <v-col cols="12" md="4" class="primary accent-3">
                                 <v-card-text class="white--text mt-12">
                                     <h1 class="text-center display-1">¿Ya tenés cuenta?</h1>
                                     <h5 class="text-center">Para iniciar sesión...</h5>
                                 </v-card-text>
                                 <div class="text-center">
                                     <v-btn rounded outlined dark @click="step--">Iniciar</v-btn>
                                 </div>
                             </v-col>
                             <v-col cols="12" md="8">
                                 <v-card-text class="mt-12">
                                     <h1 class="text-center display-2 primary--text text--accent-3">Crear cuenta</h1>
                                     <h4 class="text-center mt-4">Ingresá tus datos personales</h4>
                                     <v-form ref="form" v-model="validRegister">
                                         <v-layout row>
                                             <v-col cols="12" md="6">
                                                 <v-text-field v-model="legajo" :rules="legajoRules" :counter="5" label="Legajo" color="primary accent-3" required></v-text-field>
                                             </v-col>
                                             <v-col cols="12" md="6">
                                                 <v-text-field v-model="dni" :rules="dniRules" label="DNI" :counter="8" color="primary accent-3" required></v-text-field>
                                             </v-col>
                                             <v-col cols="12">
                                                 <v-text-field v-model="newUsername" :rules="newUsernameRules" label="Usuario" color="primary accent-3" required></v-text-field>
                                             </v-col>
                                             <v-col cols="12">
                                                 <v-text-field v-model="newPassword" :rules="newPasswordRules" label="Contraseña" color="primary accent-3" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" :type="showPassword ? 'text' : 'password'" required></v-text-field>
                                             </v-col>
                                             <v-col cols="12">
                                                 <v-text-field v-model="email" :rules="emailRules" label="Email" color="primary accent-3" required></v-text-field>
                                             </v-col>
                                             <v-col cols="12">
                                                 <v-text-field v-model="celular" :rules="celularRules" label="Celular (Opcional)" color="primary accent-3" required></v-text-field>
                                             </v-col>
                                         </v-layout>
                                     </v-form>
                                 </v-card-text>
                                 <div class="text-center" mt-5>
                                     <v-btn :disabled="!validRegister" rounded color="primary accent-3" :dark="validRegister" @click="register">Registrar</v-btn>
                                 </div>
                             </v-col>

                         </v-row>

                     </v-window-item>

                 </v-window>

             </v-card>
            
         </v-col>

     </v-row>

    </v-container>

  </div>
</template>

<script>
import Swal from 'sweetalert2'
export default {
    data () {
        return {
            validRegister: true,
            showPassword: false,
            username: '',
            password: '',
            step: 1,
            campoRules:[
                v => !!v || 'Completar',
            ],
            legajo: '',
            legajoRules: [
                v => !!v || 'Completar Legajo',
                v => v > 0 || 'Solo numeros',
                v => !/\s/.test(v) || 'Sin espacios en blanco',
                v => v.length >= 5 || 'Mínimo 5 numeros',
            ],
            dni: '',
            dniRules: [
                v => !!v || 'Completar DNI',
                v => v > 0 || 'Solo numeros',
                v => !/\s/.test(v) || 'Sin espacios en blanco',
                v => v.length == 8 || '8 numeros',
            ],
            newUsername: '',
            newUsernameRules: [
                v => !!v || 'Completar usuario',
                v => !/\s/.test(v) || 'Sin espacios en blanco',
                v => !/[&=><+,.\s]/.test(v) || 'Caracteres invalidos & = < > + , .',
                v => (v.length >= 3 && v.length <=20 ) || 'Entre 3 y 20 caracteres',
            ],
            newPassword: '',
            newPasswordRules: [
                v => !!v || 'Completar contraseña',
                v => !/\s/.test(v) || 'Sin espacios en blanco',
                v => (v.length >= 3 && v.length <=20 ) || 'Entre 3 y 20 caracteres',
            ],
            email: '',
            emailRules: [
                v => !!v || 'Completar Email',
                v => !/\s/.test(v) || 'Sin espacios en blanco',
                v => /.+@.+/.test(v) || 'Email must be valid',
            ],
            celular: '',
            celularRules: [
                v => /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$|^$/.test(v) || 'Formato de celular invalido',
            ],
        }
    },
    methods: {
        login() {
            let user_usuario = this.username;
            let password_usuario = this.password;
            this.$store.dispatch('login',{user_usuario,password_usuario})
            .then(resp => this.$router.push(resp))
            .catch(error => {
                switch(error.response.status){
                    case 404:
                    case 401: {
                        Swal.fire({
                            title: '¡Acceso denegado!',
                            text: error.response.data.mensaje,
                            icon: 'error',
                            confirmButtonText: 'Volver'
                        })
                        break;
                    }
                    default:
                        Swal.fire({
                            title: '¡Fail!',
                            text: 'Intentar de nuevo',
                            icon: 'error',
                            confirmButtonText: 'Volver'
                        })
                        break;
                }
            })
        },
        register() {

            if (this.$refs.form.validate()){
                let nuevoUsuario = {}
                nuevoUsuario.legajo = this.legajo
                nuevoUsuario.dni_usuario = this.dni
                nuevoUsuario.user_usuario = this.newUsername
                nuevoUsuario.password_usuario = this.newPassword
                nuevoUsuario.email_usuario = this.email
                nuevoUsuario.celular_usuario = this.celular
                this.$store.dispatch('register', nuevoUsuario)
                .then(resp => this.$router.push(resp))
                .catch(err => {
                    switch(err.response.status){
                        case 422: {
                            let mensajesError = err.response.data.data
                            let mensajeError = ''
                            mensajesError.forEach(element => {
                                mensajeError = mensajeError.concat('<li>'+element+'</li>')
                            });
                            let listaErrores = '<ul style="list-style-type:none">'+mensajeError+'</ul>'
                            Swal.fire({
                                title: '¡Fail!',
                                text: err.response.data.mensaje,
                                html: listaErrores,
                                icon: 'error',
                                confirmButtonText: 'Volver'
                            })
                        break;
                        }
                        case 404:
                        case 400: {
                            Swal.fire({
                                title: '¡Fail!',
                                text: err.response.data.mensaje,
                                icon: 'error',
                                confirmButtonText: 'Volver'
                            })
                        break;
                        }
                        default:
                            Swal.fire({
                                title: '¡Fail!',
                                text: 'Intentar de nuevo',
                                icon: 'error',
                                confirmButtonText: 'Volver'
                            })
                        break;
                    }
                })
            }

        },
    },
}
</script>