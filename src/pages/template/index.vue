<template>
    <div class="panel">
        <div class="panel-header">
            <Row>
                <Col span="12">
                    <Button type="primary" icon="plus-round" @click="addTemplate">添加模板</Button>
                </Col>
                <Col span="12">
                    <Select v-model="templateType" class="pull-right" style="width: 200px">
                        <Option :value="0">全部模板</Option>
                        <Option v-for="item in templateTypes" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </Col>
            </Row>
        </div>
        <div class="panel-body">
            <Table :columns="columns" :data="data" :loading="loading"/>
            <Modal v-model="templateModal"
                   width="400"
                   :title="templateModalTitle"
                   :mask-closable="false"
            >
                <Form ref="templateForm" :model="templateForm" :rules="templateRule" :label-width="80">
                    <FormItem label="模板类型">
                        <Cascader :data="templateTypes" v-model="templateForm.types" trigger="hover"/>
                    </FormItem>
                    <FormItem label="模板内容" prop="content">
                        <Input type="text" v-model="templateForm.content"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" @click="saveTemplate" :loading="saveTemplateLoading">保存</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import {selectTemplate, getTemplateType, saveTemplate} from '../../service/template';

    export default {
        data () {
            return {
                templateTypes: [],
                templateType: 0,
                columns: this.getColumns(),
                data: [],
                loading: false,
                templateModal: false,
                templateModalTitle: '',
                templateForm: {},
                templateRule: {
                    content: [{required: true, message: '模板内容不能为空', trigger: 'blur'}]
                },
                saveTemplateLoading: false
            }
        },
        created() {
            this.getTemplateType();
            this.requestData()
        },
        watch: {
            templateType() {
                this.requestData()
            }
        },
        methods: {
            getColumns() {
                return [
                    {
                        title: '模板ID',
                        width: 80,
                        key: 'id'
                    },
                    {
                        title: '模板类型',
                        width: 160,
                        key: 'templateType',
                        render: (h, param) => {
                            let templateType = this.templateTypes.filter(item => item.value == param.row.templateType)[0];
                            return h('span', !!templateType ? templateType.label : '')
                        }
                    },
                    {
                        title: '模板内容',
                        key: 'content'
                    }
                ]
            },
            requestData() {
                this.loading = true;
                selectTemplate({templateType: this.templateType || undefined})
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
            handleTemplateTypes(data) {
                return data.map(item => {
                    let {templateTypeId, templateTypeName, subTypeList} = item;
                    return {
                        value: templateTypeId,
                        label: templateTypeName,
                        children: !!subTypeList ? subTypeList.map(_item => {
                            let {subTypeId, subTypeName} = _item;
                            return {
                                value: subTypeId,
                                label: subTypeName
                            }
                        }) : []
                    }
                })
            },
            getTemplateType() {
                getTemplateType()
                    .then(res => {
                        if (res.ret) {
                            this.templateTypes = this.handleTemplateTypes(res.data)
                        }
                    })
            },
            addTemplate() {
                this.templateModal = true;
                this.templateModalTitle = '添加模板';
                this.templateForm = {
                    types: [],
                    content: ''
                }
            },
            editTemplate(template) {
                this.templateModal = true;
                this.templateModalTitle = '编辑模板';
                let {templateId, templateType, subType, content} = template;
                this.templateForm = {
                    templateId,
                    types: [templateType, subType],
                    content
                }
            },
            saveTemplate() {
                this.$refs.templateForm.validate((valid) => {
                    if (valid) {
                        if (!this.templateForm.types.length) {
                            return this.$Message.warning('请选择模板类型')
                        }
                        this.saveTemplateLoading = true;
                        saveTemplate(this.templateForm)
                            .then(res => {
                                this.saveTemplateLoading = false;
                                if (res.ret) {
                                    this.templateModal = false;
                                    this.$Message.success('保存成功');
                                    this.requestData()
                                } else {
                                    this.$Message.error(res.errmsg)
                                }
                            })
                            .catch(err => {
                                this.saveTemplateLoading = false;
                                this.$Message.error('请求异常')
                            })
                    }
                })
            }
        }
    }
</script>