<?php
    require_once("lib/header.php");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <?=PAGE_HEAD?>
    <title><?=PAGE_TITLE?></title>
    <?=PAGE_STYLES?>
</head>
<body>
    <div id="application_landing" style="display:none;">
        <div class="slides-background">
            <header id="header">
                <div class="header">
                    <div class="header-content">
                        <a href="/" class="logo-link">
                            <!-- <img src="css/images/jotformDevLogo.png" alt="JotForm Developers"> -->
                        </a>
                    </div>
                </div>
            </header>
            <div class="content-container">
                <div class="content">
                    <div class="banner-area">
                        <div class="banner-content">
                            <div class="title">Show your poll results in a cool way!</div>
                            <div class="banner-text">Want to show some cool poll stuff after a submission? Tired of seeing normal and not so good polls? Now its your time to shine! Show your users a good poll result using your own style. Customize your own polls and let the world of poll change yours. Please look at the **How to** section and how to properly use the application. </div>
                        </div>
                        <div class="visual">
                            <p><img src="css/images/jotpoll.png" alt=""></p>
                        </div>
                        <div class="integrate_btn">
                            <button class="btn btn-large btn-block btn-success" id="integrate_now-btn">Integrate Now!</button>  </div>
                    </div>
                </div>
            </div>
            <footer class="footer" id="footer">
                <div class="tm">
                    <span>Powered by </span>
                    <span><a href="http://www.jotform.com">JotForm</a></span>
                    <span class="app-g"><a href="http://apps.jotform.com">JotForm Apps</a></span>
                </div>
            </footer>
        </div>
    </div>
    <div id="loader" data-bind="visible: show() == true">
        <div class="loader_inner">
            <div id="loader_str">
                <img src="css/images/loading.gif" alt="Loading"/>
                <span data-bind='text: msg'>Loading Application...</span>
            </div>
        </div>
    </div>
    <div class="jotpayment-outer-div">
        <div class="jotpayment-head">
            <div class="pure-menu pure-menu-open pure-menu-horizontal wlogo">
                <a href="#" class="pure-menu-heading"><h1 class="header-logo"><strong><font class="bigJ">J</font>ot</strong>Payment</h1></a>
                <ul>
                    <li class="pure-menu-selected"><a href="#"><i class="fa fa-home"></i>Home</a></li>
                    <li><a href="#"><i class="fa fa-phone"></i>Contact</a></li>
                </ul>
                <div class="account_info">
                    <div class="account-container">
                        <div class="account-div information">
                            <div class="account-info-div name" data-bind="text: username"></div>
                            <div class="account-info-div logout">
                                <a id="logout" href="#" data-bind="click: logout">Logout</a>
                            </div>
                        </div>
                        <div class="account-div image" data-bind="style : {'background-image':avatar()}"></div>
                        <div class="clearer"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-search" id="form_search" data-bind="event: { mouseover: showClose, mouseout: hideClose }">
            <button class="pure-button pure-blue picker-btn ladda-button" data-bind="click: pickform">Pick your Form here</button>
        </div>

        <div class="jotpayment-main-cont">
            <div class="notif-history-content" data-bind="visible: show_msg() == true">
                <h1 class="heading" data-bind="html: msg">No Payment history to display</h1>
            </div>
            <div>
                <div class="jotpayment-content">
                    <div id="total_payments" data-bind="visible: hasValue() == true">
                        <h1 class="heading" data-bind="html: heading"></h1>
                        <h3 class="sub-heading" data-bind="html: total_payments"></h3>
                    </div>
                    <div id="total_payment_other_info">
                        <div class="info-chart charts best_seller segoeUI-font">
                            <div id="best_seller" data-bind="visible: hasValue() == true">
                                <h1 class="heading" data-bind="html: heading"></h1>
                                <h3 class="sub-heading" data-bind="html: name"></h3>
                                <span class="mini-heading" data-bind="html: info"></span>
                            </div>
                        </div>
                        <div class="info-chart charts week_payments">
                            <div id="this_week_payments" data-bind="visible: hasValue() == true">
                                <h1 class="heading" data-bind="html: heading"></h1>
                                <ul data-bind="foreach: days" class="segoeUI-font">
                                    <li class="list">
                                        <label class="labels" data-bind="html: day"></label>
                                        <span class="labels payments" data-bind="html: payment, css: { 'topline': ($parent.days().length - 1) == $index()}"></span>
                                        <div class="clearer"></div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="info-chart charts product_list">
                            <div id="product_list" data-bind="visible: hasValue() == true"> 
                                <h1 class="heading" data-bind="html: heading"></h1>
                                <ul data-bind="foreach: products" class="segoeUI-font products">
                                    <li class="list">
                                        <label class="labels name" data-bind="html: name"></label>
                                        <label class="labels price" data-bind="html: price"></label>
                                        <label class="labels soldCount" data-bind="html: soldCount, css: { 'topline': ($parent.products().length - 1) == $index()}"></label>
                                        <label class="labels soldTotal" data-bind="html: soldTotal, css: { 'topline': ($parent.products().length - 1) == $index()}"></label>
                                        <label class="clearer"></label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="clearer"></div>
                    </div>
                </div>
                <div class="jotpayment-content" id="jotpayment_graph">
                    <div id="range-chart" data-bind="visible: hasValue() == true">
                        <h1 class="heading" data-bind="html: heading"></h1>
                        <div class="range-chart" data-bind="html: charts"></div>
                        <div class="clearer"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="jotpayment-footer">
        <div >
            <p class="infos bignames"><a href="http://www.jotform.com/" title="JotForm - Form builder" alt="jotform" target="_blank">JotForm</a> | <a href="http://jotpayments.jotform.io/" title="JotPayment History" alt="jotpayment" target="_blank">JotPayments </p>
            <p class="infos owner">© 2013 <a href="http://www.google.com/recaptcha/mailhide/d?k=01zXnyZ97-oLOl4pY5AuarnA==&amp;c=-aqY40GERMz4XMdaOID1yIcIk9_F6i3S2ktFRrlTzng=" onclick="window.open('http://www.google.com/recaptcha/mailhide/d?k\07501zXnyZ97-oLOl4pY5AuarnA\75\75\46c\75-aqY40GERMz4XMdaOID1yIcIk9_F6i3S2ktFRrlTzng\075', '', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=300'); return false;" title="Reveal this e-mail address">Kenneth Palaganas</a></p>
        </div>
    </div>

    <?=PAGE_SCRIPTS?>

    <!-- Google Analytics Code -->
    <script type="text/javascript">

          var _gaq = _gaq || [];
          _gaq.push(['_setAccount', 'UA-1170872-7']);
          _gaq.push(['_setDomainName', 'jotform.com']);
          _gaq.push(['_setAllowLinker', true]);
          _gaq.push(['_trackPageview']);

          (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
          })();

     </script>

    <script src="http://cdn.jotfor.ms/static/feedback2.js?3.1.12" type="text/javascript">
        // new JotformFeedback({
        //     formId     : "32124156488960",
        //     buttonText : "Feedbacks",
        //     base       : "http://jotformpro.com/",
        //     background : "#F59202",
        //     fontColor  : "#FFFFFF",
        //     buttonSide : "bottom",
        //     buttonAlign: "right",
        //     type       : false,
        //     width      : 700,
        //     height     : 500
        // });
    </script>
</body>
</html>
