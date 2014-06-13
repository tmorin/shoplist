(function(global) {

    /*
     * localStorage accessors
     */
    var localStorageItemsKey = 'items';
    var localStorageNextItemIdKey = 'nextItemId';

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

    function getNewId() {
        var nextItemId = localStorage.getItem(localStorageNextItemIdKey);
        if (nextItemId) {
            nextItemId = parseInt(nextItemId, 0);
        } else {
            nextItemId = 0;
        }
        localStorage.setItem(localStorageNextItemIdKey, ++nextItemId);
        return 'item-' + nextItemId;
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
            id: getNewId(),
            label: label,
            quantity: payload.quantity,
            bought: false
        };
    }
    itemAggregate.when('addItem').invoke(handleAddItem).apply('itemAdded');

    function handleItemAdded(payload, metadata) {
        var items = loadItems();

        items.push({
            id: payload.id,
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
        var item = loadItems().filter(function(item) {
            return item.id === payload.id;
        })[0];

        if (!item) {
            throw new Error('item not in list');
        }

        return {
            id: item.id
        };
    }
    itemAggregate.when('removeItem').invoke(handleRemoveItem).apply('itemRemoved');

    function handleItemRemoved(payload, metadata) {
        var items = loadItems();
        var item = items.filter(function(item) {
            return item.id === payload.id;
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
     * clearBoughtItems and itemsRemoved
     */
    function handleClearBoughtItems(payload, metadata) {
        var itemIds = loadItems().filter(function(item) {
            return item.bought;
        }).map(function(item) {
            return item.id;
        });
        return {
            itemIds: itemIds
        };
    }
    itemAggregate.when('clearBoughtItems').invoke(handleClearBoughtItems).apply('itemsRemoved');

    function handleItemsRemoved(payload, metadata) {
        var items = loadItems();

        (payload.itemIds || []).forEach(function(id) {
            var item = items.filter(function(item) {
                return item.id === id;
            })[0];

            var index = items.indexOf(item);
            items.splice(index, 1);
        });

        storeItems(items);
    }
    itemAggregate.on('itemsRemoved').invoke(handleItemsRemoved);

    /*
     * correctItemQuantity and itemQuantityCorrected
     */
    function handleCorrectItemQuantity(payload, metadata) {
        var item = loadItems().filter(function(item) {
            return item.id === payload.id;
        })[0];

        if (!item) {
            throw new Error('item not in list');
        }

        if (item.quantity != payload.quantity) {
            return {
                id: item.id,
                oldQuantity: item.quantity,
                newQuantity: payload.quantity
            };
        }
    }
    itemAggregate.when('correctItemQuantity').invoke(handleCorrectItemQuantity).apply('itemQuantityCorrected');

    function handleItemQuantityCorrected(payload, metadata) {
        var items = loadItems();
        var item = items.filter(function(item) {
            return item.id === payload.id;
        })[0];

        item.quantity = payload.newQuantity;

        storeItems(items);
    }
    itemAggregate.on('itemQuantityCorrected').invoke(handleItemQuantityCorrected);

    /*
     * markItemBought && itemMarkedBought
     */
    function handleMarkItemBought(payload, metadata) {
        var item = loadItems().filter(function(item) {
            return item.id === payload.id;
        })[0];

        if (!item) {
            throw new Error('item not in list');
        }

        return {
            id: item.id
        };
    }
    itemAggregate.when('markItemBought').invoke(handleMarkItemBought).apply('itemMarkedBought');

    function handleItemMarkedBought(payload, metadata) {
        var items = loadItems();
        var item = items.filter(function(item) {
            return item.id === payload.id;
        })[0];

        item.bought = true;

        storeItems(items);
    }
    itemAggregate.on('itemMarkedBought').invoke(handleItemMarkedBought);

    /*
     * markItemNotBought && itemMarkedNotBought
     */
    function handleMarkItemNotBought(payload, metadata) {
        var item = loadItems().filter(function(item) {
            return item.id === payload.id;
        })[0];

        if (!item) {
            throw new Error('item not in list');
        }

        return {
            id: item.id
        };
    }
    itemAggregate.when('markItemNotBought').invoke(handleMarkItemNotBought).apply('itemMarkedNotBought');

    function handleItemMarkedNotBought(payload, metadata) {
        var items = loadItems();
        var item = items.filter(function(item) {
            return item.id === payload.id;
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