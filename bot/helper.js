/**
 * Heads Up Omaha AI Game Bot
 *
 * @author Russell Dempsey
 * @version 0.1
 * @License MIT License (http://opensource.org/Licenses/MIT)
 */
 
(function(){
    'use strict';

    exports.toIntIfNecessary = function(str) {
        var result = str;
        var potentialNumber = parseInt(str, 10);

        if (isFinite(potentialNumber)) {
            result = potentialNumber;
        }

        return result;
    };


})();