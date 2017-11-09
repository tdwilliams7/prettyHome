var grocList = angular.module('grocList', []);
var time;

function displayGrocList($scope, $http) {
    $scope.formData = {};

    $http.get('/foods')
        .success(function(data){
            $scope.foods = data;
        })
        .error(function(data){
            console.log('Error: ' + data);
        });
}

function clock(){
    let clockEl = document.getElementById('clock');
    time = new Date;
    let mins = time.getMinutes();
    let hours = time.getHours();
    let day = time.getDay();
    if (mins < 10){
        mins = '0' + mins;
    }
    if (hours > 12){
        hours = hours - 12;
    }
    clockEl.textContent = hours + ':' + mins ;
}
clock();
setInterval(clock, 1000);

//weather
function weather(){
    var elTemp = document.getElementById('temp');
    var elFeels = document.getElementById('feels');
    var iconCurrent = document.getElementById('icon');
    var fore = document.getElementById('forecast');
    var geolat;
    var geolon;
    if (Modernizr.geolocation){
        var position = navigator.geolocation.getCurrentPosition(success, fail);
        elTemp.textContent = 'Checking Location...';
    } else {
        elTemp.textContent = 'failed';
    }
    function success(position){
        geolat = position.coords.latitude;
        geolon = position.coords.longitude;
        var weather = 'https://api.darksky.net/forecast/391d7c57b9412748b10093f94c3aac8e/' + geolat +',' + geolon;
        console.log(weather);
        $.ajax({
            url: weather,
            dataType: 'jsonp',
            success: function(data){
                var temp = Math.round(data.currently.temperature);
                var feels = Math.round(data.currently.apparentTemperature);
                var icon = data.currently.icon;

                elTemp.textContent = temp + '°';
                elFeels.textContent = 'feels like ' + feels + '°';
                console.log(icon);
                //set icons probably move this to own function to call for each day.
                if ( icon === 'partly-cloudy-day'){
                    iconCurrent.innerHTML = '<i class="wi wi-day-sunny-overcast"></i>';
                } else if (icon === 'clear-day') {
                    iconCurrent.innerHTML = '<i class="wi wi-day-sunny"></i>';
                }

                //3 day forecast
                fore.innerHTML = `<div class='row'><div class="col-xs-2">` + time.getMonth() + '/' + (time.getDate() + 1) + `</div>
                <div class="col-xs-1"></div>
                <div class=" col-xs-1">` + Math.round(data.daily.data[1].temperatureLow) + `</div>
                <div class=" col-xs-1"></div>
                <div class=" col-xs-1">` + Math.round(data.daily.data[1].temperatureHigh) + `</div>
                <div class=" col-xs-1"></div>
                <div class="col-xs-2">` + (data.daily.data[1].precipProbability * 100).toFixed(0) + '%' + `</div></div>
                <div class='row'><div class="col-sm-2">` + time.getMonth() + '/' + (time.getDate() + 2) + `</div>
                <div class="col-sm-1"></div>
                <div class=" col-sm-1">` + Math.round(data.daily.data[2].temperatureLow) + `</div>
                <div class=" col-sm-1"></div>
                <div class=" col-sm-1">` + Math.round(data.daily.data[2].temperatureHigh) + `</div>
                <div class=" col-sm-1"></div>
                <div class="col-sm-2">` + (data.daily.data[2].precipProbability * 100).toFixed(0) + '%' + `</div></div>
                <div class='row'><div class="col-sm-2">` + time.getMonth() + '/' + (time.getDate() + 3) + `</div>
                <div class="col-sm-1"></div>
                <div class=" col-sm-1">` + Math.round(data.daily.data[3].temperatureLow) + `</div>
                <div class=" col-sm-1"></div>
                <div class=" col-sm-1">` + Math.round(data.daily.data[3].temperatureHigh) + `</div>
                <div class=" col-sm-1"></div>
                <div class="col-sm-2">` + (data.daily.data[3].precipProbability * 100).toFixed(0) + '%' + `</div></div>`;
            }
        });
    }

    function fail(msg){
        elTemp = 'failed';
        console.log(msg.code);
    }
}
weather();