var isProcessing = false;

var form = function(form)
{
    this.name = ko.observable(form.title);
    this.url = ko.observable(form.url);
    this.id = ko.observable(form.id);
};

var formViewModel = function(formsObj)
{
    var self = this;
    this.forms = ko.observableArray([]);

    for( var x = 0; x < formsObj.length; x++ )
    {
        var formData = {
            id: formsObj[x].id,
            title: formsObj[x].title,
            url: formsObj[x].url
        };

        //push to forms observable
        this.forms.push(new form(formData));
    }

    this.supported_types = [
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

    this.process = function(form)
    {
        if ( !isProcessing )
        {
            var formID = form.id();
            isProcessing = true;
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
                            if ( self.supported_types.indexOf( answerObj.type ) > -1 )
                            {
                                var answer = answerObj.answer;

                                //loop throught answer and check of payment array
                                for ( var z in answer )
                                {
                                    var obj = answer[z];

                                    //check for payment array
                                    if ( z == 'paymentArray' )
                                    {
                                        //parse the json payment array
                                        var payment = JSON.parse(obj);

                                        //add product data, use the index of the selected products
                                        payment['product_data'] = [];
                                        for (var i = 0; i < payment.product.length; i++ )
                                        {
                                            payment['product_info'][i] = product_data[i];
                                        }

                                        //empty now the product_data, to be ready on the next answer
                                        product_data = [];
                                        console.log(payment);
                                    }
                                    else
                                    {
                                        //decode some of the other fields to check names
                                        var others = JSON.parse(obj);
                                        if ( typeof others.name !== 'undefined' )
                                        {
                                            var product = others;
                                            //push this product data
                                            product_data.push(product);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    //after handling submissions, read the form questions
                    //to get information about the products under payment field
                    
                }

                isProcessing = false;
            });
        }
        else
        {
            console.log('still processing');
        }
    };
};

