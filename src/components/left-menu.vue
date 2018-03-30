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
                            <MenuItem v-if="!_menu.children || !_menu.children.length" :name="_menu.url">
                                <Icon v-if="!!_menu.icon" :type="_menu.icon"/>
                                {{_menu.name}}
                            </MenuItem>
                            <MenuGroup v-else :title="_menu.name">
                                <template v-for="__menu in _menu.children">
                                    <MenuItem :name="__menu.url">
                                        <Icon v-if="!!__menu.icon" :type="__menu.icon"/>
                                        {{__menu.name}}
                                    </MenuItem>
                                </template>
                            </MenuGroup>
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