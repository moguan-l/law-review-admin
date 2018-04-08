<template>
    <div class="panel">
        <div class="panel-body">
            <Table :columns="columns" :data="data" :loading="loading"/>
            <Page :total="page.total" :current="page.pageNum" show-total size="small" @on-change="requestData"/>
        </div>
    </div>
</template>

<script>
    import {selectViolationsStock} from '../../service/illegal';

    export default {
        data () {
            return {
                columns: this.getColumns(),
                data: [],
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                loading: false
            }
        },
        created() {
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
                        key: 'position'
                    },
                    {
                        title: '违规说明',
                        key: 'content'
                    }
                ]
            },
            requestData(pageNum = 1) {
                this.loading = true;
                selectViolationsStock({pageNum, pageSize: this.page.pageSize})
                    .then(res => {
                        this.loading = false;
                        if (res.ret) {
                            let {items, ...page} = res.data;
                            this.data = items;
                            this.page = page
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