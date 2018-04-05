<template>
    <div class="login-layout">
        <div class="login-layout-header">违法审核管理台</div>
        <div class="login-layout-content">
            <div class="login">
                <div class="login-header">欢迎登录</div>
                <Form class="login-form" ref="loginForm" :model="loginForm" :rules="ruleInline" @keyup.native.enter="handleSubmit">
                    <Form-item prop="username">
                        <Input size="large" placeholder="用户名" v-model.trim="loginForm.username">
                            <Icon type="person" slot="prepend"/>
                        </Input>
                    </Form-item>
                    <Form-item prop="password">
                        <Input size="large"
                               placeholder="密码"
                               v-model="loginForm.password"
                               :type="showPassword ? 'text' : 'password'"
                               :icon="loginForm.password.length > 0 ? showPassword ? 'eye-disabled' : 'eye' : ''"
                               @on-click="handleShowPassword"
                        >
                            <Icon type="locked" slot="prepend"/>
                        </Input>
                    </Form-item>
                    <Button type="primary" size="large" @click.native="handleSubmit" long :loading="loginLoading">登录</Button>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
    import {login} from '../service/login';
    import '../assets/style/login.less';

    export default {
        data() {
            return {
                loginForm: {
                    username: '',
                    password: '',
                },
                ruleInline: {
                    username: [{
                        required: true,
                        message: '请填写用户名',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请填写密码',
                        trigger: 'blur'
                    }]
                },
                showPassword: false,
                loginLoading: false
            }
        },
        methods: {
            handleShowPassword() {
                this.showPassword = !this.showPassword
            },
            handleSubmit() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loginLoading = true;
                        login(this.loginForm)
                            .then(res => {
                                this.loginLoading = false;
                                if (!res.ret) {
                                    return this.$Message.error(res.errmsg)
                                }
                                this.$router.push('/')
                            })
                            .catch(err => this.loginLoading = true)
                    }
                })
            }
        }
    }
</script>