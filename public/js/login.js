'use strict';

var login = {};

(function () {

    dpd.users.me = (function(user) {
        if (user) {
            location.href = "/welcome.html";
        }
    });

    $('.submit-login').on('click', function () {
        login.userLogin();
    });

    login.userLogin = function () {
        $('.form').submit(function() {
            var username = $('#username').val();
            var password = $('#password').val();

            dpd.users.login({username: username, password: password}, function (session, error) {
                if (error) {
                    var errorMessage = $('<p></p>', {class: 'error', text: 'Your username or password is wrong'});
                    $('.form').append(errorMessage);
                    errorMessage.fadeOut(2000);
                } else {
                    location.href = "/welcome.html";
                }
            });

            return false;
        });
    };


})(login);

