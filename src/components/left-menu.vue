<template>
    <div class="layout-nav">
        <div class="nav-container scrollbar">
            <Menu ref="menu" width="auto" :active-name="activeName" :open-names="openNames" @on-select="handleSelect">
                <template v-for="menu in menus">
                    <MenuItem v-if="!menu.children || !menu.children.length" :name="menu.url">
                        <Icon v-if="!!menu.icon" :type="menu.icon"/>
                        {{menu.name}}
                    </MenuItem>
                    <Submenu v-else :name="menu.url">
                        <template slot="title">
                            <Icon v-if="!!menu.icon" :type="menu.icon"/>
                            {{menu.name}}
                        </template>
                        <template v-for="_menu in menu.children">
                            <MenuItem :name="_menu.url">{{_menu.name}}</MenuItem>
                        </template>
                    </Submenu>
                </template>
            </Menu>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        data() {
            let activeName = this.$route.path;
            return {
                activeName,
                openNames: ['/' + activeName.split('/')[1]]
            }
        },
        mounted() {
            this.$store.dispatch('getMenus')
        },
        computed: mapGetters(['menus']),
        watch: {
            menus() {
                this.menuExtend && this.$nextTick(() => {
                    this.$refs.menu.updateActiveName();
                    this.$refs.menu.updateOpened()
                })
            }
        },
        methods: {
            handleSelect(name) {
                this.$router.push(name)
            }
        }
    }
</script>