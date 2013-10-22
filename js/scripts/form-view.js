var _jp_FormView = Backbone.View.extend({

    initialize: function()
    {
        var self = this;

        Backbone.on('call-form-view', function(){

        });

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

    /**
     * Fetch forms from the server,
     * and return it back as a backbone collection
     */
    fetchForms: function(next)
    {
        this.getJF_Forms(function(forms){
            console.log('Got forms', forms);
            
            //create model for each forms
            var formsModel = [];
            for( var x = 0; x < forms.length; x++ )
            {
                var model = new Backbone.Model({
                    id: forms[x].id,
                    name: forms[x].title,
                    url: forms[x].url
                });

                //push to model array
                formsModel.push(model);
            }

            var forms_collection = new Backbone.Collection(formsModel);
            if (next) next(forms_collection);
        }); 
    },

    getJF_Forms: function(next)
    {
        var self = this;
        var query = {
            'offset': 0,
            'limit': 100,
            'filter': {status : 'ENABLED'},
            'orderby': 'updated_at',
            'direction': 'DESC'
        };

        JF.getForms(query, function(resp) {
            if ( resp.length > 0 )
            {
                if (next) next(resp);
            }
            else
            {
                alert('No forms detected!');
                return false;
            }
        }, function error(){
            console.error("Something went wrong when fetching rest of your Forms, retying..");
            self.getJF_Forms(next);
        });
    },

    getPayments: function(form)
    {
        var self = this
          , payments = [];

        if ( !this.isProcessing )
        {
            var formID = form.id();
            var product_data = [];

            JF.getFormSubmissions(formID, function(submissions){
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

                    self.global.propertyView.fetch(formID, function(questions){
                        self.global.chartView.info(payments, questions);
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