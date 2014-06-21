(function(global) {

    'use strict';

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

    function findEntryInList(list, entry) {
        var result = list.filter(function(i) {
            return i.id === entry.id;
        });
        if (result.length > -1) {
            return result[0];
        }
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
    var c = global.cqrs({
        owner: 'aggregate-item'
    });

    var itemAggregate = c.aggregate('item');

    /*
     * Add items
     */
    function handleAddItems(payload, metadata) {
        var items = loadItems();
        return payload.map(function(entry) {
            var label = entry.label.trim();

            var item = items.filter(function(item) {
                return item.label === label;
            })[0];

            if (item) {
                throw new Error('item already in list: ' + label);
            }

            return {
                id: getNewId(),
                label: label,
                quantity: entry.quantity,
                bought: false
            };
        }, this).filter(function(value) {
            return value;
        });
    }
    itemAggregate.when('addItems').invoke(handleAddItems).apply('itemsAdded');

    function handleItemsAdded(payload, metadata) {
        var items = loadItems();

        payload.forEach(function(item) {
            items.push({
                id: item.id,
                label: item.label,
                quantity: item.quantity,
                bought: item.bought
            });
        }, this);

        storeItems(items);
    }
    itemAggregate.on('itemsAdded').invoke(handleItemsAdded);

    /*
     * Remove items
     */
    function handleRemoveItems(payload, metadata) {
        var items = loadItems();

        return payload.map(function(entry) {
            if (!findEntryInList(items, entry)) {
                throw new Error('item not in list: ' + entry.id);
            }
            return entry;
        }, this);
    }
    itemAggregate.when('removeItems').invoke(handleRemoveItems).apply('itemsRemoved');

    function handleClearItems(payload, metadata) {
        return loadItems().map(function(item) {
            return {
                id: item.id
            };
        }, this);
    }
    itemAggregate.when('clearItems').invoke(handleClearItems).apply('itemsRemoved');

    function handleClearBoughtItems(payload, metadata) {
        return loadItems().filter(function(item) {
            return item.bought;
        }).map(function(item) {
            return {
                id: item.id
            };
        });
    }
    itemAggregate.when('clearBoughtItems').invoke(handleClearBoughtItems).apply('itemsRemoved');

    function handleItemsRemoved(payload, metadata) {
        var items = loadItems();

        payload.forEach(function(entry) {
            var item = findEntryInList(items, entry);
            var index = items.indexOf(item);
            items.splice(index, 1);
        });

        storeItems(items);
    }
    itemAggregate.on('itemsRemoved').invoke(handleItemsRemoved);

    /*
     * Change quantity
     */
    function handleCorrectItemsQuantity(payload, metadata) {
        var items = loadItems();

        return payload.map(function(entry) {
            var item = findEntryInList(items, entry);
            if (item) {
                if (parseInt(item.quantity) !== parseInt(entry.quantity)) {
                    return {
                        id: item.id,
                        oldQuantity: item.quantity,
                        newQuantity: entry.quantity
                    };
                }
            }
        }).filter(function(item) {
            return item;
        });
    }
    itemAggregate.when('correctItemsQuantity').invoke(handleCorrectItemsQuantity).apply('itemsQuantityCorrected');

    function handleItemsQuantityCorrected(payload, metadata) {
        var items = loadItems();

        payload.forEach(function(entry) {
            var item = findEntryInList(items, entry);
            item.quantity = entry.newQuantity;
        }, this);

        storeItems(items);
    }
    itemAggregate.on('itemsQuantityCorrected').invoke(handleItemsQuantityCorrected);

    /*
     * Mark bought
     */
    function handleMarkItemsBought(payload, metadata) {
        var items = loadItems();
        return payload.map(function(entry) {
            var item = findEntryInList(items, entry);
            if (!item) {
                throw new Error('item not in list: ' + entry.id);
            }
            if (!item.bought) {
                return {
                    id: item.id
                };
            }
        }, this).filter(function(value) {
            return value;
        });
    }
    itemAggregate.when('markItemsBought').invoke(handleMarkItemsBought).apply('itemsMarkedBought');

    function handleItemsMarkedBought(payload, metadata) {
        var items = loadItems();
        payload.forEach(function(entry) {
            var item = findEntryInList(items, entry);
            item.bought = true;
        }, this);
        storeItems(items);
    }
    itemAggregate.on('itemsMarkedBought').invoke(handleItemsMarkedBought);

    /*
     * *Mark not bought
     */
    function handleMarkItemsNotBought(payload, metadata) {
        var items = loadItems();
        return payload.map(function(entry) {
            var item = findEntryInList(items, entry);
            if (!item) {
                throw new Error('item not in list: ' + entry.id);
            }
            if (item.bought) {
                return {
                    id: item.id
                };
            }
        }, this).filter(function(value) {
            return value;
        });
    }
    itemAggregate.when('markItemsNotBought').invoke(handleMarkItemsNotBought).apply('itemsMarkedNotBought');

    function handleItemsMarkedNotBought(payload, metadata) {
        var items = loadItems();
        payload.forEach(function(entry) {
            var item = findEntryInList(items, entry);
            item.bought = false;
        }, this);
        storeItems(items);
    }
    itemAggregate.on('itemsMarkedNotBought').invoke(handleItemsMarkedNotBought);

    /*
     * List items
     */
    function listItems() {
        return loadItems();
    }
    c.calling('listItems').invoke(listItems);

}(this));
