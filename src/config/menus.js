export default [
    {
        name: '违规信息',
        url: '/illegal',
        icon: 'ios-paper',
        children: [
            {
                name: '违规审核',
                url: '/illegal/audit'
            },
            {
                name: '违规提报',
                url: '/illegal/offer/index'
            },
            {
                name: '提报档案',
                url: '/illegal/offer/archive'
            }
        ]
    },
    {
        name: '任务发布',
        icon: 'ios-paperplane',
        url: '/duty/index'
    },
    {
        name: '积分管理',
        url: '/credit',
        icon: 'ios-flag',
        children: [
            {
                name: '积分管理',
                url: '/credit/index'
            },
            {
                name: '积分渠道',
                url: '/credit/channel'
            }
        ]
    },
    {
        name: '模板管理',
        icon: 'ios-list',
        url: '/template/index'
    },
    {
        name: '城市管理',
        icon: 'ios-home',
        url: '/city/index'
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