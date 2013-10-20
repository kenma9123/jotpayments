<?php

Class JotForm
{
    const JOTFORM_API_URL = 'https://api.jotform.com';
    public static $retry_count = 0;

    private static function handleRetry($response)
    {
        if ( self::$retry_count == 10 )
        {
           // throw new Exception("Unable to connect with JotForm, please try again later. : " . print_r($response, true));
           throw new Exception("Unable to connect with JotForm, please try again later.");
        }

        self::$retry_count++;
    }

    public static function createForm($form, $apiKey)
    {
        $params = array();

        foreach ($form as $key => $value) {
            foreach ($value as $k => $v) {
                if ($key == "properties") {
                    $params[$key."[".$k."]"] = $v;
                } else {
                    foreach ($v as $a => $b) {
                        $params[$key."[".$k."][".$a."]"] = $b;
                    }
                }
            }
        }

        $call_url = sprintf( self::JOTFORM_API_URL . "/user/forms?apiKey=%s", $apiKey);
        $response = Curl::post($call_url, array('params' => $params));

        if ( $response['http_code'] == 200 )
        {
            //pull request content
            $result = json_decode($response['content'], true);
            return $result['content'];
        }
        else
        {
            //retry
            self::handleRetry($response);
            self::createForm($form, $apiKey);
        }
    }

    public static function getForm( $formID, $apiKey )
    {
        //formid with 41143submissions = 13535747232 / 76d37e1b759fcbe67063a39166747301
        $call_url = sprintf( self::JOTFORM_API_URL . "/form/%s?apiKey=%s", $formID, $apiKey);
        $response = Curl::get($call_url);
        $result = false;

        if ( $response['http_code'] == 200 )
        {
            //pull request content
            $result = json_decode($response['content'], true);
            return $result['content'];
        }
        else
        {
            //retry
            self::handleRetry($response);
            self::getForm($formID, $apiKey);
        }
    }

    public static function getSubmissions( $formID, $apiKey, $offset, $maxLimit )
    {
        //formid with 41143submissions = 13535747232 / 76d37e1b759fcbe67063a39166747301
        $call_url = sprintf( self::JOTFORM_API_URL . "/form/%s/submissions?apiKey=%s&offset=%d&limit=%d", (string) $formID, (string) $apiKey, (int) $offset, (int) $maxLimit);
        $response = Curl::get($call_url);
        $result = false;

        if ( $response['http_code'] == 200 )
        {
            //pull request content
            $result = json_decode($response['content'], true);
            return $result;
        }
        else
        {
            //retry
            self::handleRetry($response);
            self::getSubmissions($formID, $apiKey, $offset, $maxLimit);
        }
    }

    public static function getFormQuestion( $formID, $questionID, $apiKey )
    {
        //formid with 41143submissions = 13535747232 / 76d37e1b759fcbe67063a39166747301
        $call_url = sprintf( self::JOTFORM_API_URL . "/form/%s/question/%d?apiKey=%s", (string) $formID, (int) $questionID, (string) $apiKey);
        $response = Curl::get($call_url);
        $result = false;

        if ( $response['http_code'] == 200 )
        {
            //pul request content
            $result = json_decode($response['content'], true);
            return $result['content'];
        }
        else
        {
            //retry
            self::handleRetry($response);
            self::getFormQuestion($formID, $questionID, $apiKey);
        }
    }
}

?>