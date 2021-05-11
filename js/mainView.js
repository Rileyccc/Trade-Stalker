$( document ).ready( function(){
    var currentWorth = 0;
    var totalCost = 0;


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
        // reset current worth and cost every iteration
        $.ajax({
            type: "post",
            url:  "../php/getStocksOwned.php",
            aysnc: true
        }).done(function(data){
           $("#test").html(data);
           var obj = JSON.parse(data)
           $.each(obj.stocks, function(i, element){
                totalCost += element.purchasePrice * element.quantity;
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
            // update quantity cryptos can have part shares
            if(element.crypto == 1){
                $("."+element.ticker + " .quantity").html(element.quantity);
            }else{
                $("."+element.ticker + " .quantity").html(parseFloat(element.quantity).toFixed(0));
            }
            //update value
            var value = curPrice * element.quantity;
            currentWorth += value;
            $("."+element.ticker + " .value").html(value);
            //update change 
            var change = value - (element.purchasePrice * element.quantity);
            removeColorClass($("."+element.ticker + " .change"));
            $("."+element.ticker + " .change").html(change);
            addColorClass(0, change, $("."+element.ticker + " .change"));
            //update percentage
            var percentage = (((element.purchasePrice * element.quantity)/value)) * 100;
            removeColorClass($("."+element.ticker + " .percentage"));
            $("."+element.ticker + " .change").html(percentage);
            addColorClass(0.01, percentage, $("."+element.ticker + " .percentage"));
        // table already exist usdate fields
        }else{
            createTable(element, curPrice);
        }
    }
    function createTable(element, curPrice){
        var value = formatNumber(curPrice * element.quantity);
        currentWorth += curPrice * element.quantity;
        var change = formatNumber(value - (element.purchasePrice * element.quantity));
        percentage = formatNumber((change/(element.purchasePrice * element.quantity)) * 100);
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
                '<td class="quantity">' + ( element.crypto == '1'?  element.quantity: parseFloat(element.quantity).toFixed(0)) + '</td>' +
                '<td class="value">' + value + '</td>' +
                '<td class="change">' + change + '</td>' +
                '<td class="percentage">' + percentage + '</td>' +
            '</tr>'+
        '</table>';
        $("#main").prepend(table);    
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
            updateTable(element, formatNumber(data));
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
    // returns float with only 2 decimal places
    function formatNumber(num){
        return parseFloat(num).toFixed(2);
    }
    function setAggregateTable(){
        // todo add chart
        $(".cost").html(formatNumber(totalCost));

        // set current worth
        $(".worth").html(formatNumber(currentWorth));
        // remove color classes
        removeColorClass($(".worth"))
        // add colour class 
        addColorClass(totalCost, currentWorth, $(".worth"));
        
        var profolioChange = currentWorth-totalCost;
        // set current change in profolio worth
        $(".profolioChange").html(formatNumber(profolioChange));
        // remove color classes
        removeColorClass($(".profolioChange"));
        // add colour class 
        addColorClass(0, profolioChange, $(".profolioChange"));

        // set current change in percentage of profolio change
        $(".profolioPercentage").html(formatNumber(((profolioChange)/totalCost)*100));
        // remove color classes
        removeColorClass($(".profolioPercentage"));
        // add colour class 
        addColorClass(0, profolioChange, $(".profolioPercentage"));
    }

    // listener to know when all ajax calls are completed so the aggregatedTable can be set
    $(document).ajaxStop(function(){
        setAggregateTable()
    });

    
    
    // every minute check if database has changed.. stocks sold or bought
    getStocks();
    
    setInterval(getStocks, 60000);

    // every minute generate chart of stocks and get current price... adjust tables values.



});