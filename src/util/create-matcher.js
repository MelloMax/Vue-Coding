import {createRouteMap} from './create-route-map'

export function createMatcher (routes, router) {
    const { pathList, nameMap, pathMap } = createRouteMap(routes)
    function match (raw, currentRoute, redirectedFrom) {
    }




    return {
        match
    }
}


function _createRoute(
    record,
    location,
    redirectedFrom
) {

}