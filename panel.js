function constructOptions() {

    let button = document.createElement('button');
    button.innerHTML = "Inspect";
    button.addEventListener('click', function() {
        console.log("Vla");
        chrome.devtools.inspectedWindow.eval(
 //           "inspect($$('.icmPage')[0])",
 //            "$$('.icmPageWidget').map( page => page.id)",
            "$$('.icmPage').map( page => { console.dir(page);dijit.byId(page.id).moduleName; } );",
             function(icmPages, isException) {
                debugger;
               if (isException)
                 console.log("the page is not using dojo");
               else {
                for (each in icmPages) {
                    console.log(icmPages[each].id);
                }
            }
        });
    });
    page.appendChild(button);
}
