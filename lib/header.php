<?php
    
    require_once(__DIR__ . "/init.php");
    
    $header = '
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="keywords" content="jotpayment, payment, history, payment history, history payment, jotform, view payment, jotform payment, jotform history payment" />
        <meta name="description" content="You have a payment form and want to know how much money that form has made you. With this app you\'ll be able to have a better insight of your form." />
        <meta name="google-site-verification" content="CG6F2CQMNJ3nvu1pdPuN7Ww_YcG1-0cMc06ntbB12wk" />
        <meta property="og:title" content="JotPayment History" />
        <meta property="og:description" content="You have a payment form and want to know how much money that form has made you. With this app you\'ll be able to have a better insight of your form." />
        <meta property="og:image" content="http://cms.interlogy.com/uploads/image_upload/image_upload/global/9260_150X150.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="" />
        <meta name="twitter:title" content="" />
        <meta name="twitter:description" content="You have a payment form and want to know how much money that form has made you. With this app you\'ll be able to have a better insight of your form." />
        <meta name="twitter:image" content="http://cms.interlogy.com/uploads/image_upload/image_upload/global/9260_150X150.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="HandheldFriendly" content="true" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <base href="' . HTTP_URL . '" />
    ';

    $styles = '
        <link rel="Shortcut Icon" href="" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/pure.css" type="text/css" media="screen, projection" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/jotpayments-main.css" type="text/css" media="screen, projection" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/font/font-awesome.css" type="text/css" media="screen, projection" />
        <link rel="stylesheet" href="' . HTTP_URL . 'js/lib/ladda/ladda-themeless.css" type="text/css" media="screen, projection" />
    ';

    $jotformFiles = 
    '
    <script type="text/javascript" src="'. ((MODE == 'dev') ?  HTTP_URL . "js/lib/JotForm.js" : "//js.jotform.com/JotForm.js?3.1.{REV}") . '"></script>
    <script type="text/javascript" src="'. ((MODE == 'dev') ?  HTTP_URL . "js/lib/FormPicker.js" : "//js.jotform.com/FormPicker.js?3.1.{REV}") . '"></script>
    ';

    $devscripts =
    '
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/json2.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/jquery.js?v=1.9.1"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/underscore.js?v=1.4.4"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/backbone.js?v=1"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/knockout.js?v=2.3.0"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/knockback.js?v=0.17.2"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/moment.js?v=2.3.1"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/hogan.js?v=2.0.0"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/typeahead.js?v=0.9.3"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/ladda/jquery.ladda.js?v=0.6.0"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/charts/dx.chartjs.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/charts/globalize.js"></script>
    '. $jotformFiles .'
    ';

    $devscripts2 =
    '
    <script type="text/javascript" src="' . HTTP_URL . 'js/lib/tools.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/scripts/ko-bindings.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/scripts/account-view.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/scripts/form-view.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/scripts/property-view.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/scripts/chart-view.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/scripts/main-view.js"></script>
    <script type="text/javascript" src="' . HTTP_URL . 'js/maincore.js"></script>
    ';

    $livescript = '<script type="text/javascript" src="' . HTTP_URL . 'js/scripts-min.js?v3.1{REV}"></script>';

    define("PAGE_HEAD", $header);
    define("PAGE_STYLES", $styles);
    define("PAGE_SCRIPTS", (MODE === "live") ? ($devscripts . $livescript) : ($devscripts . $devscripts2));
    define("PAGE_TITLE", "JotPayment History");

?>