var _jp_AccountView = Backbone.View.extend({
    el: '.account-navigation',
    events: {
        'click #logout': 'logout'
    },
    initialize: function()
    {
        var self = this;

        self.user = {};

        Backbone.on('call-accountView', function(){
            //console.log("Account View call");
            self.handleJFUser();
        });
    },

    logout: function(e)
    {
        var self = this;

        //make a request to logout
        $.ajax({
            url: 'server.php',
            method: 'POST',
            data: {action: 'logout'},
            success: function(response)
            {
                if ( response.success ) {
                    self.removeJFUserData(function(){
                        window.location.href = window.base;
                    });
                }
            },
            error: function(errors)
            {
                //console.log(errors);
                throw new Error("Something went wrong when user is being logout.  " + errors);
            }
        });

        return false;
    },

    handleJFUser: function(next)
    {
        var self = this;
        //get user information from JotForm
        JF.getUser(function(user){
            console.log(user);
            //delete some unecessary data
            delete user['senderEmails'];

            //check if active 
            if ( String(user.status).toLowerCase() === 'active' )
            {
                self.user = user;
            }
            else
            {
                alert("User is not ACTIVE anymore\nPlease contact JotForm!");
            }
        }, function(e){
            console.error("Something went wrong when fetching User data with message:", e);
            if (window.console && window.console.log) console.log("retrying...");
            self.handleJFUser(next);
        });
    }
});