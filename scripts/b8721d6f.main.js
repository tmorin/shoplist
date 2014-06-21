!function(){"use strict";window.addEventListener("HTMLImportsLoaded",function(){function a(){var a,c;"number"==typeof window.innerWidth?(a=window.innerWidth,c=window.innerHeight):document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)?(a=document.documentElement.clientWidth,c=document.documentElement.clientHeight):document.body&&(document.body.clientWidth||document.body.clientHeight)&&(a=document.body.clientWidth,c=document.body.clientHeight),c&&(b.style.height=c+"px")}var b=document.getElementById("app");window.addEventListener("resize",a),a();var c=document.createElement("sl-app");b.appendChild(c)})}(),function(a){"use strict";function b(){var a=localStorage.getItem(s);return a?JSON.parse(a):[]}function c(a){var b=JSON.stringify(a||[]);localStorage.setItem(s,b)}function d(a,b){var c=a.filter(function(a){return a.id===b.id});return c.length>-1?c[0]:void 0}function e(){var a=localStorage.getItem(t);return a=a?parseInt(a,0):0,localStorage.setItem(t,++a),"item-"+a}function f(a){var c=b();return a.map(function(a){var b=a.label.trim(),d=c.filter(function(a){return a.label===b})[0];if(d)throw new Error("item already in list: "+b);return{id:e(),label:b,quantity:a.quantity,bought:!1}},this).filter(function(a){return a})}function g(a){var d=b();a.forEach(function(a){d.push({id:a.id,label:a.label,quantity:a.quantity,bought:a.bought})},this),c(d)}function h(a){var c=b();return a.map(function(a){if(!d(c,a))throw new Error("item not in list: "+a.id);return a},this)}function i(){return b().map(function(a){return{id:a.id}},this)}function j(){return b().filter(function(a){return a.bought}).map(function(a){return{id:a.id}})}function k(a){var e=b();a.forEach(function(a){var b=d(e,a),c=e.indexOf(b);e.splice(c,1)}),c(e)}function l(a){var c=b();return a.map(function(a){var b=d(c,a);return b&&parseInt(b.quantity)!==parseInt(a.quantity)?{id:b.id,oldQuantity:b.quantity,newQuantity:a.quantity}:void 0}).filter(function(a){return a})}function m(a){var e=b();a.forEach(function(a){var b=d(e,a);b.quantity=a.newQuantity},this),c(e)}function n(a){var c=b();return a.map(function(a){var b=d(c,a);if(!b)throw new Error("item not in list: "+a.id);return b.bought?void 0:{id:b.id}},this).filter(function(a){return a})}function o(a){var e=b();a.forEach(function(a){var b=d(e,a);b.bought=!0},this),c(e)}function p(a){var c=b();return a.map(function(a){var b=d(c,a);if(!b)throw new Error("item not in list: "+a.id);return b.bought?{id:b.id}:void 0},this).filter(function(a){return a})}function q(a){var e=b();a.forEach(function(a){var b=d(e,a);b.bought=!1},this),c(e)}function r(){return b()}var s="items",t="nextItemId",u=a.cqrs({owner:"aggregate-item"}),v=u.aggregate("item");v.when("addItems").invoke(f).apply("itemsAdded"),v.on("itemsAdded").invoke(g),v.when("removeItems").invoke(h).apply("itemsRemoved"),v.when("clearItems").invoke(i).apply("itemsRemoved"),v.when("clearBoughtItems").invoke(j).apply("itemsRemoved"),v.on("itemsRemoved").invoke(k),v.when("correctItemsQuantity").invoke(l).apply("itemsQuantityCorrected"),v.on("itemsQuantityCorrected").invoke(m),v.when("markItemsBought").invoke(n).apply("itemsMarkedBought"),v.on("itemsMarkedBought").invoke(o),v.when("markItemsNotBought").invoke(p).apply("itemsMarkedNotBought"),v.on("itemsMarkedNotBought").invoke(q),u.calling("listItems").invoke(r)}(this),function(a){"use strict";function b(){var a=localStorage.getItem(i);return a?JSON.parse(a):[]}function c(a){var b=JSON.stringify(a||[]);localStorage.setItem(i,b)}function d(a){var c=b();return a.map(function(a){return a.trim()},this).filter(function(a){return c.indexOf(a)<0})}function e(a){var d=b();a.forEach(function(a){d.push(a)},this),c(d)}function f(){return b()}function g(a){var d=b();a.forEach(function(a){var b=d.indexOf(a);d.splice(b,1)},this),c(d)}function h(){return b()}var i="suggestions",j=a.cqrs({owner:"aggregate-suggestion"}),k=j.aggregate("suggestion");k.when("addSuggestions").invoke(d).apply("suggestionsAdded"),k.on("suggestionsAdded").invoke(e),k.when("clearSuggestions").invoke(f).apply("suggestionsRemoved"),k.on("suggestionsRemoved").invoke(g),j.calling("listSuggestions").invoke(h)}(this),function(a){"use strict";function b(b,d){if(d.appliedOn){var e=b.map(function(a){return a.label});c.send("addSuggestions",e,d).then(null,function(b){a.alert("unable to add a suggestion\n"+b.message),console.warn("unable to add a suggestion"),console.warn(b)})}}var c=a.cqrs({owner:"component-dispatcher"});c.on("itemsAdded").invoke(b)}(this);