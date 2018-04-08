<template>
    <div class="panel">
        <div class="panel-body">
            <Table :columns="columns" :data="data" :loading="loading"/>
            <!--<Page :total="page.total" :current="page.pageNum" show-total size="small" @on-change="requestData"/>-->
        </div>
    </div>
</template>

<script>
    import {getCityList} from '../../service/city';

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
                        title: '经度',
                        key: 'lng'
                    },
                    {
                        title: '纬度',
                        key: 'lat'
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
            }
        }
    }
</script>