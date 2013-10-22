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
        window.app.formView.fetchForms(function(forms){
            console.log(forms);
            var local_data = [];
            for ( var x = 0; x < forms.length; x++ )
            {
                local_data.push({
                    value: forms[x].title,
                    tokens: [forms[x].title],
                    id: forms[x].id
                });
            }                
            var typeahead = $(".form-search .type-ahead").typeahead({
                name: "forms",
                local: local_data,
                template: '<p class="search-results" id="{{id}}"><strong>{{value}}</strong></p>',
                engine: Hogan
            });

            typeahead.on("typeahead:selected", function(evt, data){
                window.app.formView.getPayments(data);
            });

            typeahead.on("typeahead:initialized", function(){
                $(".form-search .tt-hint").width(window.innerWidth);
                $(".form-search .type-ahead").width(window.innerWidth);
                $(".form-search .tt-dropdown-menu").width($(".type-ahead").outerWidth());

                window.app.bindings.formSearch.placeholderVal("Please type your form here");
            });

            window.app.bindings.formSearch = {
                placeholderVal: ko.observable("Loading forms..."),
                show_close: ko.observable(false),
                showClose: function() {
                    this.show_close(true);
                },
                hideClose: function() {
                    this.show_close(false);
                },
                clear: function() {
                    typeahead.val("");
                    $(".form-search .tt-hint").val("");
                }
            };

            ko.applyBindings( window.app.bindings.formSearch, $("#form_search")[0]);
        });
    }
});