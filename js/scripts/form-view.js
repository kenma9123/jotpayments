var _jp_FormView = Backbone.View.extend({

    initialize: function()
    {
        var self = this;

        Backbone.on('call-form-view', function(){

        });

        self.cache = {};
        self.cache.submissions = {};

        //limit per request - default is 1000
        self.maximumRequestLimit = 1000;

        //maximum data to fetch from the server if submission counts is greater than maximumRequestLimit - default 10000
        self.maximumRequest = 10000;

        this.supported_payment_types = [
            'control_dwolla',
            'control_paymill',
            'control_paypal',
            'control_paypalpro',
            'control_stripe',
            'control_authnet',
            'control_googleco',
            'control_2co',
            'control_clickbank',
            'control_worldpay',
            'control_onebip',
            'control_payment'
        ];
    },

    fetchSubmissions: function(form, next)
    {
        var self = this;

        //get data from cache if any to lessen load times
        if ( self.cache.submissions[ form.id ] )
        {
            if (next) next(self.cache.submissions[ form.id ]);
        }
        else
        {
            var maxLimit = self.maximumRequestLimit
              , submissionCount = form.count;

            if ( submissionCount > maxLimit && confirm("Your form had many submissions, this may take a while to process the data.\nPress OK to continue, otherwise load the first 1000 submissions.") )
            {
                self.multipleRequestStart = 1;
                var submissionMultipleAjax = function(formID)
                {
                    console.log("multiple request");
                    var offset = ( ( self.multipleRequestStart - 1 ) * ( maxLimit ) );
                    var totalRequest = Math.ceil( ( submissionCount > self.maximumRequest ? self.maximumRequest : submissionCount ) / maxLimit );

                    // console.log('come n', self.multipleRequestStart, "offset", offset);
                    if ( self.multipleRequestStart <= totalRequest )
                    {
                        // self.misc.modifyLoading(self.multipleRequestStart+"/"+totalRequest);

                        //get data from the server
                        JF.getFormSubmissions(formID, {
                            offset: offset,
                            limit: maxLimit
                        }, function(submission){
                            //increment counter for next request
                            self.multipleRequestStart++;

                            //save data
                            if ( self.cache.submissions[ formID ] )
                            {
                                self.cache.submissions[ formID ] = array_merge( self.cache.submissions[ formID ], submission);
                            }
                            else
                            {
                                self.cache.submissions[ formID ] = submission;
                            }

                            //do another request
                            submissionMultipleAjax(formID);
                        }, function error(){
                            console.log("Something went wrong fetching form submissions");
                        });
                    }
                    else
                    {
                        // console.log("Request reached", self.multipleRequestStart, totalRequest);
                        // console.log("formsubmissionTemp", self.cache.submissions[ form.id ]);
                        if ( next ) next( self.cache.submissions[ form.id ] );
                    }
                };

                //get data in parts
                submissionMultipleAjax(form.id);
            }
            else
            {
                //show loading indicator
                // self.misc.showStart( self._elem.mainContainer_el );

                // console.log('none', submissionCount);
                JF.getFormSubmissions(form.id, {
                    offset: 0,
                    limit: submissionCount
                }, function(submission){
                    console.log(submission);

                    if ( submission.length == 0 ) {
                        console.log("No submissions available to be shown");
                    }

                    self.cache.submissions[ form.id ] = submission;
                    if ( next ) next ( submission );
                }, function error(){
                    console.log("Something went wrong fetching form submissions");
                });
            }
        }
    },

    getPayments: function(form)
    {
        var self = this
          , payments = [];

        if ( !this.isProcessing )
        {
            var product_data = [];

            self.fetchSubmissions(form, function(submissions){
                console.log('submissions', submissions);

                if ( submissions.length > 0 )
                {
                    for ( var x in submissions )
                    {
                        var submission = submissions[x]
                          , answers = submission.answers;

                        //loop through answers and check for payment question only
                        for ( var y in answers )
                        {
                            var answerObj = answers[y];

                            //if the questions type is included to the supported types, select it
                            if ( self.supported_payment_types.indexOf( answerObj.type ) > -1 )
                            {
                                var answer = answerObj.answer;

                                var product_data = [];

                                //loop through answer and check for payment array
                                for ( var z in answer )
                                {
                                    var obj = answer[z];

                                    //decode some of the other fields to check names
                                    var others = JSON.parse(obj);
                                    if ( typeof others.name !== 'undefined' )
                                    {
                                        var product = others;
                                        //push this product data
                                        product_data.push(product);
                                    }

                                    //check for payment array
                                    if ( z == 'paymentArray' )
                                    {
                                        //parse the json payment array
                                        var payment = JSON.parse(obj);

                                        //add product data, use the index of the selected products
                                        for (var i = 0; i < payment.product.length; i++ )
                                        {
                                            payment['product'][i] = {
                                                item: payment['product'][i],
                                                data: product_data[i],
                                                created_at: submission.created_at
                                            };
                                            payment['submission_id'] = submission.id;
                                        }

                                        //empty now the product_data, to be ready on the next answer
                                        product_data = [];
                                        payments.push(payment);
                                    }
                                }
                            }
                        }
                    }

                    //after handling submissions, read the form questions
                    //to get information about the products under payment field

                    console.log(payments);

                    //if no payment fields, return error
                    if ( payments.length < 1 )
                    {
                        window.app.bindings.contentMsg.reset();
                        return false;
                    }

                    window.app.propertyView.fetch(form.id, function(questions){
                        window.app.chartView.info(payments, questions);
                    });
                }

                this.isProcessing = true;
            });
        }
        else
        {
            console.log('still processing');
        }
    }
});