var _jp_PropertyView = Backbone.View.extend({

    initialize: function()
    {

    },

    fetch: function(formID, next)
    {
        JF.getFormProperties(formID, function(response){
            if (next) next(response);
        }, function(){
            console.error("Error occured when fetching questions property");
        });
    }
});