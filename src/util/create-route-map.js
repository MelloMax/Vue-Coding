export function createRouteMap(routes) {
    const pathList = [],
        pathMap = Object.create(null),
        nameMap = Object.create(null)


    routes.forEach(route => {
        addRouteRecord(pathList, pathMap, nameMap, route)
    })

    // 将通配符的路由，推到后面
    for(let i = 0, l = pathList.length; i < l; i++) {
        if(pathList[i] === '*') {
            pathList.push(pathList.splice(i ,1)[0])
            i--
            l--
        }
    }



    return {
        pathList,
        pathMap,
        nameMap
    }
}

function addRouteRecord(pathList, pathMap, nameMap, route, parent) {
    const {path, name} = route
    const pathToRegexpOptions = route.pathToRegexpOptions || {}

    // [{path: 'a', children: [{path: 'b'}]}] => ['a', 'a/b']
    const normalized = normalizePath(path, parent, pathToRegexpOptions.strict)

    const record = {
        path: normalized,
        components: route.components || {default: route.component},
        name,
        parent,
        redirect: route.redirect,
        beforeEnter: route.beforeEnter,
        meta: route.meta || {},
        props: route.props == null
            ? {}
            : route.components
                ? route.props
                : { default: route.props }
    }

    if(route.children) {
        route.children.forEach(child => {
            addRouteRecord(pathList, pathMap, nameMap, child, record)
        })
    }

    if(!pathMap[record.path]) {
        pathList.push(record.path)
        pathMap[record.path] = record
    }

    if(name && !nameMap[name]) {
        nameMap[name] = record
    }


}

export function normalizePath(path, parent, strict) {
    // 去尾部的 /
    if(!strict) path = path.replace(/\/$/, '')
    if(path[0] === '/') return path
    if(parent == null) return path

    return `${parent.path}/${path}`
}


function cleanPath(path) {
    return path.replace(/\/(?:\s*\/)+/, '/')
}