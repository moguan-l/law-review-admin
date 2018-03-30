<template>
    <ul class="layout-header-nav">
        <li class="nav-item">
            <Dropdown placement="bottom-end">
                <a href="javascript:void(0)">
                    管理员
                    &nbsp;
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem @click.native="logout">退出登录</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </li>
    </ul>
</template>

<script>
    import auth from '../assets/js/auth';

    export default {
        data() {
            return {}
        },
        methods: {
            logout() {
                auth.logout();
                this.$router.push('/login')
            }
        }
    }
</script>