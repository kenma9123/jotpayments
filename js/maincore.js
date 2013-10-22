$(window).load(function(){

    if (
        JF && typeof JF === 'object' &&
        Backbone && typeof Backbone === 'object' &&
        ko && typeof ko === 'object'
    )
    {
        // Extend Backbone with events so we can use custom events
        _.extend(Backbone, Backbone.Events);

        var __jotPayments_core = {};
        Backbone.View.prototype.global = __jotPayments_core;
        Backbone.Model.prototype.global = __jotPayments_core;
        Backbone.Router.prototype.global = __jotPayments_core;


        //objects
        __jotPayments_core.accountView = new _jp_AccountView();
        __jotPayments_core.mainView = new _jp_MainView();
        __jotPayments_core.formView = new _jp_FormView();
        __jotPayments_core.chartView = new _jp_ChartView();
        __jotPayments_core.propertyView = new _jp_PropertyView();

        //main executor
        var _jp_ = function()
        {
            this.handleMenuHeight = function(next)
            {
                $("#user-forms").css({
                    'height': window.innerHeight - $(".jotpayment-head").outerHeight() - $(".user-forms-title").outerHeight() - 40,
                    'overflow': 'scroll'
                });

                $(".charts").height($(".jotpayment-menu").height() / 2);

                if (next) next.call(this);
            };

            this.initJF = function(cb)
            {
                var self = this;

                //init JF
                JF.init({
                    enableCookieAuth : true,
                    appName: "JotPayments",
                    accesType: "readOnly" //default "readOnly" or "full"
                });

                if ( !JF.getAPIKey() )
                {
                    var a = JF.login(
                        function success(){
                            //console.log('success');
                        if(cb) cb.call(self);
                    }, function error(e){
                            //console.log(e);
                            console.error("Error occured!", e);
                        // if(cb) cb.apply(self);
                    });
                }
                else
                {
                    if(cb) cb.call(self);
                }
            };

            this.require = function(req)
            {
                if ( req.length > 0 )
                {
                    for ( x in req )
                    {
                        //console.log('call-' + req[x]);
                        Backbone.trigger('call-' + req[x]);
                    }
                }
            };

            this.init = function()
            {
                var self = this;

                //dynamically update the height of the form list
                $(window).resize(function(){
                    self.handleMenuHeight();
                });

                this.handleMenuHeight(function(){
                    this.initJF(function(){
                        self.require(['accountView', 'main-view']);
                    });
                });
            };
        };

        var mainExec = new _jp_();
            mainExec.init();

        window.base = $('base').attr('href').split(location.origin)[1];
        // Backbone.history.start({pushState: true, root: base});
        // Backbone.history.start();
    }
    else
    {
        console.error("Required Libraries: Backbone OR JotForm API were missing in action");
    }
});

