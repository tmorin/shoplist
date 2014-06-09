(function(global) {

    var c = cqrs({
        owner: 'component-views'
    });

    function handleError(message) {
        return function(error) {
            alert(message + '\n' + error.message);
            console.warn(message);
            console.warn(error);
        };
    }

    var itemsView = document.querySelector('#itemsView');
    var suggestionsView = document.querySelector('#suggestionsView');
    var views = [itemsView, suggestionsView];

    function setVisible(el) {
        el.hidden = false;
    }
    function setHidden(el) {
        el.hidden = true;
    }

    function showItemsView(payload, metadata) {
        views.forEach(setHidden);
        setVisible(itemsView);
    }
    c.when('showItemsView').invoke(showItemsView);

    function showSuggestionsView(payload, metadata) {
        views.forEach(setHidden);
        setVisible(suggestionsView);
    }
    c.when('showSuggestionsView').invoke(showSuggestionsView);

}(this));
