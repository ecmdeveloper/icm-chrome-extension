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
                for (each in icmPages) {
                    pagesAccordion.append(`<h3>${icmPages[each].title} (${icmPages[each].module})</h3><div id='info_${icmPages[each].id}'></div>`);
                    getPageWidgets(icmPages[each].id);
                    console.log(icmPages[each]);
                }
                //pagesAccordion.accordion("refresh");

                var button;

                for (each in icmPages ) {
                // <div id='page_${icmPages[each].id}'>Page info: </div>    
                //     button = $(document.createElement('button'));
                //     button.text("Widgets")
                //     button.click({param1: icmPages[each].id}, getPageWidgets);
                //     $( `#page_${icmPages[each].id}`).append(button);
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

            for (each in pageWidgets) {
                console.log(pageWidgets[each]);
                // info = $(document.createElement('p'));
                // info.html(pageWidgets[each]);
                $(`#info_${pageId}`).append(pageWidgets[each] + "<br>");
            }
        }
    });
}

$(document).ready(function() {

    $('#loadPages').click(getPages);
    $("#accordion").accordion();

});