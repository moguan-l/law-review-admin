<template>
    <error code="401" message="您没有足够的权限"/>
</template>

<script>
    import error from '../components/error';

    export default {
        components: {error}
    }
</script>