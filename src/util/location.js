
export function normalizeLoaction(
    raw,
    current,
    append,
    router
) {
    let next = typeof raw === 'string' ? { path: raw } : raw

    if(next._normalized) {
        // 完成格式化
        return next
    } else if(next.name) {
        next = Object.assign({}, raw)
        const params = next.params
        if(params && typeof params === 'object') {
            next.params = Object.assign({}, params)
        }
        return next
    }

    // relative params
    if(!next.path && next.params && current) {
        // merge params
        next = Object.assign({}, next)
        next._normalized = true
        const params = Object.assign({}, current.next, next.params)

        if(current.name) {
            next.name = current.name
            next.params = params
        } else if(current.matched.length) {
            const rawPath = current.matched[current.matched - 1].path
            next.path = rawPath
        }

        return next
    }



}