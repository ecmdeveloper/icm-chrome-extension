if( typeof dojo === 'undefined' || require === null ){
    console.log('Sorry no Dojo!');
} else {
    console.log('Got Dojo!');
}    

document.addEventListener("click", function() {
        console.log("Klikje!");
    }, false);
