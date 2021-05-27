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
                getStockData(element);
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
            var prevPrice = $("."+element.ticker + " .curprice").html(); 
            // set new price
            $("."+element.ticker + " .curprice").html(formatNumber(curPrice));
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
            $("."+element.ticker + " .value").html(formatNumber(value));
            //update change 
            var change = value - (element.purchasePrice * element.quantity);
            removeColorClass($("."+element.ticker + " .change"));
            $("."+element.ticker + " .change").html(formatNumber(change));
            addColorClass(0, change, $("."+element.ticker + " .change"));
            //update percentage
            var percentage = change/(element.purchasePrice * element.quantity) * 100;
            removeColorClass($("."+element.ticker + " .percentage"));
            $("."+element.ticker + " .percentage").html(formatNumber(percentage));
            addColorClass(0, percentage, $("."+element.ticker + " .percentage"));
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
                '<td>' +
                '<div class="chartHolder"></div>' +
                '</td>'+
                '<td class="curprice">' + formatNumber(curPrice) + '</td>' +
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
    
    function getStockData(element){
        $.ajax({
            type: "post",
            url:  "../php/getChartData.php",
            data: {"ticker": element.ticker, "currency": element.currency, "crypto": element.crypto },
            aysnc: true
        }).done(function(data){
            console.log(data);
            var info = JSON.parse(data);
            var labels = [];
            var dataset = [];
            for(var i = info.length - 1; i >= 0; i--){
                labels.push(info[i]['x']);
                dataset.push(info[i]['y']);
            }
    
            console.log(labels.toString());
            console.log(dataset.toString());
            // send current value to update page
            updateTable(element, dataset[dataset.length-1]);
            // send times and values to make
            updateChart(element, labels, dataset);
        }).fail(function(jqXHR) {console.log("Error: " + jqXHR.status);});
    }

    function updateChart(element, labels, dataset){
        var color = '#bae755';
        // current is less than previous chart goes red
        if(dataset[dataset.length - 1] < dataset[dataset.length - 2]){
            color = '#DC143C';
        }
        // remove everything from chart holder
        $("."+element.ticker + " .chartHolder").html("");
        console.log("remove everything from chart holder");
        // add new canvas to chart holder
        $("."+element.ticker + " .chartHolder").append('<td><canvas class="chart" height=200 width=400><p>Unable to load chart</p></canvas></td>');
        // add chart to canvas
        var ctx = $("."+element.ticker +" .chartHolder"+" .chart");
        new Chart(ctx, {
            
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        borderColor: color,
                        data: dataset,
                        fill: false,
                        cubicInterpolationMode: "monotone",
                        tension: 0.4,
                        
                    }
                ],
            },
            options: {
                elements: {
                    point:{
                        radius: 0
                    }
                },
                plugins: {
                    legend:{
                       display: false,
                       
                    }
                },

                scales: {
                    x: {
                       grid: {
                          display: false,
                          drawBorder: false,
                          drawTicks: false
                       },
                       ticks:{
                            display: false
                       }
                    },
                    y: {
                       grid: {
                          display: false,
                          drawBorder: false,
                          drawTicks: false
                       },
                       ticks:{
                            //display: false
                            color:'rgba(255, 255, 255, 0.75)'
                       }
                    }
               }
            }
        });
    }
    
    // listener to know when all ajax calls are completed so the aggregatedTable can be set
    $(document).ajaxStop(function(){
        setAggregateTable()
    });

    
    
    // every minute check if database has changed.. stocks sold or bought
    getStocks();
    
    // refresh every 15 minutes just to use free api 
    setInterval(function(){
        currentWorth = 0;
        totalCost = 0;
        getStocks();
    }, 900000);

    // every minute generate chart of stocks and get current price... adjust tables values.



});