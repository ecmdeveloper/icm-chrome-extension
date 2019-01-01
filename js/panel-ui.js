let page = document.getElementById('buttonDiv');

function getPages() {

    let pagesAccordion = $( "#accordion" );

    pagesAccordion.empty();

    chrome.devtools.inspectedWindow.eval(
        "$$('.icmPage').map( page => { let dijitPage = dijit.byId(page.id); console.dir(dijitPage); return dijitPage.title + ' (' + dijitPage.moduleName + ')'; } );",
        function(icmPages, isException) {
            debugger;
            if (isException)
            console.log("the page is not using dojo");
            else {
                for (each in icmPages) {
                    pagesAccordion.append(`<h3>${icmPages[each]}</h3><div>This is a page</div>`);
                    console.log(icmPages[each]);
                }
            pagesAccordion.accordion("refresh");
        }
    });
}

$(document).ready(function() {

    $('#loadPages').click(getPages);
    $("#accordion").accordion();

});