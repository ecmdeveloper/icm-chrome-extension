chrome.devtools.panels.create('Case Manager', 'images/get_started32.png', 'panel.html', function(panel){

    console.log(panel);
    // panel.createSidebarPane("My Sidebar",
    // function(sidebar) {
    //     // sidebar initialization code here
    //     sidebar.setObject({ some_data: "Some data to show" });
    // });
});

chrome.devtools.panels.elements.createSidebarPane("My Sidebar",
    function(sidebar) {
        // sidebar initialization code here

        chrome.devtools.inspectedWindow.eval(
//            "$$('.icmPage')",
//             "$$('.icmPageWidget').map( page => page.id)",
//             "$$('.icmPage').map( page => dijit.byId(page.id) )",
             function(icmPages, isException) {
                sidebar.setObject(icmPages);
                }
        );        
});
