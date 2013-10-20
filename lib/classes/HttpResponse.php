<?php

Class HttpResponse
{
    public $responseContentType;
    public $callback;

    private $response;

    function __construct($responseContentType = "application/json")
    {
        $this->responseContentType = $responseContentType;
    }

    /**
     * Prompts the request response by given hash
     * adds standard success:true message automatically
     * @param object|string $message Success message you can also pass the all parameters as an array here
     * @param object $addHash [optional] all other parameters to be sent to user as a response
     */
    public function success($message, $addHash = array(), $returnOutput = false)
    {
        $data = array_merge(array(
            'message' => $message,
            'success' => true,
            'code' => 200
        ), $addHash);

        @header("Content-Type: ".$this->responseContentType."; charset=utf-8", true, $data["code"]);

        if ($this->callback) {
            $this->response = $this->callback."(".json_encode($data).");";
        } else {
            $this->response = json_encode($data);
        }

        if (!$returnOutput) {
            echo $this->response;
            exit;
        }

        return $this->response;
    }

    /**
     * Prompts a standard error response, all errors must prompt by this function
     * adds success:false automatically
     * @param object|string $message An error message, you can directly pass all parameters here
     * @param object $addHash[optional] contains the all error parameters will be sent as a response
     */
    public function error($message, $addHash = array(), $returnOutput = false)
    {
        $data = array_merge(array(
            'message' => $message,
            'success' => false,
            'code' => 400
        ), $addHash);

        @header("Content-Type: ".$this->responseContentType."; charset=utf-8", true, $data["code"]);


        if($this->callback) {
            $this->response = $this->callback."(".json_encode($data).");";
        } else {
            $this->response = json_encode($data);
        }

        if (!$returnOutput) {
            echo $this->response;
            exit;
        }

        return $this->response;
    }
}

?>