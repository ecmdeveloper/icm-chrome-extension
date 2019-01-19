let page = document.getElementById('buttonDiv');

// INJECTED CODE, NOT EXECUTED IN THIS CONTEXT

var mapPageWidgets = widget => { 
    var properties = dijit.byId(widget.id).widgetProperties;
    return {
        id: widget.id,
        isScriptAdapter: typeof properties.payload != 'undefined' && typeof properties.showScriptText !== 'undefined'
    } 
};

var startDebugging = widget => {
    var properties = dijit.byId(widget.id).widgetProperties;
    if ( ! properties.payload.startsWith("debugger;")) {
        properties.payload = 'debugger;' + properties.payload;
    }
};

// END OF INJECTED CODE

let fetchCaseManagerPages = () => {return new Promise( (resolve, reject) => {

    chrome.devtools.inspectedWindow.eval(
        "$$('.icmPage').map( page => { let dijitPage = dijit.byId(page.id); console.dir(dijitPage); return { title: dijitPage.title, module: dijitPage.moduleName, id: page.id }; } );",
        function(icmPages, isException) {
            if ( isException) reject(isException)
            else resolve(icmPages);
        });    
})};

const fetchPageWidgets = pageId => new Promise( (resolve, reject) => {

    chrome.devtools.inspectedWindow.eval(
        `$$('.icmPageWidget', document.getElementById('${pageId}')).map( ${mapPageWidgets.toString()} )`,
        function(pageWidgets, isException) {
            if (isException) reject(isException);
            else resolve({pageWidgets, pageId} )
        });
});

function showPages(icmPages ) {
    const table = $("#items tbody" );
    table.empty();

    for (each in icmPages) {

        var row = `<tr id="row_${icmPages[each].id}">
                    <td width="90%" class="ui-button" style="text-align: left" data-jq-dropdown="#jq-dropdown-1" id="${icmPages[each].id}">
                        <i class="fa fa-cubes"></i>
                        <strong>${icmPages[each].title} (${icmPages[each].module}<strong>
                        <span style="float:right" class="ui-icon  ui-icon-triangle-1-s"></span>
                    </td>
                </tr>`;

        table.append(row);

        fetchPageWidgets(icmPages[each].id)
            .then(showWidgets)
            .catch( error => console.log(error) );
    }
}

function showWidgets(widgets) {

    var {pageWidgets, pageId} = widgets;

    for (each in pageWidgets) {
        showWidget(pageWidgets[each], pageId);
    }
}

function showWidget(pageWidget, pageId ) {

    var icon = pageWidget.isScriptAdapter ? 'gears': 'cube';
    var menu = pageWidget.isScriptAdapter ? 'script-adapter-dropdown' : 'jq-dropdown-1';

    var row = `<tr>
                <td width="90%" class="ui-button" style="text-align: left" data-jq-dropdown="#${menu}" id="${pageWidget.id}">
                    <span class="ui-icon ui-icon-blank"/><i class="fa fa-${icon}"></i>&nbsp;${pageWidget.id}
                    <span style="float:right" class="ui-icon  ui-icon-triangle-1-s"></span>
                </td>
            </tr>`;

    $(`#row_${pageId}`).after(row);
}

function refreshPageWidgets(event) {
    getPageWidgets(event.data.param1);
}

function loadPages() {
    fetchCaseManagerPages()
        .then( showPages )
        .catch(error => console.log(error));
}

$(document).ready(function() {

    loadPages();

    $('#loadPages').click(loadPages);

    $("#accordion").accordion();
    $( "#menu1" ).menu();
    $( "#menu2" ).menu();

    $("#first-item").on("click", () =>
        chrome.devtools.inspectedWindow.eval(`inspect(document.getElementById("${menuContext}"));`)
    );

    $('#script-adapter-inspect').on("click", () => 
        chrome.devtools.inspectedWindow.eval(`inspect(document.getElementById("${menuContext}"));`)
    );

    $('#start-debug').on("click", () => 
        chrome.devtools.inspectedWindow.eval(`[document.getElementById('${menuContext}')].map( ${startDebugging.toString()})`)
        //, 
        // (r,e) => {
        //     debugger;
        //     console.log(e);
        // }
    );

    var menuContext;

    $('#jq-dropdown-1').on('show', function(event, dropdownData) {
        menuContext = dropdownData.trigger[0].id;
    }).on('hide', function(event, dropdownData) {
    });

    $('#script-adapter-dropdown').on('show', function(event, dropdownData) {
        menuContext = dropdownData.trigger[0].id;
    });

});