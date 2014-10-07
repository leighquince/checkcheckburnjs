/**
 * Heads Up Omaha AI Game Bot
 *
 * @author Russell Dempsey
 * @version 0.1
 * @License MIT License (http://opensource.org/Licenses/MIT)
 */

(function() {
    'use strict';

    exports.toIntIfNecessary = function(str) {
        var result = str;
        var potentialNumber = parseInt(str, 10);

        if (isFinite(potentialNumber)) {
            result = potentialNumber;
        }

        return result;
    };
    exports.Enum = function() // this is what the arguments are passed to
    {
        var values = arguments; // get the varargs and save them to a 'values' variable.
        var self = { // prepare a 'self' object to return, so we work with an object instead of a function
            all: [], // prepare a list of all indices
            keys: values // create the list of all keys
        };

        for (var i = 0; i < values.length; i++) // for all enum names given
        {
            self[values[i]] = i; // add the variable to this object
            self.all[i] = i; // add the index to the list of all indices
        }


        return self; // return the 'self' object, instead of this function
    };
    /** Performs a binary search on the host array. This method can either be
     * injected into Array.prototype or called with a specified scope like this:
     * binaryIndexOf.call(someArray, searchElement);
     *
     * @param {*} searchElement The item to search for within the array.
     * @return {Number} The index of the element which defaults to -1 when not found.
     *
     * http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/
     */
    exports.binaryIndexOf = function(searchElement) {

        var minIndex = 0;
        var maxIndex = this.length - 1;
        var currentIndex;
        var currentElement;

        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = this[currentIndex];

            if (currentElement < searchElement) {
                minIndex = currentIndex + 1;
            } else if (currentElement > searchElement) {
                maxIndex = currentIndex - 1;
            } else {
                return currentIndex;
            }
        }

        return -1;
    };




})();
