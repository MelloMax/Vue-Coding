export function stringifyQuery(obj) {
    let res = null
    if(obj !== null && typeof obj === 'object') {
        res = Object.keys(obj)
            .map(key => {
                const val = obj[key]

                if(val === void 0) {
                    return ''
                }

                if(val === null) {
                    return encode(key)
                }

                if(Array.isArray(val)) {
                    const result = []

                    val.forEach(v => {
                        if(v === void 0) {
                            return
                        }

                        if(v === null) {
                            result.push(encode(key))
                        } else {
                            result.push(encode(key) + '=' + encode(v))
                        }
                    })


                    return result.join('&')
                }

                return encode(key) + '=' + encode(val)

            })
            .filter(str => str.length > 0)
            .join('&')
    }
    return res ? '?' + res : ''
}


function encode (str) {
    return encodeURIComponent(str)
        .replace(/[!'()*]/g, (c) => {
            return '%' + c.charCodeAt(0).toString(16)
        })
        .replace(/2C/g, ',')
}

function decode(str) {
    try {
      return decodeURIComponent(str)
    } catch (e) {

    }

    return str
}