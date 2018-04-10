<template>
    <div class="panel">
        <div class="panel-body">
            <Table :columns="columns" :data="data" :loading="loading"/>
            <!--<Page :total="page.total" :current="page.pageNum" show-total size="small" @on-change="requestData"/>-->
        </div>
    </div>
</template>

<script>
    import auth from '../../assets/js/auth';
    import {getCityList, updateCity} from '../../service/city';

    const uid = auth.get().userId;

    export default {
        data() {
            return {
                columns: this.getColumns(),
                loading: false,
                data: [],
                page: {
                    pageNum: 1,
                    pageSize: 10
                }
            }
        },
        created() {
            this.requestData()
        },
        methods: {
            getColumns() {
                return [
                    {
                        title: '城市ID',
                        key: 'cityCode'
                    },
                    {
                        title: '城市名称',
                        key: 'name'
                    },
                    {
                        title: '状态',
                        key: 'isActive',
                        render: (h, params) => {
                            let {isActive} = params.row;
                            return h('Tag', {
                                props: {color: !!isActive ? 'green' : ''}
                            }, !!isActive ? '已启用' : '已禁用')
                        }
                    },
                    {
                        title: '经度',
                        key: 'lng'
                    },
                    {
                        title: '纬度',
                        key: 'lat'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            let {isActive} = params.row;
                            return h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: `确认${!!isActive ? '禁用' : '启用'}该城市？`
                                },
                                on: {
                                    'on-ok': () => {
                                        this.updateCity(params.row)
                                    }
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'ghost',
                                        size: 'small'
                                    }
                                }, !!isActive ? '禁用' : '启用')
                            ])
                        }
                    }
                ]
            },
            requestData(pageNum = 1) {
                this.loading = true;
                getCityList({pageNum, pageSize: this.page.pageSize})
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
            updateCity(city) {
                let loading = this.$Message.loading({content: '正在处理', duration: 0});
                let {cityCode, isActive} = city;
                updateCity({cityCode, isActive: Number(!isActive), uid})
                    .then(res => {
                        loading();
                        if (res.ret) {
                            this.requestData()
                        } else {
                            this.$Message.error(res.errmsg)
                        }
                    })
                    .catch(err => {
                        loading();
                        this.$Message.error('请求异常')
                    })
            }
        }
    }
</script>