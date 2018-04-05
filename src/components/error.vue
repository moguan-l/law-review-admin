<template>
    <div class="error">
        <div class="code">{{code}}</div>
        <div class="message">{{message}}</div>
        <div class="text-center">
            <router-link to="/index">
                <Button type="ghost">返回首页</Button>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'error',
        props: ['code', 'message']
    }
</script>

<style scoped lang="less" type="text/less">
    .error {
        line-height: 1;
        .code {
            padding: 200px 0 15px;
            color: #2d8cf0;
            font-size: 96px;
            font-weight: bold;
            text-align: center;
        }
        .message {
            margin-bottom: 15px;
            color: #9ea7b4;
            text-align: center;
        }
    }
</style>