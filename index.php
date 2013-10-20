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
                            <img src="css/images/jotformDevLogo.png" alt="JotForm Developers">
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

    <div class="jotpayment-outer-div">
        <div class="jotpayment-head">
            <div class="pure-menu pure-menu-open pure-menu-horizontal">
                <a href="#" class="pure-menu-heading"><h1>JotPayments</h1></a>
                <ul>
                    <li class="pure-menu-selected"><a href="#">Home</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </div>
        <div class="table jotpayment-main-cont">
            <div class="table-row">
                <div class="left-cell jotpayment-menu">
                    <div class="pure-menu pure-menu-open">
                        <a class="pure-menu-heading user-forms-title">Your Forms</a>
                        <ul id="user-forms" data-bind="foreach: forms">
                            <li data-bind="attr: {id: id}">
                                <a href="#" data-bind="text: name, attr: {href: url, title: name}, click: $parent.process">Loading forms...</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="middle-cell jotpayment-content">
                    <div class="info-chart charts">
                        <div id="total_payments" data-bind="visible: (typeof total_payments != 'undefined')">
                            <h1 class="heading" data-bind="text: heading"></h1>
                            <h3 class="sub-heading" data-bind="text: total_payments"></h3>
                        </div>
                        <div id="this_week_payments" data-bind="visible: days().length > 0" style="margin-top: 50px;">
                            <h1 class="heading" data-bind="text: heading"></h1>
                            <ul data-bind="foreach: days" class="segoeUI-font">
                                <li class="list">
                                    <label class="labels" data-bind="text: day"></label>
                                    <span class="labels payments" data-bind="text: payment"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="info-chart charts">
                        <div id="best_seller">
                            <h1 class="heading" data-bind="text: heading"></h1>
                            <h3 class="sub-heading" data-bind="text: bestSeller"></h3>
                            <span class="mini-heading" data-bind="text: price"></span>
                        </div>
                        <div style="margin-top: 30px;"> 
                            <h1 class="heading">Product List</h1>
                            <ul data-bind="foreach: days" class="segoeUI-font products">
                                <li class="list">
                                    <label class="labels name">Name</label>
                                    <label class="labels price">Price</label>
                                    <label class="labels sold">Sold</label>
                                </li>
                                <li class="list">
                                    <label class="labels name">Name</label>
                                    <label class="labels price">Price</label>
                                    <label class="labels sold">Sold</label>
                                </li>
                                <li class="list">
                                    <label class="labels name">Name</label>
                                    <label class="labels price">Price</label>
                                    <label class="labels sold">Sold</label>
                                </li>
                                <li class="list">
                                    <label class="labels name">Name</label>
                                    <label class="labels price">Price</label>
                                    <label class="labels sold">Sold</label>
                                </li>
                                <li class="list">
                                    <label class="labels name">Name</label>
                                    <label class="labels price">Price</label>
                                    <label class="labels sold">Sold</label>
                                </li>
                                <li class="list">
                                    <label class="labels name">Name</label>
                                    <label class="labels price">Price</label>
                                    <label class="labels sold">Sold</label>
                                </li>
                                <li class="list">
                                    <label class="labels name">Name</label>
                                    <label class="labels price">Price</label>
                                    <label class="labels sold">Sold</label>
                                </li>
                                <li class="list">
                                    <label class="labels name">Name</label>
                                    <label class="labels price">Price</label>
                                    <label class="labels sold">Sold</label>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>

                <div class="right-cell jotpayment-side">

                </div>

            </div>
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
