<template>
    <div class="panel">
        <div class="panel-header">
            <Row :gutter="16">
                <Col span="6">
                    <Input v-model="queryCondition" placeholder="按用户名查询"/>
                </Col>
                <Col span="18">
                    <Button icon="ios-search" type="primary" @click="requestData">查询</Button>
                </Col>
            </Row>
        </div>
        <div class="panel-body">
            <Table :columns="columns" :data="data"/>
            <Page :total="page.total" :current="page.page" show-total size="small" @on-change="requestData"/>
            <Modal v-model="userModal"
                   width="400"
                   title="编辑用户"
                   :mask-closable="false"
            >
                <Form ref="userForm" :model="userForm" :rules="userRule" :label-width="80">
                    <FormItem label="用户名" prop="username">
                        <Input type="text" v-model.trim="userForm.username"/>
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input type="password" v-model="userForm.password"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" @click="saveUser" :loading="saveUserLoading">保存</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'))
                }
                if (!/^\w+$/.test(value)) {
                    return callback(new Error('用户名只能包含字母、数字及下划线'))
                }
                callback()
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('请输入密码'))
                }
                callback()
            };
            return {
                queryCondition: '',
                columns: this.getColumns(),
                data: [],
                page: {
                    page: 1,
                    pageSize: 10
                },
                userModal: false,
                userForm: {},
                userRule: {
                    userName: [{validator: validateName, trigger: 'blur'}],
                    password: [{validator: validatePass, trigger: 'blur'}]
                },
                saveUserLoading: false
            }
        },
        created() {
            this.requestData()
        },
        methods: {
            getColumns() {
                return [
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return h('div',
                                [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.editUser(params.row)
                                            }
                                        }
                                    }, '编辑'),
                                    h('Poptip', {
                                        props: {
                                            confirm: true,
                                            title: '确认删除该用户？',
                                            width: 150
                                        },
                                        on: {
                                            'on-ok': () => {
                                                this.deleteUser(params.row.userId)
                                            }
                                        }
                                    }, [
                                        h('Button', {
                                            props: {
                                                type: 'ghost',
                                                size: 'small'
                                            }
                                        }, '删除')
                                    ])
                                ])
                        }
                    }
                ]
            },
            requestData(page) {
                let params = {
                    page: page || 1,
                    pageSize: this.page.pageSize,
                    queryCondition: this.queryCondition
                };
            },
            editUser(user) {
                this.userModal = true;
                let {userId, username} = user;
                this.userForm = {
                    userId,
                    username
                }
            },
            saveUser() {
                this.$refs.userForm.validate((valid) => {
                    if (valid) {
                        this.saveUserLoading = true
                    }
                })
            },
            deleteUser(userId) {

            }
        }
    }
</script>
