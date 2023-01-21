import {parsePath, resolvePath} from '@/util/path'

describe('Path utils', () => {

    describe('parsePath', () => {
        it('plain', () => {
            const ret = parsePath('/a')

            expect(ret.path).toBe('/a')
            expect(ret.query).toBe('')
            expect(ret.hash).toBe('')
        })

        it('query', () => {

            const ret = parsePath('/a?foo=bar???')

            expect(ret.path).toBe('/a')
            expect(ret.query).toBe('foo=bar???')
            expect(ret.hash).toBe('')
        })

        it('hash', () => {
            const ret = parsePath('/a#haha#hoho')

            expect(ret.path).toBe('/a')
            expect(ret.query).toBe('')
            expect(ret.hash).toBe('#haha#hoho')
        })

        it('both', () => {
            const res = parsePath('/a?foo=bar#ok?baz=qux')

            expect(res.path).toBe('/a')
            expect(res.hash).toBe('#ok?baz=qux')
            expect(res.query).toBe('foo=bar')
        })
    })


    describe('resolvePath', () => {
        it('absolute', () => {
            const path = resolvePath('/a', '/b')
            expect(path).toBe('/a')
        })

        it('relative', () => {
            const path = resolvePath('c/d', '/b')
            expect(path).toBe('/c/d')
        })

        it('relative with append', () => {
            const path = resolvePath('c/d', '/b', true)
            expect(path).toBe('/b/c/d')
        })

        it('relative parent with append', () => {
            const path = resolvePath('../d', '/a/b/c', true)
            expect(path).toBe('/a/b/d')
        })

        it('relative query', () => {
            const path = resolvePath('?foo=bar', '/a/b')
            expect(path).toBe('/a/b?foo=bar')
        })

        it('relative hash', () => {
            const path = resolvePath('#hi', '/a/b')
            expect(path).toBe('/a/b#hi')
        })
    })
})
