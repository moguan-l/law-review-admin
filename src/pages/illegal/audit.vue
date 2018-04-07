<template>
    <div class="panel">
        <div class="panel-header">
            <Row :gutter="16">
                <Col span="4">
                    <Select v-model="query.cityCode">
                        <Option :value="0">城市</Option>
                        <Option v-for="item in cityList" :value="item.cityCode" :key="item.cityCode">{{item.cityName}}</Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Select v-model="query.firstAuditStatus">
                        <Option :value="0">初审结果</Option>
                        <Option :value="1">审核通过</Option>
                        <Option :value="2">审核不通过</Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Select v-model="query.secondAuditStatus">
                        <Option :value="0">复审结果</Option>
                        <Option :value="1">审核通过</Option>
                        <Option :value="2">审核不通过</Option>
                    </Select>
                </Col>
                <Col span="12">
                    <Button type="primary" @click="requestData">搜索</Button>
                </Col>
            </Row>
        </div>
        <div class="panel-body">
            <Table :columns="columns" :data="data" :loading="loading"/>
            <Page :total="page.total" :current="page.pageNum" show-total size="small" @on-change="requestData"/>
            <Modal v-model="auditModal"
                   width="400"
                   title="审核"
                   :mask-closable="false"
            >
                <Form ref="auditForm" :model="auditForm" :label-width="80">
                    <FormItem label="审核层级" prop="auditLevel">
                        <Select v-model="auditForm.auditLevel">
                            <Option :value="1">初审</Option>
                            <Option :value="2">复审</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="审核结果" prop="result">
                        <Select v-model="auditForm.result">
                            <Option :value="1">审核通过</Option>
                            <Option :value="2">审核不通过</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="审核备注" prop="auditRemark">
                        <Input type="text" v-model="auditForm.auditRemark"/>
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
    import {queryAuditList, executeAudit} from '../../service/illegal';
    import {getCityList} from '../../service/city';

    const uid = auth.get().userId;

    export default {
        data() {
            return {
                cityList: [],
                query: {
                    cityCode: 0,
                    firstAuditStatus: 0,
                    secondAuditStatus: 0
                },
                columns: this.getColumns(),
                loading: false,
                data: [],
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                auditModal: false,
                auditForm: {},
                saveAuditLoading: false
            }
        },
        created() {
            this.getCityList();
            this.requestData()
        },
        methods: {
            getColumns() {
                return [
                    {
                        title: '违规主体',
                        key: 'ownership'
                    },
                    {
                        title: '所在位置',
                        key: 'address'
                    },
                    {
                        title: '违规说明',
                        key: 'content'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return h('div',
                                [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.audit(params.row)
                                            }
                                        }
                                    }, '审核')
                                ])
                        }
                    }
                ]
            },
            requestData(pageNum = 1) {
                this.loading = true;
                queryAuditList({...this.query, pageNum, pageSize: this.page.pageSize})
                    .then(res => {
                        this.loading = false;
                        if (res.ret) {
                            let {items, ...page} = res.data;
                            this.data = items || [];
                            this.page = page
                        } else {
                            this.$Message.error(res.errmsg)
                        }
                    })
                    .catch(err => {
                        this.loading = false;
                        this.$Message.error('请求异常')
                    })
            },
            getCityList() {
                getCityList({pageNum: 1, pageSize: 9999})
                    .then(res => {
                        if (res.ret) {
                            this.cityList = res.data
                        }
                    })
            },
            audit(audit) {
                this.auditModal = true;
                let {id} = audit;
                this.auditForm = {
                    id, uid,
                    auditLevel: 0,
                    result: 0,
                    auditRemark: ''
                }
            },
            saveAudit() {
                this.$refs.auditForm.validate((valid) => {
                    if (valid) {
                        this.saveAuditLoading = true;
                        executeAudit(this.auditForm, res => {
                            this.saveAuditLoading = false;
                            if (res.ret) {
                                this.auditModal = false;
                                this.$Message.success('提交成功');
                                this.requestData(this.page.pageNum)
                            } else {
                                this.$Message.error(res.errmsg);
                            }
                        })
                    }
                })
            }
        }
    }
</script>