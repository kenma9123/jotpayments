var _jp_AccountView = Backbone.View.extend({
    el: '.account-navigation',
    events: {
        'click #logout': 'logout'
    },
    initialize: function()
    {
        var self = this;

        self.user = {};
        self.retry = 0;

        Backbone.on('call-accountView', function(){
            //console.log("Account View call");
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
            if ( String(user.status).toLowerCase() === 'active' ) {
                self.user = user;

                //apply account info binding
                window.app.bindings.account.set(user.username, user.avatarUrl);
            } else {
                alert("User is not ACTIVE anymore\nPlease contact JotForm!");
            }

            if (next) next();
        }, function(e){
            console.error("Something went wrong when fetching User data with message:", e);
            if (window.console && window.console.log) console.log("retrying...");

            if ( self.retry < 5 ) {
                self.retry++;
                self.handleJFUser(next);
            } else {
                alert("Can't contact JotForm, please try again later.");
            }
        });
    }
});