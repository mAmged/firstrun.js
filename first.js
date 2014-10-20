var firstRun = {};
firstRun.util = {},calc = {};
firstRun.init = function(callback) {
    if(!callback)
        callback = function(){}
    firstRun.util.db = window.openDatabase("Database", "1.0", "PhoneGap firstRun", 200000);
    function query(tx) {
        tx.executeSql('CREATE TABLE firstRun (install, date)');
        tx.executeSql('INSERT INTO firstRun (install, date) VALUES ("' + new Date() + '", "' + new Date() + '")');
    }

    function errorCB(err) {
        firstRun.util.check = false;
        firstRun.fromNow(function(){callback(false)})
        firstRun.util.db.transaction(function(tx) {
            tx.executeSql('INSERT INTO firstRun (install, date) VALUES ("' + new Date() + '", "' + new Date() + '")');
        }, function() {});
    }

    function successCB(tx, res) {
        firstRun.util.check = true;
        firstRun.fromNow(function(){callback(true)})
        firstRun.util.db.transaction(function(tx) {
            tx.executeSql('INSERT INTO firstRun (install, date) VALUES ("' + new Date() + '", "' + new Date() + '")');
        }, function() {});
    }

    firstRun.util.db.transaction(query, errorCB, successCB);
}
firstRun.check = function(){
    return firstRun.util.check
}
firstRun.date = function() {
    firstRun.util.db.transaction(function(tx) {
        tx.executeSql('SELECT install FROM firstRun', [], function(tx, results) {
            _date = results.rows.item(1);
            return _date;
        });
    }, function() {}, function() {
        l(_date);
    });
}
firstRun.lastOpen = function() {
    firstRun.util.db.transaction(function(tx) {
        tx.executeSql('SELECT date FROM firstRun', [], function(tx, results) {
            _date = results.rows.item(results.rows.length - 1);
            return _date;
        });
    }, function() {}, function() {
        l(_date);
    });
}
firstRun.get = function(arg, floating) {
    if (arg == 'mm') {
        if (floating)
            _return = calc.seconds() / 60
        else
            _return = calc.minutes();
    } else if (arg == 'hh') {
        if (floating)
            _return = firstRun.get('mm',true) / 60
        else
            _return = calc.hours();
    } else if (arg == 'd') {
        if (floating)
            _return = firstRun.get('mm',true) / (24*60)
        else
            _return = calc.days();
    } else if (arg == 'm') {
        if (floating)
            _return = firstRun.get('mm',true) / (60*24*30)
        else
            _return = calc.months();
    } else if (arg == 'y') {
        if (floating)
            _return = firstRun.get('mm',true) / (60*24*30*12)
        else
            _return = calc.years();
    }else if (arg == 'all') {
            _return = calc.all();
    } else
        _return = calc.date();

    return _return;
}
firstRun.fromNow = function(callback) {
    firstRun.util.db.transaction(function(tx) {
        tx.executeSql('SELECT install FROM firstRun', [], function(tx, results) {
            _date = results.rows.item(0);
            return _date;
        });
    }, function() {}, function() {
        var now = moment(new Date());
        __date = moment(new Date(_date.install));
        var res = moment(moment.duration(now.diff(__date)));
        var values = res._i._data;
        calc.all = function(){
            return values;
        }
        calc.date = function() {
            return new Date(_date.install);
        }
        calc.seconds = function() {
            return values.seconds + (calc.minutes() * 60);
        }
        calc.minutes = function() {
            return (calc.hours() * 60) + values.minutes;
        }
        calc.hours = function() {
            return values.hours + (values.days * 24) + (values.months * 30 * 24) + (values.years * 12 * 30 * 24)
        }
        calc.days = function() {
            return values.days;
        }
        calc.months = function() {
            return values.months;
        }
        calc.years = function() {
            return values.years;
        }
        if(callback)
        callback()
    });
}
//demo
/*
firstRun.init(function(check){
    alert(firstRun.get('mm')+' minutes \n | '+
    firstRun.get('mm', true)+' minutes\n | '+
    firstRun.get('hh', true)+' hours')
});
*/