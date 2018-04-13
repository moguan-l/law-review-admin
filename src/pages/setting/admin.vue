<template>
    <div class="panel">
        <div class="panel-header">
            <Button type="primary" icon="plus-round" @click="addAdmin">添加管理员</Button>
        </div>
        <div class="panel-body">
            <Table :columns="columns" :data="data" :loading="loading"/>
            <Page :total="reqPage.total" :current="reqPage.pageNum" show-total size="small" @on-change="requestData"/>
            <Modal v-model="adminModal"
                   width="400"
                   :title="adminModalTitle"
                   :mask-closable="false"
            >
                <Form ref="adminForm" :model="adminForm" :rules="adminRule" :label-width="80">
                    <FormItem label="账户名" prop="addUsername">
                        <Input type="text" v-if="adminForm.type === 1" v-model.trim="adminForm.addUsername"/>
                        <template v-else>{{adminForm.addUsername}}</template>
                    </FormItem>
                    <FormItem label="昵称" prop="nickname">
                        <Input type="text" v-model="adminForm.nickname"/>
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input type="password" v-model="adminForm.password"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" @click="saveAdmin" :loading="saveAdminLoading">保存</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>
<script>
    import auth from '../../assets/js/auth';
    import {queryAdminUser, addAdminUser} from '../../service/setting';

    const username = auth.get().username;

    export default {
        data () {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('账户名不能为空'))
                }
                if (!/^\w+$/.test(value)) {
                    return callback(new Error('账户名只能包含字母、数字及下划线'))
                }
                callback()
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('密码不能为空'))
                }
                callback()
            };
            return {
                columns: this.getColumns(),
                data: [],
                loading: false,
                reqPage: {
                    pageNum: 1,
                    pageSize: 10
                },
                adminModal: false,
                adminModalTitle: '',
                adminForm: {},
                adminRule: {
                    addUsername: [{required: true, validator: validateName, trigger: 'blur'}],
                    nickname: [{required: true, message: '昵称不能为空', trigger: 'blur'}],
                    password: [{required: true, validator: validatePass, trigger: 'blur'}]
                },
                saveAdminLoading: false
            }
        },
        created() {
            this.requestData()
        },
        watch: {
            adminModal(value) {
                !value && this.$refs.adminForm.resetFields()
            }
        },
        methods: {
            getColumns() {
                return [
                    {
                        title: '账户名',
                        key: 'username'
                    },
                    {
                        title: '昵称',
                        key: 'nickname'
                    }
                ]
            },
            requestData(pageNum = 1) {
                this.loading = true;
                queryAdminUser({username, reqPage: {pageNum, pageSize: this.reqPage.pageSize}})
                    .then(res => {
                        this.loading = false;
                        if (res.ret) {
                            let {items, ...reqPage} = res.data;
                            this.data = items;
                            this.reqPage = reqPage
                        } else {
                            this.$Message.error(res.errmsg)
                        }
                    })
                    .catch(err => {
                        this.loading = false;
                        this.$Message.error('请求异常')
                    })
            },
            addAdmin() {
                this.adminModal = true;
                this.adminModalTitle = '添加管理员';
                this.adminForm = {
                    type: 1,
                    addUsername: '',
                    nickname: '',
                    password: ''
                }
            },
            saveAdmin() {
                this.$refs.adminForm.validate((valid) => {
                    if (valid) {
                        this.saveAdminLoading = true;
                        addAdminUser({username, ...this.adminForm})
                            .then(res => {
                                this.saveAdminLoading = false;
                                if (res.ret) {
                                    this.adminModal = false;
                                    this.$Message.success('保存成功');
                                    this.requestData()
                                } else {
                                    this.$Message.error(res.errmsg);
                                }
                            })
                            .catch(err => {
                                this.saveAdminLoading = false;
                                this.$Message.error('请求异常')
                            })
                    }
                })
            }
        }
    }
</script>
