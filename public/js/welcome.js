'use strict';

var userHandler = {};

(function (userHandler) {
    var userId;
    var email;
    var username;
    dpd.users.me(function(result, error) {
        console.log(result);
        userId = result['id'];
        email = result['email'];
        username = result['username'];
        $('.username-val').text(username);
    });


    $('#logout').on('click', function () {
        userHandler.logout();
    });

    userHandler.logout = function () {
        dpd.users.logout(function(result, error) {
            if (error) {
                var errorMessage = $('<p></p>', {text: 'Sorry there was an error logging out', class: 'error'});
                $('.server-message').append(errorMessage);
                errorMessage.fadeOut(2000);
            }
            else {
                location.href = '/index.html';
            }
        });
    };

    $('#change-pwd').on('click', function () {
        dpd.users.put(userId, function (result, error) {
            if (error){
                var errorMessage = $('<p></p>', {text: 'Sorry there was an error while changing your password', class: 'error'});
                $('.server-message').append(errorMessage);
                errorMessage.fadeOut(2000);
            }
             else {
                var successMessage = $('<p></p>', {text: 'Your password has been changed', class: 'success'});
                $('.server-message').append(successMessage);
                successMessage.fadeOut(2000);
            }
        });

    });

})(userHandler);

var sessionReport = {};

(function (sessionReport) {

    $('.submit-session').on('click', function () {
        $('.session-holder').removeClass('hide');
        sessionReport.addNew();
    });

    var location = {};

    sessionReport.addNew = function () {
        var newSessionArr = [];
        sessionReport.getLocation();
        console.log(location);
        var newSession = {
            User: $('.username-val').text(),
            start: $('#session-start').val(),
            length: $('#session-length').val(),
            distance: $('#session-distance').val(),
            GPSLocation: {
                lat: location['lat'],
                long: location['long']
            }
        };

        dpd.session.post(newSession, function(result, error){
            if (error){
                var errorMessage = $('<p></p>', {text: 'Sorry there was an error', class: 'error'});
                $('.server-message').append(errorMessage);
                errorMessage.fadeOut(2000);
            }
            else {
                var successMessage = $('<p></p>', {text: 'Your session has been saved', class: 'success'});
                $('.server-message').append(successMessage);
                successMessage.fadeOut(2000);
            }

        });
        newSessionArr.push(newSession);
        sessionReport.sortPastResult(newSessionArr);
    };

    sessionReport.getLocation = function () {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            var innerHTML = "Geolocation is not supported by this browser.";
            $('body').append(innerHTML);
        }

    };

    function showPosition (position) {
        location =  {
            lat: position.coords.latitude,
            long: position.coords.longitude
        };
    }


    sessionReport.getPast = function () {
        dpd.session.get(function (result, error) {
            console.log(result);
            sessionReport.sortPastResult(result);

        })
    };
    var idArr = [];
    var sessionCounter = 0;
    sessionReport.sortPastResult = function (sessions) {

        $.each(sessions, function (i, v) {

            var col = $('<div></div>', {id: 'session' + sessionCounter, class: 'col-md-3'});
            $('.session-cont').append(col);
            var cont = $('<div></div>', {class: 'reportHolder'});
            col.append(cont);
            //remember to try console logging the v information
            var sessionUser = $('<h3></h3>', {text: 'User: ' + v['User']});
            var sessionStart = $('<p></p>', {text: 'Start: ' + v['start']});
            var sessionLength = $('<p></p>', {text: 'Length ' + (v['length'] * 60) + ' seconds'});
            var sessionDistance = $('<p></p>', {text: 'Distance ' + v['distance'] + ' meters'});
            var GPS = $('<p></p>', {text: 'Lat: ' + v['GPSLocation']['lat'] + ', Long: ' + v['GPSLocation']['long']});
            var del = $('<i></i>', {id: 'del-btn' + sessionCounter, onclick:'sessionReport.deleteSession(event)', class: 'fa fa-times delete clickable'});

            var sessionId = new SessionID('del-btn' + sessionCounter, v['id']);
            idArr.push(sessionId);

            cont.append(sessionUser, sessionStart, sessionDistance, sessionLength, GPS, del);
            sessionCounter++;
        });
    };

    function SessionID (DomID, DbId) {
        this.DomID = DomID;
        this.DbId = DbId;
    }

    sessionReport.deleteSession = function (event) {
        var e = event.currentTarget;
        var idToDel;
        $.each(idArr, function (i, v) {
            if (v['DomID'] === e.id){
                idToDel = v['DbId'];
                console.log(idToDel);
            }

        });
        dpd.session.del(idToDel, function (result, error) {
            if (error) {
                var errorMessage = $('<p></p>', {text: 'Sorry there was an error when deleting this session', class: 'error'});
                $('.form').append(errorMessage);
                errorMessage.fadeOut(2000);
            }

        });
        $(e).parent().remove();
    };

    $('.arrow').on('click', function () {
        $('.session-holder').toggleClass('hide');
    })



})(sessionReport);



$(sessionReport.getPast());