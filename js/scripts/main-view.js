var _jp_MainView = Backbone.View.extend({

    initialize: function()
    {
        var self = this;
        Backbone.on('call-main-view', function(){
            //console.log('form-view call');
            self.start();
        });
    },

    start: function()
    {
        var self = this;
        this.global.formView.fetchForms(function(formsCollection){
            //used the returned form collection and put it as viewmodel for ko using kb

            var formViewModel = function(formsCollection)
            {
                //attach collection observable
                this.forms = kb.collectionObservable(formsCollection, { view_model: kb.ViewModel });

                //click event for form
                this.process = function(form)
                {
                    self.global.formView.getPayments(form);
                };
            };

            ko.applyBindings(new formViewModel(formsCollection), $("#user-forms")[0]);
        });
    }
});