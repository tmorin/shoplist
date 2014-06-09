(function(global) {

    var c = cqrs({
        owner: 'component-suggestions-list'
    });

    var suggestionLiTpl = document.getElementById('suggestionLiTpl').textContent;
    var suggestionsList = document.querySelector('#suggestionsView ul.suggestionsList');

    function addSuggestionInDataList(payload, metadata) {
        var li = document.createElement('li');
        li.classList.add('list-item-single-line');
        li.innerHTML = suggestionLiTpl;
        li.querySelector('.suggestion').textContent = payload;
        suggestionsList.appendChild(li);
    }
    c.on('suggestionAdded').invoke(addSuggestionInDataList);

    function clearSuggestionsInDataList(payload, metadata) {
        var children = [].concat.apply([], suggestionsList.childNodes);
        children.forEach(function(child) {
            suggestionsList.removeChild(child);
        });
    }
    c.on('suggestionsCleared').invoke(clearSuggestionsInDataList);

}(this));
