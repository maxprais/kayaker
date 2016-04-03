
if (me.id){
    var len = 6;
    var charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var newPwd = "";
    
for (var i = 0, n = charset.length; i < len; ++i) {
    newPwd += charset.charAt(Math.floor(Math.random() * n));
    }
    
    
dpd.users.put({'id': me.id, 'password': newPwd, 'resetPassword': true}, function (result, error){
    
    var sendgrid = require('sendgrid')('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');
    var email = new sendgrid.Email({
            
    to:       this.email,
    from:     'info@motionize-inc.com',
    subject:  'Your new password',
    text:     'Here is your new password: ' + newPwd + '. '
    });
    sendgrid.send(email, function(err, json) {
        if (err) { return console.error(err); }
        console.log(json);
    });
    });
}
else {
    cancel('You cannot reset your password right now as you are not logged in', 401);
}

