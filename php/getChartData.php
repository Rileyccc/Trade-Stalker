<?php 
## get historic prices to make a chart using alphpavantage api ## 
$ticker = $_POST['ticker'];
$currency = $_POST['currency'];
$crypto = $_POST['crypto'];
$key = 'L2TV3BK6A2PPCMVG';
    // if crypto use https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=ETH&market=USD&interval=5min&apikey=demo
    // for non crypto use https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo
    if($crypto){
        $service_url = "https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=$ticker&market=$currency&interval=1min&apikey=L2TV3BK6A2PPCMVG";
        
        $curl = curl_init($service_url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $curl_response = curl_exec($curl);

        if ($curl_response === false) {
            $info = curl_getinfo($curl);
            curl_close($curl);
            die('error occured during curl exec. Additioanl info: ' . var_export($info));
        }

        curl_close($curl);
        $decoded = json_decode($curl_response, true);
        if (isset($decoded->response->status) && $decoded->response->status == 'ERROR') {
            die('error occured: ' . $decoded->response->errormessage);
        }
        // output json array  with x: time, y: value 
        $count = 0;
        echo "[";
        foreach($decoded as $innerarray){
            if(!array_key_exists('1. Information', $innerarray)){
                
                foreach($innerarray as $key => $value){
                    if($count>0){
                        echo ",";
                    }
                    echo '{ "x":"'.$key. '", "y":"'. $innerarray[$key]['2. high'] .'"}';
                    $count++;  
                }
            }
        }    
        echo "]";
    
          
        exit();
    }else{
        $service_url ="https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=$ticker&interval=1min&apikey=L2TV3BK6A2PPCMVG";

        $curl = curl_init($service_url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $curl_response = curl_exec($curl);

        if ($curl_response === false) {
            $info = curl_getinfo($curl);
            curl_close($curl);
            die('error occured during curl exec. Additioanl info: ' . var_export($info));
        }

        curl_close($curl);
        $decoded = json_decode($curl_response, true);
        if (isset($decoded->response->status) && $decoded->response->status == 'ERROR') {
            die('error occured: ' . $decoded->response->errormessage);
        }
        // output json array  with x: time, y: value 
        $count = 0;
        echo "[";
        foreach($decoded as $innerarray){
            if(!array_key_exists('1. Information', $innerarray)){
                
                foreach($innerarray as $key => $value){
                    if($count>0){
                        echo ",";
                    }
                    echo '{ "x":"'.$key. '", "y":"'. $innerarray[$key]['2. high'] .'"}';
                    $count++;  
                }
            }
        }    
        echo "]";
    }
?>