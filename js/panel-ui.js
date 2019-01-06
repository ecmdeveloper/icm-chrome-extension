let page = document.getElementById('buttonDiv');

function getPages() {

    let pagesAccordion = $( "#accordion" );

    pagesAccordion.empty();

    chrome.devtools.inspectedWindow.eval(
        "$$('.icmPage').map( page => { let dijitPage = dijit.byId(page.id); console.dir(dijitPage); return { title: dijitPage.title, module: dijitPage.moduleName, id: page.id }; } );",
        function(icmPages, isException) {
            if (isException)
                console.log("the page is not using dojo");
            else {

                const table = $("#items tbody" );
                table.empty();

                for (each in icmPages) {

                    var row = `<tr id="row_${icmPages[each].id}">
                                <td width="90%" class="ui-button" style="text-align: left" data-jq-dropdown="#jq-dropdown-1" id="${icmPages[each].id}">
                                    <span class="ui-icon ui-icon-document"/>
                                    <strong>${icmPages[each].title} (${icmPages[each].module}<strong>
                                    <span style="float:right" class="ui-icon  ui-icon-triangle-1-s"></span>
                                </td>
                            </tr>`;

                    table.append(row);
    
                    getPageWidgets(icmPages[each].id);
                    console.log(icmPages[each]);
                }
        }
    });
}

function refreshPageWidgets(event) {
    console.log(event.data.param1);
    getPageWidgets(event.data.param1);
}

function getPageWidgets(pageId) {
    chrome.devtools.inspectedWindow.eval(
        `$$('.icmPageWidget', document.getElementById('${pageId}')).map( widget => widget.id )`,
        function(pageWidgets, isException) {
        if (isException) 
            console.log(isException);
        else {
            var info;

            const table = $("#items tbody" );

            for (each in pageWidgets) {
                console.log(pageWidgets[each]);
                // info = $(document.createElement('p'));
                // info.html(pageWidgets[each]);
                //$(`#info_${pageId}`).append(pageWidgets[each] + "<br>");
            var row = `<tr>
                        <td width="90%" class="ui-button" style="text-align: left" data-jq-dropdown="#jq-dropdown-1" id="${pageWidgets[each]}">
                            <span class="ui-icon ui-icon-blank"></span>${pageWidgets[each]}
                            <span style="float:right" class="ui-icon  ui-icon-triangle-1-s"></span>
                        </td>
                    </tr>`;

                $(`#row_${pageId}`).after(row);
            }
        }
    });
}

$(document).ready(function() {

    $('#loadPages').click(getPages);
    $("#accordion").accordion();
    $( "#menu1" ).menu();
    $( "#menu2" ).menu();

    $("#first-item").on("click", () => { 
        console.log(menuContext);
        chrome.devtools.inspectedWindow.eval(`inspect(document.getElementById("${menuContext}"));`);
    });

    var menuContext;

    $('#jq-dropdown-1').on('show', function(event, dropdownData) {
        menuContext = dropdownData.trigger[0].id;
        console.log(dropdownData);
    }).on('hide', function(event, dropdownData) {
        console.log(dropdownData);
    });
});