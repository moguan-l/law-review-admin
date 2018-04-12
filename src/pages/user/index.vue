<style scoped>
    .ident-pic {
        margin-right: 15px;
        max-height: 250px;
        vertical-align: middle;
    }
</style>
<template>
    <div class="panel">
        <div class="panel-body">
            <Table :columns="columns" :data="data" :loading="loading"/>
            <Page :total="reqPage.total" :current="reqPage.pageNum" show-total size="small" @on-change="requestData"/>
            <Modal v-model="auditModal"
                   width="768"
                   title="审核用户"
                   :mask-closable="false"
            >
                <Form :model="auditForm" :label-width="80">
                    <FormItem label="真实姓名">{{auditForm.name}}</FormItem>
                    <FormItem label="身份证号">{{auditForm.identNo}}</FormItem>
                    <FormItem label="身份证照">
                        <img class="ident-pic" :src="auditForm.identSideA"/>
                        <img class="ident-pic" :src="auditForm.identSideB"/>
                    </FormItem>
                    <FormItem label="审核结果" prop="identStatus">
                        <Select v-model="auditForm.identStatus" placeholde="请选择审核结果">
                            <Option :value="30">审核通过</Option>
                            <Option :value="40">审核不通过</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="审核备注" prop="auditingRemark">
                        <Input type="textarea" :row="4" v-model="auditForm.auditingRemark"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" @click="saveAudit" :loading="saveAuditLoading">提交</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>
<script>
    import auth from '../../assets/js/auth';
    import {queryUser, auditingUser} from '../../service/user';

    const username = auth.get().username;

    export default {
        data () {
            return {
                columns: this.getColumns(),
                data: [],
                loading: false,
                reqPage: {
                    pageNum: 1,
                    pageSize: 10
                },
                auditModal: false,
                auditForm: {},
                saveAuditLoading: false
            }
        },
        created() {
            this.requestData()
        },
        methods: {
            getColumns() {
                return [
                    {
                        title: '用户昵称',
                        width: 100,
                        key: 'nickname'
                    },
                    {
                        title: '手机号',
                        width: 110,
                        key: 'mobile'
                    },
                    {
                        title: '所在城市',
                        width: 90,
                        key: 'cityName'
                    },
                    {
                        title: '真实姓名',
                        key: 'name'
                    },
                    {
                        title: '身份证号',
                        key: 'identNo'
                    },
                    {
                        title: '身份证照片',
                        width: 170,
                        render: (h, params) => {
                            let {identSideA, identSideB} = params.row;
                            return h('div', [
                                h('img', {
                                    domProps: {
                                        src: identSideA
                                    }
                                }),
                                h('img', {
                                    domProps: {
                                        src: identSideB
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '审核状态',
                        width: 100,
                        key: 'identStatus',
                        render: (h, params) => {
                            let identStatusList = {
                                10: '待审核',
                                20: '审核中',
                                30: '审核通过',
                                40: '审核不通过'
                            };
                            return h('span', identStatusList[params.row.identStatus])
                        }
                    },
                    {
                        title: '操作',
                        width: 80,
                        key: 'action',
                        render: (h, params) => {
                            let {identStatus} = params.row;
                            return h('Button', {
                                props: {
                                    type: 'ghost',
                                    size: 'small',
                                    disabled: identStatus == 30 || identStatus == 40
                                },
                                on: {
                                    click: () => {
                                        this.audit(params.row)
                                    }
                                }
                            }, '审核')
                        }
                    }
                ]
            },
            requestData(pageNum = 1) {
                this.loading = true;
                queryUser({username, reqPage: {pageNum, pageSize: this.reqPage.pageSize}})
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
            audit(user) {
                this.auditModal = true;
                let {identStatus, ...other} = user;
                this.auditForm = {
                    identStatus: 30,
                    auditingRemark: '',
                    ...other
                }
            },
            saveAudit() {
                this.saveAuditLoading = true;
                let {identStatus, auditingRemark, mobile: auditingMobile} = this.auditForm;
                auditingUser({username, identStatus, auditingRemark, auditingMobile})
                    .then(res => {
                        this.saveAuditLoading = false;
                        if (res.ret) {
                            this.auditModal = false;
                            this.$Message.success('提交成功');
                            this.requestData(this.reqPage.pageNum)
                        } else {
                            this.$Message.error(res.errmsg);
                        }
                    })
                    .catch(err => {
                        this.saveAuditLoading = false;
                        this.$Message.error('请求异常')
                    })
            }
        }
    }
</script>
