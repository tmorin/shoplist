(function(global) {

    /*
     * localStorage accessors
     */
    var localStorageItemsKey = 'items';

    function loadItems() {
        var json = localStorage.getItem(localStorageItemsKey);
        if (json) {
            return JSON.parse(json);
        }
        return [];
    }

    function storeItems(items) {
        var json = JSON.stringify(items || []);
        localStorage.setItem(localStorageItemsKey, json);
    }

    /*
     * cqrs setup
     */
    var c = cqrs({
        owner: 'aggregate-item'
    });

    var itemAggregate = c.aggregate('item');

    /*
     * addItem and itemAdded
     */
    function handleAddItem(payload, metadata) {
        var label = payload.label.trim();

        var item = loadItems().filter(function(item) {
            return item.label === label;
        })[0];

        if (item) {
            throw new Error('item already in list');
        }

        return {
            label: label,
            quantity: payload.quantity,
            bought: false
        };
    }
    itemAggregate.when('addItem').invoke(handleAddItem).apply('itemAdded');

    function handleItemAdded(payload, metadata) {
        var items = loadItems();

        items.push({
            label: payload.label,
            quantity: payload.quantity,
            bought: payload.bought
        });

        storeItems(items);
    }
    itemAggregate.on('itemAdded').invoke(handleItemAdded);

    /*
     * removeItem and itemRemoved
     */
    function handleRemoveItem(payload, metadata) {
        var label = payload;
        if (payload && payload.label) {
            label = payload.label;
        }

        var item = loadItems().filter(function(item) {
            return item.label === label;
        })[0];

        if (!item) {
            throw new Error('item not in list');
        }

        return {
            label: item.label
        };
    }
    itemAggregate.when('removeItem').invoke(handleRemoveItem).apply('itemRemoved');

    function handleItemRemoved(payload, metadata) {
        var items = loadItems();
        var item = items.filter(function(item) {
            return item.label === payload.label;
        })[0];

        var index = items.indexOf(item);
        items.splice(index, 1);

        storeItems(items);
    }
    itemAggregate.on('itemRemoved').invoke(handleItemRemoved);

    /*
     * clearItems and itemsCleared
     */
    function handleClearItems(payload, metadata) {
        return {
            itemsRemoved: loadItems().length
        };
    }
    itemAggregate.when('clearItems').invoke(handleClearItems).apply('itemsCleared');

    function handleItemsCleared(payload, metadata) {
        storeItems([]);
    }
    itemAggregate.on('itemsCleared').invoke(handleItemsCleared);

    /*
     * correctItemQuantity and itemQuantityCorrected
     */
    function handleCorrectItemQuantity(payload, metadata) {
        var item = loadItems().filter(function(item) {
            return item.label === payload.label;
        })[0];

        if (!item) {
            throw new Error('item not in list');
        }

        if (item.quantity != payload.quantity) {
            return {
                label: item.label,
                oldQuantity: item.quantity,
                newQuantity: payload.quantity
            };
        }
    }
    itemAggregate.when('correctItemQuantity').invoke(handleCorrectItemQuantity).apply('itemQuantityCorrected');

    function handleItemQuantityCorrected(payload, metadata) {
        var items = loadItems();
        var item = items.filter(function(item) {
            return item.label === payload.label;
        })[0];

        item.quantity = payload.newQuantity;

        storeItems(items);
    }
    itemAggregate.on('itemQuantityCorrected').invoke(handleItemQuantityCorrected);

    /*
     * markItemBought && itemMarkedBought
     */
    function handleMarkItemBought(payload, metadata) {
        var label = payload;
        if (payload && payload.label) {
            label = payload.label;
        }

        var item = loadItems().filter(function(item) {
            return item.label === label;
        })[0];

        if (!item) {
            throw new Error('item not in list');
        }

        return {
            label: item.label
        };
    }
    itemAggregate.when('markItemBought').invoke(handleMarkItemBought).apply('itemMarkedBought');

    function handleItemMarkedBought(payload, metadata) {
        var items = loadItems();
        var item = items.filter(function(item) {
            return item.label === payload.label;
        })[0];

        item.bought = true;

        storeItems(items);
    }
    itemAggregate.on('itemMarkedBought').invoke(handleItemMarkedBought);

    /*
     * markItemNotBought && itemMarkedNotBought
     */
    function handleMarkItemNotBought(payload, metadata) {
        var label = payload;
        if (payload && payload.label) {
            label = payload.label;
        }

        var item = loadItems().filter(function(item) {
            return item.label === label;
        })[0];

        if (!item) {
            throw new Error('item not in list');
        }

        return {
            label: item.label
        };
    }
    itemAggregate.when('markItemNotBought').invoke(handleMarkItemNotBought).apply('itemMarkedNotBought');

    function handleItemMarkedNotBought(payload, metadata) {
        var items = loadItems();
        var item = items.filter(function(item) {
            return item.label === payload.label;
        })[0];

        item.bought = false;

        storeItems(items);
    }
    itemAggregate.on('itemMarkedNotBought').invoke(handleItemMarkedNotBought);

    /*
     * listItems
     */
    function listItems() {
        return loadItems();
    }
    c.calling('listItems').invoke(listItems);

}(this));
