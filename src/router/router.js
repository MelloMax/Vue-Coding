let _vue

export default class Router {
    static install = install

    constructor(options) {

        this.options = options

        this.mode = this.options.mode === 'history' ? 'history' : 'hash'

        this.history = this.mode === 'history' ? new Html5(this) : new Hash(this)

        this.routeMap = this.initCreateRouteMap(options.routes)
    }

    init(app) {
        // 设置回调函数
        this.history.cb = function (route) {
            app._route = route
        }

        this.history.transitionTo()

        this.history.setupListener()
    }

    initCreateRouteMap(routes = []) {
        // hashmap
        return Object.freeze(routes.reduce((o, route) => {
            o[route.path] = route
            return o
        }, {}))
    }

    push(location) {
        this.history.push(location)
    }

    replace(location) {
        this.history.replace(location)
    }
}

class Hash {
    constructor(router) {
        this.router = router
        this.current = null
        this.cb = null
        this.ensureSlash()
    }

    setupListener() {
        window.addEventListener('hashchange', () => {
            this.transitionTo()
        }, false)
    }

    transitionTo() {
        const hash = this.getHash()
        const route = this.router.routeMap[hash]
        if (route && this.cb) {
            this.current = route
            this.cb(route)
        }
    }


    ensureSlash() {
        // 校验
        const path = this.getHash()
        if (path.charAt(0) !== '/') {
            // 将url更为最新路由的url
            this.replace('/' + path)
        }

    }

    getUrl() {
        const href = window.location.href
        const index = href.indexOf('#')

        return index < 0 ? href : href.slice(0, index)
    }

    getHash() {
        const href = window.location.href
        const index = href.indexOf('#')

        if (index < 0) {
            return ''
        }

        return href.slice(index + 1) // 去掉#
    }

    replace(path) {
        window.location.replace(`${this.getUrl()}#${path}`)
    }

    push(path) {
        window.location.hash = path
    }
}

class Html5 {
    constructor(router) {
        this.router = router
        this.current = this.getLocation()
        this.cb = null
        this._key = this.getKey()
    }

    setupListener() {
        window.addEventListener('popstate', () => {
            this.transitionTo()
        }, false)
    }

    transitionTo() {
        const current = this.current
        const location = this.getLocation()
        const route = this.router.routeMap[location]

        if (current === route && route.path === location) {
            return
        }


        if (route && this.cb) {
            this.current = route
            this.cb(route)
        }
    }


    getLocation() {
        const pathname = location.pathname
        return (pathname || '/') + location.search + location.hash
    }

    replace(location) {
        this.pushState(location, true)
    }

    push(location) {
        this.pushState(location)
    }

    pushState(location, replace) {
        try {
            if (replace) {
                const stateCopy = Object.assign({}, history.state)
                stateCopy.key = this.getKey()
                history.replaceState(stateCopy, null, location)
            } else {
                history.pushState({
                    key: this.setKey(this.getKey())
                }, null, location)
            }
            this.transitionTo()
        } catch (e) {
            // window.location[replace ? 'replace' : 'assgin'](location)
        }


    }

    getKey() {
        return performance.now().toFixed(3)
    }

    setKey(key) {
        return (this._key = key)
    }


}


function install(Vue) {
    if (_vue && install.intalled) return
    install.intalled = true
    _vue = Vue

    Vue.mixin({
        beforeCreate() {

            if (this.$options.router) {
                this._routerRoot = this
                const router = this.$options.router
                this._router = router
                // 响应式才能触发渲染
                Vue.util.defineReactive(this, '_route', router.history.current)
                router.init(this)
            } else {
                // 将根路由传递下去
                this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
            }


            // console.log(this._routerRoot, '\n', this)


        }
    })

    Object.defineProperty(Vue.prototype, '$route', {
        get() {
            return this._routerRoot._route
        }
    })

    Object.defineProperty(Vue.prototype, '$router', {
        get() {
            return this._routerRoot._router
        }
    })

    Vue.component('RouterLink', {
        props: {
            tag: {
                type: String,
                default: 'a'
            },
            to: {
                type: String,
                required: true
            },
            replace: Boolean
        },
        render(h) {
            const href = typeof this.to === 'string' ? this.to : this.to.path
            const router = this.$router
            return h(this.tag, {
                attrs: {
                    href: router.mode === 'hash' ? '#' + href : href
                },
                on: {
                    click: e => {
                        if (e.preventDefault) {
                            e.preventDefault()
                        }
                        this.$router[this.replace ? 'replace' : 'push'](href)
                    }
                }
            }, this.$slots.default)
        }
    })


    Vue.component('RouterView', {
        functional: true,
        render(h, {parent}) {
            const route = parent.$route
            return h(route ? route.component : null)
        }
    })


}

