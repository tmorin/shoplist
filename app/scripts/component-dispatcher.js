(function(global) {

    var c = cqrs({
        owner: 'component-dispatcher'
    });

    function sendAddSuggestion(payload, metadata) {
        if (metadata.appliedOn) {
            // dispatch only applied event
            c.send('addSuggestion', payload.label, metadata).then(null, function(error) {
                alert('unable to add a suggestion\n' + error.message);
                console.warn('unable to add a suggestion');
                console.warn(error);
            });
        }
    }
    c.on('itemAdded').invoke(sendAddSuggestion);

}(this));
