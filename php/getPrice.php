<?php
## get stocks price from alphavantage api ## 
$ticker = $_POST['ticker'];
$currency = $_POST['currency'];
$crypto = $_POST['crypto'];
$key = 'L2TV3BK6A2PPCMVG';
// check if crypto first
if($crypto){
    $service_url = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=$ticker&to_currency=$currency&apikey=$key";

    $curl = curl_init($service_url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $curl_response = curl_exec($curl);

    if ($curl_response === false) {
        $info = curl_getinfo($curl);
        curl_close($curl);
        die('error occured during curl exec. Additioanl info: ' . var_export($info));
    }

    curl_close($curl);
    $decoded = json_decode($curl_response,true);
    if (isset($decoded->response->status) && $decoded->response->status == 'ERROR') {
        die('error occured: ' . $decoded->response->errormessage);
    }
    // change to only output price
    exit($decoded['Realtime Currency Exchange Rate']['5. Exchange Rate']);
}else{
    $service_url =  "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=$ticker&apikey=$key";
    $curl = curl_init($service_url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $curl_response = curl_exec($curl);

    if ($curl_response === false) {
        $info = curl_getinfo($curl);
        curl_close($curl);
        die('error occured during curl exec. Additioanl info: ' . var_export($info));
    }

    curl_close($curl);
    $decoded = json_decode($curl_response,true);
    if (isset($decoded->response->status) && $decoded->response->status == 'ERROR') {
        die('error occured: ' . $decoded->response->errormessage);
    }
    // change to only output price
    exit($decoded['Global Quote']['05. price']);
}

// if not crypto use this api endpoints https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=WELL&apikey=L2TV3BK6A2PPCMVG
// return price within json.

?>