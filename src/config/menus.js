export default [
    {
        name: '违规信息',
        url: '/illegal',
        icon: 'ios-paper',
        children: [
            {
                name: '违规信息',
                url: '/illegal/audit'
            },
            {
                name: '提报档案',
                url: '/illegal/archive'
            }
        ]
    },
    {
        name: '任务发布',
        url: '/duty/index',
        icon: 'ios-paperplane'
    },
    {
        name: '用户管理',
        url: '/user/index',
        icon: 'ios-people'
    },
    {
        name: '积分管理',
        url: '/credit/index',
        icon: 'ios-flag'
    },
    {
        name: '模板管理',
        url: '/template/index',
        icon: 'ios-list'
    },
    {
        name: '城市管理',
        url: '/city/index',
        icon: 'ios-home'
    },
    {
        name: '系统设置',
        url: '/setting',
        icon: 'ios-gear',
        children: [
            {
                name: '用户管理',
                url: '/setting/user'
            }
        ]
    }
]