(function(global) {

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
    var c = cqrs({
        owner: 'aggregate-suggestion'
    });

    var suggestionAggregate = c.aggregate('suggestion');

    /*
     * addSuggestion and suggestionAdded
     */
    function handleAddSuggestion(payload, metadata) {
        var label = payload.trim();

        var notYetStored = loadSuggestions().filter(function(suggestion) {
            return suggestion === label;
        }).length < 1;

        if (notYetStored) {
            return payload;
        }
    }
    suggestionAggregate.when('addSuggestion').invoke(handleAddSuggestion).apply('suggestionAdded');

    function handleSuggestionAdded(payload, metadata) {
        var suggestions = loadSuggestions();
        suggestions.push(payload);
        storeSuggestions(suggestions);
    }
    suggestionAggregate.on('suggestionAdded').invoke(handleSuggestionAdded);

    /*
     * clearSuggestions and suggestionsCleared
     */
    function handleClearSuggestions(payload, metadata) {
        return {
            suggestionsRemoved: loadSuggestions().length
        };
    }
    suggestionAggregate.when('clearSuggestions').invoke(handleClearSuggestions).apply('suggestionsCleared');

    function handleSuggestionsCleared(payload, metadata) {
        storeSuggestions([]);
    }
    suggestionAggregate.on('suggestionsCleared').invoke(handleSuggestionsCleared);

    /*
     * listSuggestions
     */
    function listSuggestions() {
        return loadSuggestions();
    }
    c.calling('listSuggestions').invoke(listSuggestions);

}(this));
