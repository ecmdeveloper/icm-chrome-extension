let page = document.getElementById('buttonDiv');

// INJECTED CODE, NOT EXECUTED IN THIS CONTEXT

var mapPages = page => { 
    const dijitPage = dijit.byId(page.id); 
    return { 
        title: dijitPage.title, 
        module: dijitPage.moduleName, 
        id: page.id 
    }; 
};

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

var stopDebugging = widget => {
    var properties = dijit.byId(widget.id).widgetProperties;
    if ( properties.payload.startsWith("debugger;")) {
        properties.payload = properties.payload.replace('debugger;','');
    }
};

var getScriptAdapterCode = widget => {
    const properties = dijit.byId(widget.id).widgetProperties;
    if (properties ) return properties.payload;
};

// END OF INJECTED CODE

let fetchCaseManagerPages = () => new Promise( (resolve, reject) => {

    chrome.devtools.inspectedWindow.eval(
        `$$('.icmPage').map( ${mapPages.toString()} );`,
        function(icmPages, isException) {
            if ( isException) reject(isException)
            else resolve(icmPages);
        });    
});

const fetchPageWidgets = pageId => new Promise( (resolve, reject) => {

    chrome.devtools.inspectedWindow.eval(
        `$$('.icmPageWidget', document.getElementById('${pageId}')).map( ${mapPageWidgets.toString()} )`,
        function(pageWidgets, isException) {
            if (isException) reject(isException);
            else resolve({pageWidgets, pageId} )
        });
});

const fetchScriptAdapterCode = widgetId => new Promise( (resolve, reject) => {

    chrome.devtools.inspectedWindow.eval(
        `[document.getElementById('${widgetId}')].map( ${getScriptAdapterCode.toString()} )`,
        function(scriptAdapterCode, isException) {
            if (isException) reject(isException);
            else resolve(scriptAdapterCode[0] )
        });
});

function showPages(icmPages ) {
    const table = $("#items tbody" );
    table.empty();

    for (each in icmPages) {

        var row = `<tr id="row_${icmPages[each].id}">
                    <th width="100%" class="ui-button" style="text-align: left">
                        <i class="fa fa-cubes"></i>
                        <a data-jq-dropdown="#jq-dropdown-1" href="#" id="${icmPages[each].id}">
                            <strong>${icmPages[each].title} (${icmPages[each].module}<strong></a>
                    </th></tr>`;

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
                <td width="100%" style="text-align: left" >
                    <span class="ui-icon ui-icon-blank"/><i class="fa fa-${icon}"></i>&nbsp;
                    <a data-jq-dropdown="#${menu}" id="${pageWidget.id}" href="#">
                    ${pageWidget.id}
                    </a>
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
   
    $("#first-item").on("click", () =>
        chrome.devtools.inspectedWindow.eval(`inspect(document.getElementById("${menuContext}"));`)
    );

    $('#script-adapter-inspect').on("click", () => 
        chrome.devtools.inspectedWindow.eval(`inspect(document.getElementById("${menuContext}"));`)
    );

    $('#script-adapter-edit').on("click", () => {
        fetchScriptAdapterCode(menuContext)
        .then( scriptAdapterCode => {
            $( "#dialog" ).dialog( "open" );
            scriptAdapterEditor.setValue(scriptAdapterCode);
            $( "#dialog" ).dialog( "option", "title", "Script Adapter Editor");
        })
        .catch(error => console.log(error));
    });
    
    $('#start-debug').on("click", () => {
        chrome.devtools.inspectedWindow.eval(`[document.getElementById('${menuContext}')].map( ${startDebugging.toString()})`), 
        (r,e) => {console.log(e);}
    });

    $('#stop-debug').on("click", () => {
        chrome.devtools.inspectedWindow.eval(`[document.getElementById('${menuContext}')].map( ${stopDebugging.toString()})`), 
        (r,e) => {console.log(e);}
    });
   
    var menuContext;

    $('#jq-dropdown-1').on('show', function(event, dropdownData) {
        menuContext = dropdownData.trigger[0].id;
    }).on('hide', function(event, dropdownData) {
    });

    $('#script-adapter-dropdown').on('show', function(event, dropdownData) {
        menuContext = dropdownData.trigger[0].id;
    });

    var scriptAdapterArea = $('.script-adapter-editor')[0];
    var scriptAdapterEditor;
   
    $( "#dialog" ).dialog({
        autoOpen: false,
        dialogClass: "no-close",
        title: "Script Adapter Editor",
        modal: true,
        buttons: [
          {
            text: "OK",
            click: function() {
              $( this ).dialog( "close" );
            }
          }
        ]
    });

    scriptAdapterEditor = CodeMirror.fromTextArea(scriptAdapterArea, {
        lineNumbers: false,
        mode:  "javascript",
    })

    scriptAdapterEditor.on("change", function() {
        if ( $('#dialog').dialog("isOpen") ) {
            $( "#dialog" ).dialog('option', 'title', "Script Adapter Editor - changed");
            console.log("Changed!");
        }
    });

});