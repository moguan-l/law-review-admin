<template>
    <div class="panel">
        <div class="panel-header">
            <Button type="primary" icon="plus-round" @click="addDuty">发布任务</Button>
        </div>
        <div class="panel-body">
            <Table :columns="columns" :data="data" :loading="loading"/>
            <Page :total="page.total" :current="page.pageNum" show-total size="small" @on-change="requestData"/>
            <Modal v-model="dutyModal"
                   width="400"
                   :title="dutyModalTitle"
                   :mask-closable="false"
            >
                <Form ref="dutyForm" :model="dutyForm" :rules="dutyRule" :label-width="80">
                    <FormItem label="任务名称" prop="title">
                        <Input type="text" v-model.trim="dutyForm.title"/>
                    </FormItem>
                    <FormItem label="任务内容" prop="content">
                        <Input type="text" v-model="dutyForm.content"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" @click="saveDuty" :loading="saveDutyLoading">保存</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import auth from '../../assets/js/auth';
    import {queryNotify, saveOrUpdateNotice} from '../../service/duty';

    const uid = auth.get().userId;

    export default {
        data () {
            return {
                columns: this.getColumns(),
                data: [],
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                loading: false,
                dutyModal: false,
                dutyModalTitle: '',
                dutyForm: {},
                dutyRule: {
                    title: [{required: true, message: '任务名称不能为空', trigger: 'blur'}],
                    content: [{required: true, message: '任务内容不能为空', trigger: 'blur'}]
                },
                saveDutyLoading: false
            }
        },
        created() {
            this.requestData()
        },
        watch: {
            dutyModal(value) {
                !value && this.$refs.dutyForm.resetFields()
            }
        },
        methods: {
            getColumns() {
                return [
                    {
                        title: '任务名称',
                        key: 'title'
                    },
                    {
                        title: '任务内容',
                        key: 'content'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        render: (h, param) => {
                            return h('span', new Date(param.row.createTime).format('yyyy-MM-dd hh:mm:ss'))
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.editDuty(params.row)
                                    }
                                }
                            }, '编辑')
                        }
                    }
                ]
            },
            requestData(pageNum = 1) {
                this.loading = true;
                queryNotify({reqPage: {pageNum, pageSize: this.page.pageSize}})
                    .then(res => {
                        this.loading = false;
                        if (res.ret) {
                            this.data = res.data
                        } else {
                            this.$Message.error(res.errmsg)
                        }
                    })
                    .catch(err => {
                        this.loading = false;
                        this.$Message.error('请求异常')
                    })
            },
            addDuty() {
                this.dutyModal = true;
                this.dutyModalTitle = '发布任务';
                this.dutyForm = {
                    uid,
                    title: '',
                    content: ''
                }
            },
            editDuty(duty) {
                this.dutyModal = true;
                this.dutyModalTitle = '编辑任务';
                let {id, title, content} = duty;
                this.dutyForm = {
                    uid, id,
                    title, content
                }
            },
            saveDuty() {
                this.$refs.dutyForm.validate((valid) => {
                    if (valid) {
                        this.saveDutyLoading = true;
                        saveOrUpdateNotice(this.dutyForm)
                            .then(res => {
                                this.saveDutyLoading = false;
                                if (res.ret) {
                                    this.dutyModal = false;
                                    this.$Message.success('保存成功');
                                    this.requestData(this.page.pageNum)
                                } else {
                                    this.$Message.error(res.errmsg);
                                }
                            })
                            .catch(err => {
                                this.saveDutyLoading = false;
                                this.$Message.error('请求异常')
                            })
                    }
                })
            }
        }
    }
</script>