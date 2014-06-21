(function(global) {

    'use strict';

    var c = global.cqrs({
        owner: 'component-dispatcher'
    });

    function sendAddSuggestions(payload, metadata) {
        if (metadata.appliedOn) {
            var suggestions = payload.map(function (item) {
                return item.label;
            });
            c.send('addSuggestions', suggestions, metadata).then(null, function(error) {
                global.alert('unable to add a suggestion\n' + error.message);
                console.warn('unable to add a suggestion');
                console.warn(error);
            });
        }
    }
    c.on('itemsAdded').invoke(sendAddSuggestions);

}(this));
