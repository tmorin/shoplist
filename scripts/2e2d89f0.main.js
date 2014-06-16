window.addEventListener("HTMLImportsLoaded",function(){function a(){var a,c;"number"==typeof window.innerWidth?(a=window.innerWidth,c=window.innerHeight):document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)?(a=document.documentElement.clientWidth,c=document.documentElement.clientHeight):document.body&&(document.body.clientWidth||document.body.clientHeight)&&(a=document.body.clientWidth,c=document.body.clientHeight),c&&(b.style.height=c+"px")}var b=document.getElementById("app");window.addEventListener("resize",a),a();var c=document.createElement("sl-app");b.appendChild(c)}),function(){function a(){var a=localStorage.getItem(r);return a?JSON.parse(a):[]}function b(a){var b=JSON.stringify(a||[]);localStorage.setItem(r,b)}function c(a,b){var c=a.filter(function(a){return a.id===b.id});return c.length>-1?c[0]:void 0}function d(){var a=localStorage.getItem(s);return a=a?parseInt(a,0):0,localStorage.setItem(s,++a),"item-"+a}function e(b){var c=a();return b.map(function(a){var b=a.label.trim(),e=c.filter(function(a){return a.label===b})[0];if(e)throw new Error("item already in list: "+b);return{id:d(),label:b,quantity:a.quantity,bought:!1}},this).filter(function(a){return a})}function f(c){var d=a();c.forEach(function(a){d.push({id:a.id,label:a.label,quantity:a.quantity,bought:a.bought})},this),b(d)}function g(b){var d=a();return b.map(function(a){if(!c(d,a))throw new Error("item not in list: "+a.id);return a},this)}function h(){return a().map(function(a){return{id:a.id}},this)}function i(){return a().filter(function(a){return a.bought}).map(function(a){return{id:a.id}})}function j(d){var e=a();d.forEach(function(a){var b=c(e,a),d=e.indexOf(b);e.splice(d,1)}),b(e)}function k(b){var d=a();return b.map(function(a){var b=c(d,a);return b&&b.quantity!=a.quantity?{id:b.id,oldQuantity:b.quantity,newQuantity:a.quantity}:void 0}).filter(function(a){return a})}function l(d){var e=a();d.forEach(function(a){var b=c(e,a);b.quantity=a.newQuantity},this),b(e)}function m(b){var d=a();return b.map(function(a){var b=c(d,a);if(!b)throw new Error("item not in list: "+a.id);return b.bought?void 0:{id:b.id}},this).filter(function(a){return a})}function n(d){var e=a();d.forEach(function(a){var b=c(e,a);b.bought=!0},this),b(e)}function o(b){var d=a();return b.map(function(a){var b=c(d,a);if(!b)throw new Error("item not in list: "+a.id);return b.bought?{id:b.id}:void 0},this).filter(function(a){return a})}function p(d){var e=a();d.forEach(function(a){var b=c(e,a);b.bought=!1},this),b(e)}function q(){return a()}var r="items",s="nextItemId",t=cqrs({owner:"aggregate-item"}),u=t.aggregate("item");u.when("addItems").invoke(e).apply("itemsAdded"),u.on("itemsAdded").invoke(f),u.when("removeItems").invoke(g).apply("itemsRemoved"),u.when("clearItems").invoke(h).apply("itemsRemoved"),u.when("clearBoughtItems").invoke(i).apply("itemsRemoved"),u.on("itemsRemoved").invoke(j),u.when("correctItemsQuantity").invoke(k).apply("itemsQuantityCorrected"),u.on("itemsQuantityCorrected").invoke(l),u.when("markItemsBought").invoke(m).apply("itemsMarkedBought"),u.on("itemsMarkedBought").invoke(n),u.when("markItemsNotBought").invoke(o).apply("itemsMarkedNotBought"),u.on("itemsMarkedNotBought").invoke(p),t.calling("listItems").invoke(q)}(this),function(){function a(){var a=localStorage.getItem(h);return a?JSON.parse(a):[]}function b(a){var b=JSON.stringify(a||[]);localStorage.setItem(h,b)}function c(b){var c=a();return b.map(function(a){return a.trim()},this).filter(function(a){return c.indexOf(a)<0})}function d(c){var d=a();c.forEach(function(a){d.push(a)},this),b(d)}function e(){return a()}function f(c){var d=a();c.forEach(function(a){var b=d.indexOf(a);d.splice(b,1)},this),b(d)}function g(){return a()}var h="suggestions",i=cqrs({owner:"aggregate-suggestion"}),j=i.aggregate("suggestion");j.when("addSuggestions").invoke(c).apply("suggestionsAdded"),j.on("suggestionsAdded").invoke(d),j.when("clearSuggestions").invoke(e).apply("suggestionsRemoved"),j.on("suggestionsRemoved").invoke(f),i.calling("listSuggestions").invoke(g)}(this),function(){function a(a,c){if(c.appliedOn){var d=a.map(function(a){return a.label});b.send("addSuggestions",d,c).then(null,function(a){alert("unable to add a suggestion\n"+a.message),console.warn("unable to add a suggestion"),console.warn(a)})}}var b=cqrs({owner:"component-dispatcher"});b.on("itemsAdded").invoke(a)}(this);