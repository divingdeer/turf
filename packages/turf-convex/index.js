var each = require('@turf/meta').coordEach,
    convexHull = require('convex-hull'),
    polygon = require('@turf/helpers').polygon;

/**
 * Takes a [feature](http://geojson.org/geojson-spec.html#feature-objects)
 * or a [featureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)
 * and returns a [convex hull](http://en.wikipedia.org/wiki/Convex_hull) polygon.
 *
 * Internally this uses
 * the [convex-hull](https://github.com/mikolalysenko/convex-hull) module that
 * implements a [monotone chain hull](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain).
 *
 * @name convex
 * @param {(Feature|FeatureCollection)} feature input Feature or FeatureCollection
 * @returns {Feature<Polygon>} a convex hull
 * @example
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.195312, 43.755225]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.404052, 43.8424511]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.579833, 43.659924]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.360107, 43.516688]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.14038, 43.588348]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.195312, 43.755225]
 *       }
 *     }
 *   ]
 * };
 *
 * var hull = turf.convex(points);
 *
 * var resultFeatures = points.features.concat(hull);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */
module.exports = function (feature) {
    var points = [];

    // Remove Z in coordinates because it breaks the convexHull algorithm
    each(feature, function (coord) {
        points.push([coord[0], coord[1]]);
    });

    var hull = convexHull(points);

    // Hull should have at least 3 different vertices in order to create a valid polygon
    if (hull.length >= 3) {
        var ring = [];
        for (var i = 0; i < hull.length; i++) {
            ring.push(points[hull[i][0]]);
        }
        ring.push(points[hull[hull.length - 1][1]]);
        return polygon([ring]);
    }
    return undefined;
};
