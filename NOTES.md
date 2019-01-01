# Resources

[Extending DevTools](https://developer.chrome.com/extensions/devtools)

[Console API](https://developers.google.com/web/tools/chrome-devtools/console/utilities)

[Insert code into the page context using a content script](https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script/9517879#9517879)

# JavaScript

List all the pages

```javascript
var icmPages = $$('.icmPage');
    for (each in icmPages) {
        console.log(icmPages[each].id);
    }
```
icmPage

```javascript
var pageWidgets = $$('.icmPageWidget');
    for (each in pageWidgets) {
        console.log(pageWidgets[each].id);
    }
```
```javascript
var icmPages = $$('.icmPage');
for (page in icmPages) {
    console.log("===========================================");

    var pageWidget = dijit.byId(icmPages[page].id);
    //console.log(pageWidget.pageTitle);
    dir(pageWidget);

    var pageWidgets = $$('.icmPageWidget', icmPages[page]);
    for (each in pageWidgets) {
        console.log(pageWidgets[each].id);
    }
}
```

```javascript
$$('.icmPage').map( page => dijit.byId(page.id) );

```