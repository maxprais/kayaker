'use strict';

var signup = {};

(function (signup) {

    $('.signup').on('click', function () {
        var email = $('#email').val();
        var isNotUnique = signup.checkEmailUnique(email);
        if (isNotUnique){
            var errorMessage = $('<p></p>', {text: 'This email already exists', class: 'error'});
            $('.form').append(errorMessage);
            errorMessage.fadeOut(5000);
        }
        else {
            signup.postData();
        }

    });

    signup.postData = function () {

        var newUser = {
            username: $('#username').val(),
            password: $('#password').val(),
            email: $('#email').val()
        };

        dpd.users.post(newUser, function(result, error){
                if (error){
                    var errorMessage = $('<p></p>', {text: 'Sorry there was an error during signup', class: 'error'});
                    $('.form').append(errorMessage);
                    errorMessage.fadeOut(5000);
                }
                else {
                    location.href = '/index.html'
                }
            })


    };
    
    signup.checkEmailUnique = function (email) {
        
        dpd.users.get({email: email}, function (result, error){
            return (result.length > 0)
        });
        
        
    }

})(signup);