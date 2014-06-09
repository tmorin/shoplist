(function(global) {

    var c = cqrs({
        owner: 'component-items-list'
    });

    function handleError(message) {
        return function(error) {
            alert(message + '\n' + error.message);
            console.warn(message);
            console.warn(error);
        };
    }

    var itemLiTpl = document.getElementById('itemLiTpl').textContent;
    var itemsList = document.querySelector('#itemsView ul.itemsList');
    var addItemFormLabelInput = document.querySelector('#addItemForm input[name=label]');

    function addItemInList(payload, metadata) {
        var li = document.createElement('li');
        li.classList.add('list-item-single-line');
        li.innerHTML = itemLiTpl;
        li.querySelector('label .label').textContent = payload.label;
        [].concat.apply([], li.querySelectorAll('input[name=label]')).forEach(function(input) {
            input.value = payload.label;
        });
        li.querySelector('input[name=quantity]').value = payload.quantity;
        li.querySelector('input[name=bought]').checked = payload.bought;
        li.querySelector('input[name=bought]').value = payload.label;
        if (payload.bought) {
            li.classList.add('bought');
        }
        itemsList.appendChild(li);
        if (metadata.appliedOn) {
            addItemFormLabelInput.focus();
        }
    }
    c.on('itemAdded').invoke(addItemInList);

    function removeItemInList(payload, metadata) {
        var children = [].concat.apply([], itemsList.childNodes);
        var lis = children.filter(function(child) {
            return child.querySelector('input[name=label]').value === payload.label;
        }).forEach(function(li) {
            li.parentNode.removeChild(li);
        });
    }
    c.on('itemRemoved').invoke(removeItemInList);

    function clearItemsList(payload, metadata) {
        var children = [].concat.apply([], itemsList.childNodes);
        children.forEach(function(child) {
            itemsList.removeChild(child);
        });
    }
    c.on('itemsCleared').invoke(clearItemsList);

    function updateItemQuantityInList(payload, metadata) {
    }
    c.on('itemQuantityCorrected').invoke(updateItemQuantityInList);

    function markItemBoughtInList(payload, metadata) {
        var children = [].concat.apply([], itemsList.childNodes);
        var lis = children.filter(function(child) {
            return child.querySelector('input[name=label]').value === payload.label;
        }).forEach(function(li) {
            li.classList.add('bought');
        });
    }
    c.on('itemMarkedBought').invoke(markItemBoughtInList);

    function markItemNotBoughtInList(payload, metadata) {
        var children = [].concat.apply([], itemsList.childNodes);
        var lis = children.filter(function(child) {
            return child.querySelector('input[name=label]').value === payload.label;
        }).forEach(function(li) {
            li.classList.remove('bought');
        });
    }
    c.on('itemMarkedNotBought').invoke(markItemNotBoughtInList);

}(this));
