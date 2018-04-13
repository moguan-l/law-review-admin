<template>
    <div class="panel">
        <div class="panel-header">
            <Button type="primary" icon="plus-round" @click="addChannel">添加积分渠道</Button>
        </div>
        <div class="panel-body">
            <Table :columns="columns" :data="data" :loading="loading"/>
            <Modal v-model="channelModal"
                   width="400"
                   :title="channelModalTitle"
                   :mask-closable="false"
            >
                <Form ref="channelForm" :model="channelForm" :rules="channelRule" :label-width="80">
                    <FormItem label="渠道KEY" prop="channelKey">
                        <Input type="text" v-if="channelForm.type === 1" v-model.trim="channelForm.channelKey"/>
                        <template v-else>{{channelForm.channelKey}}</template>
                    </FormItem>
                    <FormItem label="渠道名称" prop="channelName">
                        <Input type="text" v-model="channelForm.channelName"/>
                    </FormItem>
                    <FormItem label="积分数量" prop="amount">
                        <Input type="text" v-model="channelForm.amount"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" @click="saveChannel" :loading="saveChannelLoading">保存</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import {queryPointChannelInfo, savePointChannelInfo} from '../../service/credit';

    export default {
        data () {
            const validateAmount = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('积分数量不能为空'))
                }
                if (isNaN(value)) {
                    return callback(new Error('积分数量只能为数字'))
                }
                callback()
            };
            return {
                columns: this.getColumns(),
                data: [],
                loading: false,
                channelModal: false,
                channelModalTitle: '',
                channelForm: {},
                channelRule: {
                    channelKey: [{required: true, message: '渠道KEY不能为空', trigger: 'blur'}],
                    channelName: [{required: true, message: '渠道名称不能为空', trigger: 'blur'}],
                    amount: [{required: true, validator: validateAmount, trigger: 'blur'}]
                },
                saveChannelLoading: false
            }
        },
        created() {
            this.requestData()
        },
        watch: {
            channelModal(value) {
                !value && this.$refs.channelForm.resetFields()
            }
        },
        methods: {
            getColumns() {
                return [
                    {
                        title: '渠道KEY',
                        key: 'channelKey'
                    },
                    {
                        title: '渠道名称',
                        key: 'channelName'
                    },
                    {
                        title: '积分数量',
                        key: 'amount'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'ghost',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.editChannel(params.row)
                                    }
                                }
                            }, '编辑')
                        }
                    }
                ]
            },
            requestData() {
                this.loading = true;
                queryPointChannelInfo()
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
            addChannel() {
                this.channelModal = true;
                this.channelModalTitle = '添加积分渠道';
                this.channelForm = {
                    type: 1,
                    channelKey: '',
                    channelName: '',
                    amount: ''
                }
            },
            editChannel(channel) {
                this.channelModal = true;
                this.channelModalTitle = '编辑积分渠道';
                let {channelKey, channelName, amount} = channel;
                this.channelForm = {
                    type: 2,
                    channelKey, channelName, amount
                }
            },
            saveChannel() {
                this.$refs.channelForm.validate((valid) => {
                    if (valid) {
                        this.saveChannelLoading = true;
                        savePointChannelInfo(this.channelForm)
                            .then(res => {
                                this.saveChannelLoading = false;
                                if (res.ret) {
                                    this.channelModal = false;
                                    this.$Message.success('保存成功');
                                    this.requestData()
                                } else {
                                    this.$Message.error(res.errmsg);
                                }
                            })
                            .catch(err => {
                                this.saveChannelLoading = false;
                                this.$Message.error('请求异常')
                            })
                    }
                })
            }
        }
    }
</script>