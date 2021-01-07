import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { from } from 'rxjs/observable/from';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { takeUntil } from 'rxjs/operators';


addItem('====================== Setup: stopping infinite subscribers ======================');

const _stopSignalSubject = new Subject();
const stopSignalObservable$ = _stopSignalSubject.asObservable();
const takeUntilNumber = 5;


addItem('====================== 03-Streams, Observables & Subscriptions ======================');
var observable_03_01 = Observable.create((observer: any) => {
    observer.next('Hey guys!')
    observer.next('How are you?')
    observer.complete()
    observer.next('This will not send')
})

observable_03_01.subscribe(
    (x: any) => addItem(x),
    (error: any) => addItem(error),
    () => addItem('Completed')
);

observable_03_01.subscribe((x: any) => addItem(x));


addItem('====================== 04-Hot vs. Cold Observables_ ======================');

let toStopCount = 0;

var observable_04_01 = Observable.create((observer: any) => {
    try {
        observer.next('Hey guys!')
        observer.next('How are you?')
        setInterval(() => {
            observer.next('I am good')
        }, 2000)
    } catch (err) {
        observer.console.error(err);
    }
}); // This is cold observable, observers subscribe with this can get values from beginning.

var observable_04_02 = Observable.create((observer: any) => {
    try {
        observer.next('Hey guys!')
        observer.next('How are you?')
        setInterval(() => {
            observer.next('I am good')
        }, 2000)
    } catch (err) {
        observer.console.error(err);
    }
})
.pipe(
    takeUntil(stopSignalObservable$)
)
.share(); // This is hot observable, observers subscribe with this can only get values after subscribing.

var observable_04_03 = fromEvent(document, 'mouseup'); // real hot from event, e.g, mouse


var observer_04_01 = observable_04_03.subscribe(
    (x: any) => {
        addItem('observer_04_01: ' + x)
        toStopCount++
        if (toStopCount === takeUntilNumber) {
            _stopSignalSubject.next()
        }
    },
    (error: any) => addItem(error),
    () => addItem('Completed')
);

setTimeout(
    () => {
        var observer_04_02 = observable_04_03.subscribe(
            (x: any) => {
                addItem('observer_04_02: ' + x)
            }
        );
    }, 1000
)

addItem('====================== 07-Operators ======================');

addItem('------ 07-Operators: map ------');

Observable.create((observer: any) => {
    observer.next('Hey guys!')
})
    .map((val: any) => val.toUpperCase())
    .subscribe((x: any) => addItem(x))

addItem('------ 07-Operators: pluck ------');

from([
    { first: 'Gary', last: 'Simon', age: '34' },
    { first: 'Jane', last: 'Simon', age: '34' },
    { first: 'John', last: 'Simon', age: '34' }
])
    .pluck('first')
    .subscribe((x: any) => addItem(x))

addItem('------ 07-Operators: skipUntil ------');

var observable_07_01 = Observable.create((data: any) => {
    var i = 1
    setInterval(() => {
        data.next(i++);
    }, 1000)
})
    .pipe(takeUntil(Observable.timer(10000))) // add this line to stop infinitely generating

var observable_07_02 = new Subject;

setTimeout(() => {
    observable_07_02.next('Hey!')
}, 3000)

var observable_07_03 = observable_07_01.skipUntil(observable_07_02);

observable_07_03.subscribe((x: any) => addItem('observable_07_03, skipUntil: ' + x))

addItem('====================== 08: How to stop infinite Observable ======================');

const _stopSignalSubject_08 = new Subject();
const stopSignalObservable_08$ = _stopSignalSubject_08.asObservable();
const takeUntilNumber_08 = 5;
var observable_08_01 = Observable.create((data: any) => {
    var i = 1
    setInterval(() => {
        data.next(i++);
    }, 1000)
})
    .pipe(
        takeUntil(stopSignalObservable_08$)
    )

observable_08_01.subscribe(
    (x: any) => {
        addItem('observable_08_01, stop infinite Observable: x = ' + x + ', will take till ' + takeUntilNumber)
        if (x === takeUntilNumber_08) {
            _stopSignalSubject_08.next()
        }
    }
)

addItem('====================== 09: How to convert to local time from UTC or standardized ISO 8601-format ======================');

// https://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time

// var divUTC = document.createElement('div');
// var divLocal = document.createElement('div');

var divUtc = <HTMLDivElement>(document.getElementById('divUTC'));
var divLocal = <HTMLDivElement>document.getElementById('divLocal');

// var divUtc = <HTMLDivElement>(document.createElement('div'));
// divUtc.id = 'divUtc111';
// divUtc.innerHTML = 'utc';
// var divLocal = <HTMLDivElement>document.createElement('div');
// divUtc.innerHTML = 'local';

setInterval(function(){
    // UTC time
    var utcTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    // createAndSetDiv('divUTC', 'moment.js utc local timezone UTC' + utcTime);
    divUtc.innerText = '' + moment.utc().format('YYYY-MM-DD HH:mm:ss'); 
    
    //get text from divUTC and conver to local timezone  
    var localTime  = moment.utc(utcTime).toDate();
    var localTimeFormattedStr = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
    // createAndSetDiv('divLocal', 'Your Local Time with respect to above UTC time' + localTimeFormattedStr);
    divLocal.innerText = localTimeFormattedStr;      
  },1000);



addItem('====================== Free Testing ======================');

function createAndSetDiv(divEle: any, val: any) {
    var node = document.createElement('div');
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById('output').appendChild(node);
}


function addItem(val: any) {
    var node = document.createElement('li');
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById('output').appendChild(node);
}

