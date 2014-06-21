(function(global) {

    'use strict';

    /*
     * localStorage accessors
     */
    var localStorageSuggestionsKey = 'suggestions';

    function loadSuggestions() {
        var json = localStorage.getItem(localStorageSuggestionsKey);
        if (json) {
            return JSON.parse(json);
        }
        return [];
    }

    function storeSuggestions(suggestions) {
        var json = JSON.stringify(suggestions || []);
        localStorage.setItem(localStorageSuggestionsKey, json);
    }

    /*
     * cqrs setup
     */
    var c = global.cqrs({
        owner: 'aggregate-suggestion'
    });

    var suggestionAggregate = c.aggregate('suggestion');

    /*
     * Add suggestions
     */
    function handleAddSuggestions(payload, metadata) {
        var suggestions = loadSuggestions();
        return payload.map(function (suggestion) {
            return suggestion.trim();
        }, this).filter(function (suggestion) {
            return suggestions.indexOf(suggestion) < 0;
        });
    }
    suggestionAggregate.when('addSuggestions').invoke(handleAddSuggestions).apply('suggestionsAdded');

    function handleSuggestionsAdded(payload, metadata) {
        var suggestions = loadSuggestions();
        payload.forEach(function (suggestion) {
            suggestions.push(suggestion);
        }, this);
        storeSuggestions(suggestions);
    }
    suggestionAggregate.on('suggestionsAdded').invoke(handleSuggestionsAdded);

    /*
     * Remove suggestions
     */
    function handleClearSuggestions(payload, metadata) {
        return loadSuggestions();
    }
    suggestionAggregate.when('clearSuggestions').invoke(handleClearSuggestions).apply('suggestionsRemoved');

    function handleSuggestionsRemoved(payload, metadata) {
        var suggestions = loadSuggestions();
        payload.forEach(function (suggestion) {
            var index = suggestions.indexOf(suggestion);
            suggestions.splice(index, 1);
        }, this);
        storeSuggestions(suggestions);
    }
    suggestionAggregate.on('suggestionsRemoved').invoke(handleSuggestionsRemoved);

    /*
     * listSuggestions
     */
    function listSuggestions() {
        return loadSuggestions();
    }
    c.calling('listSuggestions').invoke(listSuggestions);

}(this));
