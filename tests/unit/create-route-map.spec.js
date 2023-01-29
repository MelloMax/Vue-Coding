import { createRouteMap, normalizePath } from '@/util/create-route-map'

const Bar = { template: '<div>This is Bar <router-view></router-view></div>' }
const Baz = { template: '<div>This is Baz</div>' }

const routes = [
    {path: '/', name: 'home', component: { template: '<div>This is Home</div>' }},
    {path: '/foo', name: 'foo', component: { template: '<div>This is Foo</div>' }},
    {path: '*', name: 'wildcard', component: Baz},
    {
        path: '/bar',
        name: 'bar',
        component: Bar,
        children: [
            {
                path: '',
                component: Baz,
                name: 'bar.baz'
            }
        ]
    },
    {
        path: '/bar-redirect',
        name: 'bar-redirect',
        redirect: { name: 'bar-redirect.baz' },
        component: Bar,
        children: [
            {
                path: '',
                component: Baz,
                name: 'bar-redirect.baz'
            }
        ]
    }
]

describe('Create route map', () => {
    let maps

    beforeAll(() => {
        maps = createRouteMap(routes)
    })

    it('pathList', () => {
        expect(maps.pathList).toEqual([
            '',
            '/foo',
            '/bar/',
            '/bar',
            '/bar-redirect/',
            '/bar-redirect',
            '*'
        ])
    })
})

describe('normalizePath', () => {
    const routeA = {path: '/a'}
    it('strict', () => {
        const path = normalizePath('/a/', null, false)
        expect(path).toBe('/a')
    })

    it('path', () => {
        const path = normalizePath('/b', routeA, false)
        expect(path).toBe('/b')
    })

    it('parent', () => {
        const path = normalizePath('b', routeA, false)
        expect(path).toBe('/a/b')
    })
})