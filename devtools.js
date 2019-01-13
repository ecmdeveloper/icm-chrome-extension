chrome.devtools.inspectedWindow.eval( "!(typeof dojo === 'undefined' || dojo === null )", (hasDojo, isException ) => {

    if ( isException || !hasDojo ) {
        return;
    }

    chrome.devtools.panels.create('Case Manager', 'images/get_started32.png', 'panel.html', function(panel){
        console.log(panel);
    });

    chrome.devtools.panels.elements.createSidebarPane("Widget Properties",
        function(sidebar) {

            chrome.devtools.panels.elements.onSelectionChanged.addListener(function() {

                chrome.devtools.inspectedWindow.eval( "if ($0.id && dijit.byId($0.id)) dijit.byId($0.id).widgetProperties", function(widgetProperties, isException) {
                    if ( isException ) {
                        sidebar.setObject(isException);
                    } else {
                        sidebar.setObject(widgetProperties);
                    }
                });
        });
    });
});