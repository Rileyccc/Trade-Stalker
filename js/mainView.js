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
           $("#test").html(data);
           var obj = JSON.parse(data)
           $.each(obj.stocks, function(i, element){
                getPrice(element);
                // for each element update table 
           });
        }).fail(function(jqXHR) {console.log("Error: " + jqXHR.status);});
    }

    function updateTable(element, curPrice){
        // if table doesn't exist create table with class of ticker name as idenitfier
        if($("."+element.ticker)[0]){
            $('#test').html(element.ticker);
            // remove color from price
            removeColorClass($("."+element.ticker + " .curprice"));
            // record previous price
            var prevPrice = $("."+element.ticker + " .curprice").val(); 
            // set new price
            $("."+element.ticker + " .curprice").html(curPrice);
            // add color based on price change 
            addColorClass(prevPrice, curPrice, $("."+element.ticker + " .curprice"));
            // value color change will be the outcome of the price so change it accordinly
            removeColorClass($("."+element.ticker + " .value"));
            addColorClass(prevPrice, curPrice, $("."+element.ticker + " .value"));
            // update quantity
            $("."+element.ticker + " .quantity").html(element.quantity);
            //update value
            var value = curPrice * element.quantity;
            $("."+element.ticker + " .value").html(value);
            //update change 
            var change = value - (element.purchasePrice * element.quantity);
            removeColorClass($("."+element.ticker + " .change"));
            $("."+element.ticker + " .change").html(change);
            addColorClass(0, change, $("."+element.ticker + " .change"));
            //update percentage
            var percentage = (change/value) * 100;
            removeColorClass($("."+element.ticker + " .percentage"));
            $("."+element.ticker + " .change").html(percentage);
            addColorClass(0, percentage, $("."+element.ticker + " .percentage"));
        // table already exist usdate fields
        }else{
            createTable(element, curPrice);
        }
    }
    function createTable(element, curPrice){
        var value = curPrice * element.quantity;
        var change = value - (element.purchasePrice * element.quantity);
        percentage = (value/100.0) * change
        var table ='' +
        '<table class=' + '"' + element.ticker +'">'  +
            '<tr>' +
                '<td>Chart of '+ element.ticker +':</td>' +
                '<td>Price:</td>' +
                '<td>Quantatity Owned:</td> ' +
                '<td>Value:</td> ' +
                '<td>+/-</td> ' +
                '<td>%</td> ' +
            '</tr>' +
            '<tr>'+
                '<td><img src="https://listimg.pinclipart.com/picdir/s/11-111367_big-image-simple-stock-market-chart-clipart.png" height=150 width=250/></td>' +
                '<td class="curprice">' + curPrice + '</td>' +
                '<td class="quantity">' + element.quantity+ '</td>' +
                '<td class="value">' + value + '</td>' +
                '<td class="change">' + change + '</td>' +
                '<td class="percentage">' + percentage + '</td>' +
            '</tr>'+
        '</table>';
        $("#main").append(table);    
        if(change > 0){
            $("."+element.ticker + ' .change').addClass("green");
        }else{
            $("."+element.ticker + ' .change').addClass("red");
        }
        
        //updateTable();
    }
    // get current price of the stock. 
    function getPrice(element){
        $.ajax({
            type: "post",
            url:  "../php/getPrice.php",
            data: {"ticker": element.ticker, "currency": element.currency, "crypto": element.crypto },
            aysnc: false
        }).done(function(data){
            //currently only works with crypto make getprice.php get any stock price and only return price
            updateTable(element, data);
        }).fail(function(jqXHR) {console.log("Error: " + jqXHR.status);});
    }
    // remove all color classes on rows.
    function removeColorClass(selector){
        if(selector.hasClass('red')){
            selector.removeClass('red');
        }
        if(selector.hasClass('green')){
            selector.removeClass('green');
        }
    }
    // change color if prev > cur make selector red
    // if cur > prev make selector green
    function addColorClass(prev, cur, selector){
        if(prev > cur){
            selector.addClass("red");
        }
        if(prev < cur){
            selector.addClass("green");
        }
    }

    
    
    // every minute check if database has changed.. stocks sold or bought
    getStocks();
    setInterval(getStocks, 60000);

    // every minute generate chart of stocks and get current price... adjust tables values.



});