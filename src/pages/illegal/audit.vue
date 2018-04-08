<style scope type="text/less" lang="less">
    .illegal-img-overview {
        width: 60px;
        height: 45px;
        vertical-align: middle;
        cursor: pointer;
    }
    .illegal-img-container {
        height: 450px;
        text-align: center;
        img {
            height: 100%;
        }
    }
</style>
<template>
    <div class="panel">
        <div class="panel-header">
            <Row :gutter="16">
                <Col span="4">
                    <Select v-model="query.cityCode" placeholder="全部城市">
                        <Option :value="''">全部城市</Option>
                        <Option v-for="item in cityList" :value="item.cityCode" :key="item.cityCode">{{item.name}}</Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Select v-model="query.auditLevel">
                        <Option value="firstAuditStatus">初审</Option>
                        <Option value="secondAuditStatus">复审</Option>
                        <Option value="lastAuditStatus">终审</Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Select v-model="query.result">
                        <Option :value="0">待审核</Option>
                        <Option :value="1">审核通过</Option>
                        <Option :value="2">审核不通过</Option>
                    </Select>
                </Col>
                <Col span="6">
                    <Button type="primary" @click="requestData()">搜索</Button>
                </Col>
                <Col span="6" class="text-right" v-if="!!selectedAudits && !!selectedAudits.length">
                    <Button type="primary" @click="batchStock">批量提报</Button>
                </Col>
            </Row>
        </div>
        <div class="panel-body">
            <Table :columns="columns" :data="data" :loading="loading" @on-selection-change="handleSelectChange"/>
            <Page :total="page.total" :current="page.pageNum" show-total size="small" @on-change="requestData"/>
            <Modal v-model="previewImageModal" :width="768" title="违规照片" :footerHide="true">
                <Carousel v-if="!!previewImages && !!previewImages.length">
                    <CarouselItem v-for="item in previewImages" :key="item.url">
                        <div class="illegal-img-container">
                            <img :src="item.url"/>
                        </div>
                    </CarouselItem>
                </Carousel>
            </Modal>
            <Modal v-model="auditModal"
                   width="400"
                   title="审核"
                   :mask-closable="false"
            >
                <Form ref="auditForm" :model="auditForm" :rules="auditRules" :label-width="80">
                    <FormItem label="审核层级" prop="auditLevel">
                        <Select v-model="auditForm.auditLevel" placeholde="请选择审核层级">
                            <Option :value="1">初审</Option>
                            <Option :value="2">复审</Option>
                            <Option :value="3">终审</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="审核结果" prop="result">
                        <Select v-model="auditForm.result" placeholde="请选择审核结果">
                            <Option :value="1">审核通过</Option>
                            <Option :value="2">审核不通过</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="原因" v-if="auditForm.result == 2" prop="auditRemark">
                        <Select v-model="auditForm.auditRemark" placeholde="请选择原因">
                            <Option v-for="item in template_2" :value="item.id" :key="item.id">{{item.content}}</Option>
                        </Select>
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
    import {queryAuditList, executeAudit, batchStock} from '../../service/illegal';
    import {getCityList} from '../../service/city';
    import {selectTemplate} from '../../service/template';

    const uid = auth.get().userId;

    export default {
        data() {
            const validateAudit = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error(rule.message))
                }
                callback()
            };
            return {
                cityList: [],
                template_1: [],
                template_2: [],
                query: {
                    cityCode: '',
                    auditLevel: 'firstAuditStatus',
                    result: 0
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
                auditRules: {
                    auditLevel: [{validator: validateAudit, message: '请选择审核层级', trigger: 'blur'}],
                    result: [{validator: validateAudit, message: '请选择审核结果', trigger: 'blur'}],
                    auditRemark: [{validator: validateAudit, message: '请选择原因', trigger: 'blur'}]
                },
                saveAuditLoading: false,
                selectedAudits: [],
                previewImageModal: false,
                previewImages: []
            }
        },
        created() {
            this.getCityList();
            let loading = this.$Message.loading({content: '正在加载', duration: 0});
            selectTemplate({})
                .then(res => {
                    loading();
                    if (res.ret) {
                        this.template_1 = (res.data || []).filter(item => item.templateType === 1);
                        this.template_2 = (res.data || []).filter(item => item.templateType === 2);
                        this.requestData()
                    } else {
                        this.$Message.error(res.errmsg)
                    }
                })
                .catch(err => {
                    loading();
                    this.$Message.error('请求异常')
                })
        },
        watch: {
            auditModal(value) {
                !value && this.$refs.auditForm.resetFields()
            }
        },
        methods: {
            getColumns() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '违规照片',
                        key: 'attachInfoList',
                        render: (h, param) => {
                            let {attachInfoList} = param.row;
                            return !!attachInfoList && !!attachInfoList.length ?
                                h('Tooltip', {
                                    props: {
                                        content: '点击查看大图',
                                        placement: 'top'
                                    }
                                }, [
                                    h('img', {
                                        class: 'illegal-img-overview',
                                        domProps: {
                                            src: attachInfoList[0].url
                                        },
                                        on: {
                                            click: () => {
                                                this.previewImages = attachInfoList;
                                                this.previewImageModal = true
                                            }
                                        }
                                    })
                                ]) : null
                        }
                    },
                    {
                        title: '违规主体',
                        key: 'ownership'
                    },
                    {
                        title: '所在位置',
                        key: 'position'
                    },
                    {
                        title: '违规原因',
                        key: 'reasionTempateId',
                        render: (h, param) => {
                            let reason = (this.template_1 || []).filter(item => item.id == param.row.reasionTempateId)[0];
                            return h('span', !!reason ? reason.content : '')
                        }
                    },
                    {
                        title: '违规说明',
                        key: 'content'
                    },
                    {
                        title: '审核状态',
                        render: (h, param) => {
                            let {firstAuditStatus, secondAuditStatus, lastAuditStatus} = param.row,
                                auditStatus = '';
                            switch (true) {
                                case !firstAuditStatus:
                                    auditStatus = '待审核';
                                    break;
                                case firstAuditStatus == 2:
                                    auditStatus = '未通过初审';
                                    break;
                                case firstAuditStatus == 1:
                                    auditStatus = '通过初审';
                                case !secondAuditStatus:
                                    break;
                                case secondAuditStatus == 2:
                                    auditStatus = '未通过复审';
                                    break;
                                case secondAuditStatus == 1:
                                    auditStatus = '通过复审';
                                case !lastAuditStatus:
                                    break;
                                case lastAuditStatus == 2:
                                    auditStatus = '未通过终审';
                                    break;
                                case lastAuditStatus == 1:
                                    auditStatus = '通过终审';
                                    break;
                                default: break;
                            }
                            return h('span', auditStatus)
                        }
                    },
                    {
                        title: '审核说明',
                        render: (h, param) => {
                            let {firstAuditRemark, secondAuditRemark, lastAuditRemark} = param.row;
                            return h('span', [firstAuditRemark, secondAuditRemark, lastAuditRemark].join('\n'))
                        }
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
                                            size: 'small',
                                            disabled: params.row.lastAuditStatus == 2
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
                let {cityCode, auditLevel, result} = this.query;
                queryAuditList({cityCode: cityCode || undefined, [auditLevel]: result, pageNum, pageSize: this.page.pageSize})
                    .then(res => {
                        this.loading = false;
                        if (res.ret) {
                            this.selectedAudits = [];
                            let {items, ...page} = res.data;
                            this.data = (items || []).map(item => {
                                if (item.lastAuditStatus != 2) {
                                    item._disabled = true
                                }
                                return item
                            });
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
                let {authId: id} = audit;
                this.auditForm = {
                    id, uid,
                    auditLevel: '',
                    result: '',
                    auditRemark: ''
                }
            },
            saveAudit() {
                this.$refs.auditForm.validate(valid => {
                    if (valid) {
                        this.saveAuditLoading = true;
                        let {auditRemark, ...others} = this.auditForm,
                            remark = this.template_2.filter(item => item.id == auditRemark)[0];
                        executeAudit({...others, auditRemark: others.result == 2 ? remark.content : ''})
                            .then(res => {
                                this.saveAuditLoading = false;
                                if (res.ret) {
                                    this.auditModal = false;
                                    this.$Message.success('提交成功');
                                    this.requestData(this.page.pageNum)
                                } else {
                                    this.$Message.error(res.errmsg);
                                }
                            })
                            .catch(err => {
                                this.saveAuditLoading = false;
                                this.$Message.error('请求异常')
                            })
                    }
                })
            },
            handleSelectChange(selection) {
                this.selectedAudits = selection.map(item => item.businessId)
            },
            batchStock() {
                this.$Modal.confirm({
                    title: '确认',
                    content: '确认提报？',
                    onOk: () => {
                        let loading = this.$Message.loading({content: '正在提报', duration: 0});
                        batchStock({uid, ids: this.selectedAudits.join(',')})
                            .then(res => {
                                loading();
                                if (res.ret) {
                                    this.$Message.success('提报成功');
                                    this.requestData(this.page.pageNum)
                                } else {
                                    this.$Message.error(res.errmsg)
                                }
                            })
                            .catch(err => {
                                loading();
                                this.$Message.error('请求异常')
                            })
                    }
                })
            }
        }
    }
</script>