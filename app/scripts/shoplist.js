(function(global) {

    var c = cqrs({
        owner: 'shoplist'
    });

    function handleError(message) {
        return function(error) {
            alert(message + '\n' + error.message);
            console.warn(message);
            console.warn(error);
        };
    }

    global.sendMarkBoughtOrNotBought = function(input) {
        if (input.checked) {
            c.send('markItemBought', input.value).then(null, handleError('unable to mark item bought'));
        } else {
            c.send('markItemNotBought', input.value).then(null, handleError('unable to mark item not bought'));
        }
    };

    global.sendCorrectItemQuantity = function(form) {
        c.send('correctItemQuantity', {
            label: form.label.value,
            quantity: form.quantity.value
        }).then(null, handleError('unable to correct the quantity'));
    };

    global.sendRemoveItem = function(form) {
        c.send('removeItem', form.label.value).then(null, handleError('unable to remove the item'));
    };

    global.sendShowItemsView = function() {
        c.send('showItemsView').then(null, handleError('unable to show the items view'));
    };

    global.sendShowSuggestionsView = function(a) {
        c.send('showSuggestionsView').then(null, handleError('unable to show the suggestions view'));
    };

    global.sendClearItems = function(button) {
        if (confirm('Do you really want to clear all items?')) {
            c.send('clearItems').then(null, handleError('unable to clear the items'));
        }
    };

    global.sendAddItem = function(form) {
        c.send('addItem', {
            label: form.label.value,
            quantity: form.quantity.value,
        }).then(function() {
            form.label.value = '';
            form.quantity.value = '';
        }, handleError('unable to add the item'));
    };

    global.sendClearSuggestions = function(button) {
        if (confirm('Do you really want to clear all suggestions?')) {
            c.send('clearSuggestions').then(null, handleError('unable to clear the suggestions'));
        }
    };

    // initialize views
    c.call('listItems').then(function(items) {
        items.forEach(function(item) {
            c.publish('itemAdded', item).then(null, handleError);
        });
    }).then(null, handleError);

    c.call('listSuggestions').then(function(suggestions) {
        suggestions.forEach(function(suggestion) {
            c.publish('suggestionAdded', suggestion).then(null, handleError);
        });
    }).then(null, handleError);

    // display the first view
    global.sendShowItemsView();

}(this));
