$( document ).ready( function(){
    // ensure user is logged in
    $.ajax({
        type: "post",
        url:  "../php/isLoggedIn.php",
        aysnc: true
    }).done(function(data){
        if(data == "false"){
            $('body').hide();
        }
    }).fail(function(jqXHR) {console.log("Error: " + jqXHR.status);});
    
    // get all stocks from data base 
    function getStocks(){
        $.ajax({
            type: "post",
            url:  "../php/getStocksOwned.php",
            aysnc: true
        }).done(function(data){
           
        }).fail(function(jqXHR) {console.log("Error: " + jqXHR.status);});
    }
    // every minute check if database has changed.. stocks sold or bought

    // every minute generate chart of stocks and get current price... adjust tables values.



});