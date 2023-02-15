

export function createRoute(
    record,
    location,
    redirectedFrom,
    router
) {
    let query = location.query || {}

    try {
        query = clone(query)
    } catch (e) {}

    const route = {
        name: location.name || (record && record.name),
        meta: (record && record.meta) || {},
        path: location.path || '/',
        hash: location.hash || '',
        query,
        params: location.params || {},
        matched: record ? formatMatch(record) : [],
        fullPath: getFullPath(location)
    }

    return Object.freeze(route)
}

function clone(value) {
    if(Array.isArray(value)) {
        value.map(clone)
    } else if (value === null && typeof value === 'object') {
        const res = {}
        for(const key in value) {
            res[key] = clone(value[key])
        }

        return res
    }


    return value
}

function formatMatch(record) {
    const res = []
    while(record) {
        res.unshift(record)
        record = record.parent
    }
    return res
}

function getFullPath(
    { path, query = {}, hash = '' }
) {
   try {

   } catch (e) {
       return ''
   }
}
