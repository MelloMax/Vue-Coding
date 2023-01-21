export function parsePath(path) {

    let query = '', hash = ''

    const hashIndex = path.indexOf('#')
    if (hashIndex > -1) {
        hash = path.slice(hashIndex)
        path = path.slice(0, hashIndex)
    }

    const queryIndex = path.indexOf('?')
    if (queryIndex > -1) {
        query = path.slice(queryIndex + 1)
        path = path.slice(0, queryIndex)
    }

    return {
        path,
        query,
        hash
    }
}

export function resolvePath(relative, base, append) {
    const firstChar = relative.charAt(0)
    if (firstChar === '/') {
        return relative
    }

    if (firstChar === '?' || firstChar === '#') {
        return base + relative
    }

    const stack = base.split('/')

    // /a => ['', 'a']

    if (!append || !stack[stack.length - 1]) {
        stack.pop()
    }


    // /a/b/c => a/b/c => ['a', 'b', 'c']
    const segments = relative.split('/')

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        if(segment === '..') {
            stack.pop()
        } else if (segment !== '.') {
            stack.push(segment)
        }
    }


    // 防止 ['a', 'b'].join('/') => a/b 情况
    // 确保开头一定要有 /
    if(stack[0] !== '') {
        stack.unshift('')
    }


    return stack.join('/')

}