$( document ).ready( function(){

    function getStocks(){
        // reset current worth and cost every iteration
        $.ajax({
            type: "post",
            url:  "../php/getStocksOwned.php",
            aysnc: true
        }).done(function(data){
        $("#test").html(data);
        var obj = JSON.parse(data)
        $.each(obj.stocks, function(i, element){
            drawStock(element);
        });
        }).fail(function(jqXHR) {console.log("Error: " + jqXHR.status);});
    }

    function drawStock(element){
        table ='<table class=' + '"' + element.ticker +'">'  +
            '<tr>'+
                '<td class="ticker">' + element.ticker + '</td>' +
                '<td class="quantity">' + element.quantity + '</td>' +
                '<td class="purchasePrice">' + element.purchasePrice + '</td>' +
                '<td class="currency">' + element.currency + '</td>' +
                '<td class="crytpto">' + element.crypto + '</td>' +
                '<td class="button"> <button>Remove Stock</button></td>'
            '</tr>'+
        '</table>';
        $("#main").prepend(table);
       $('.'+element.ticker + " button").on('click', function(){ deleteStock(element.ticker)});
       
       
       
    }

    function deleteStock(ticker){
        $.ajax({
            type: "post",
            url:  "../php/deleteStock.php",
            data: {"ticker": ticker},
            aysnc: true
        }).done(function(data){
            $("#message").html(data);
            $('.'+ticker).remove();
        }).fail(function(jqXHR) {console.log("Error: " + jqXHR.status);});
    }

    getStocks();
    



});