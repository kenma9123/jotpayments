// We have to extend bacbone to catch each and every URL change
// Because currently we can only catch {trigger: true} URLs
Backbone.History.prototype.navigate = _.wrap(Backbone.History.prototype.navigate, function(){
    // Get arguments as an array
    var args = _.toArray(arguments);
    // firs argument is the original function
    var original = args.shift();
    // Set the before event
    Backbone.history.trigger('before:url-change');
    // Call original function
    var res = original.apply(this, args);
    // After event
    Backbone.history.trigger('url-changed');
    // Return original result
    return res;
});

/**
 * Handles the pushState URL routing of the application
 * @type {Backbone.Router}
 */
var PollRouter = Backbone.Router.extend({
    /**
     * Constructor
     */
    initialize: function(options)
    {
        var self = this;

        // Track URL changes to fix opera bug
        Backbone.history.bind('url-changed', function(){
            // Damn stupid OPERA bug
            // http://my.opera.com/community/forums/topic.dml?id=1185462
            $('base').attr('href', $('base').attr('href'));
        });
    },

    /**
     * List of routes
     * @type {Object}
     */
    routes:
    {
        "" : "home",
        "create" : "createPoll",
        "edit/:poll_id": "editPoll",
        "result/*identifier": "showPollResultsData"
    },

    //handle what type is being taken
    //such as generator[when generating form data",
    //viewer[when viewing poll results directly], normal[the normal use]
    currentType: "",

    /**
     * Initialize JotForm API,
     * @param cb - callback function if successfully initialized jotform
     * @param prompt - whether to prompt login or not
     * @param apiKey - if prompt this will be ignore ( only initialize when viewing results data )
     */
    initJF: function(cb, prompt, apiKey)
    {
        var self = this;

        //init JF
        JF.init({
            enableCookieAuth : true,
            appName: "JotPoll",
            accessType: "full" //default "readOnly" or "full"
        });

        if ( !prompt )
        {
            if (!apiKey) console.error('Api key needed');
            //"1c4efba0d67e0e77aee4dee551b4259f"
            // JF.initialize( {apiKey: "76d37e1b759fcbe67063a39166747301"} );
            JF.initialize({apiKey: apiKey});
            if(cb) cb.apply(self);
        }
        else
        {
            // console.log('key', JF.getAPIKey());
            // JF.initialize( {apiKey: "1c4efba0d67e0e77aee4dee551b4259f"} );/
            // if(cb) cb.apply(self);
            if ( !JF.getAPIKey() )
            {
                var a = JF.login(
                    function success(){
                        // console.log('success');
                    if(cb) cb.apply(self);
                }, function error(e){
                    // console.log(e);
                    $(".alert").show().alert();
                    $("#integrate_now-btn").trigger('click');
                    // if(cb) cb.apply(self);
                });
            }
            else
            {
                if(cb) cb.apply(self);
            }
        }
    },

    require: function(req)
    {
        if ( req.length > 0 )
        {
            for ( x in req )
            {
                // console.log('call-' + req[x]);
                Backbone.trigger('call-' + req[x]);
            }
        }
    },

    addEventLandingPage: function()
    {
        $("#application_landing").show();
        $("#integrate_now-btn").click(function(){
            $(this).parents('#application_landing').slideUp('fast', function(){
                $(this).remove();
                $(".jmain").fadeIn('slow', function(){
                    $('#joyRideTipContent').joyride({
                        autoStart : true,
                        modal:true,
                        cookieMonster: true
                    });
                });
                $(".hero-unit").not('.main').remove();
                $("#updatePreview").trigger('click');
            });
        });
    },

    home: function()
    {
        this.addEventLandingPage();
        
        this.global.accountView = new AccountView();
        this.global.pollDataModel = new PollDataModel();
        this.global.chartOptionsView = new ChartOptionsView();
        this.global.navigatorView = new PollNavigatorView();
        this.global.generateView = new GenerateCodeView();
        this.global.drawChartView = new DrawChartView();

    	// console.log('home');
        this.initJF(function(){
            this.showContainers();
            //require some data
            this.require([
                'accountView','pollDataModel', 'chartPreview', 'chartOptionsView', 
                'pollNavigatorView', 'generateView', 
            ]);
        },true);
    },

    editPoll: function(id)
    {
        console.log(id);
        this.global.accountView = new AccountView();
        this.global.pollDataModel = new PollDataModel();
        this.global.chartOptionsView = new ChartOptionsView();
        this.global.navigatorView = new PollNavigatorView();
        this.global.generateView = new GenerateCodeView();
        this.global.drawChartView = new DrawChartView();

        // console.log('home');
        this.initJF(function(){
            this.showContainers();

                $(".jmain").fadeIn('slow');
                $(".hero-unit").not('.main').remove();
                $(".poll-panel").remove();
                $("#updatePreview").trigger('click');

            //require some data
            this.require([
                'accountView','pollDataModel', 'chartPreview', 'chartOptionsView',
                'pollNavigatorView', 'generateView', 
            ]);
        },true);
    },

    showContainers: function()
    {
        $(".hero-unit").fadeIn();
    },

    createPoll: function()
    {
        this.global.accountView = new AccountView();
        this.global.pollDataModel = new PollDataModel();
        this.global.chartOptionsView = new ChartOptionsView();
        this.global.generateView = new GenerateCodeView();
        this.global.createPoll = new CreatePollView();

        this.initJF(function(){

            this.require(['accountView', 'createPollView']);

            $(".jmain").fadeIn('slow');
            $(".hero-unit").not('.create').remove();

            $("#navigation-bar").find('#home').toggleClass('active');
            $("#navigation-bar").find('#create').toggleClass('active');
        },true);
    },

    showPollResultsData: function(identifier)
    {
        var self = this;
        $('body').height(window.innerHeight);
        $(".jmain").fadeIn('slow');
        $(".hero-unit").not('.view').remove();
        $('body').showLoading();

        this.global.pollDataModel = new PollDataModel();
        this.global.chartOptionsView = new ChartOptionsView();
        this.global.drawChartView = new DrawChartView();
        this.global.resultsView = new PollResultsView();

        //get the data identifier to the database, for options
        $.ajax({
            url: 'server.php',
            type: 'POST',
            data: {
                action: 'getSettings',
                id: identifier
            },
            success: function(response)
            {
                // console.log(response);

                //require some data
                self.require([
                    'pollDataModel', 'drawChart', 'pollResultsView'
                ]);
                
                self.global.resultsView.processPoll(response.poll_settings, response.generated_poll_data);

                $('body').hideLoading();
            },
            error: function(errors)
            {
                console.error(errors);
                if ( IsJsonString(errors.responseText) ) {
                    var error = JSON.parse(errors.responseText);
                    if ( error.success == false ) {
                        alert(error.message);
                        console.error( error.message );
                    }
                }
            }
        });
    }
});