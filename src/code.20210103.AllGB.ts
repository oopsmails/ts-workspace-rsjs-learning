import * as moment from 'moment';
import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { from } from 'rxjs/observable/from';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { of } from 'rxjs/observable/of';
import { concatMap, delay, map, mergeAll, mergeMap, switchAll, switchMap, takeUntil } from 'rxjs/operators';


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

addItem('====================== 05-Subjects_ ======================');

// Subject: an Observer also be able to emit values, it is an Observer and an Observable simultaneously 

var subject_05_01 = new Subject();
subject_05_01.subscribe(
    data => addItem('subject_05_01: ' + data),
    err => addItem(err),
    () => addItem('subject_05_01 completed')
)

subject_05_01.next('The first thing has been sent')

var observer_05_01 = subject_05_01.subscribe(
    (data: any) => addItem('observer_05_01: ' + data),
    (error: any) => addItem(error),
    () => addItem('observer_05_01 completed')
);

subject_05_01.next('The second thing has been sent')
subject_05_01.next('A third thing has been sent')

observer_05_01.unsubscribe();

subject_05_01.next('A final thing has been sent')


addItem('====================== 06-Other Subjects (Behavior, Replay&Async)_ ======================');


addItem('------ 06-BehaviorSubject ------');
// BehaviorSubject, a newly subscribed observer's will get the last value right before the subscription.

var subject_06_01 = new BehaviorSubject('First');
subject_06_01.subscribe(
    data => addItem('subject_06_01: ' + data),
    err => addItem(err),
    () => addItem('subject_06_01 completed')
)

subject_06_01.next('The first thing has been sent')

subject_06_01.next('... Observer observer_06_01 is about to subscrbe ...') // observer_06_01 will get this!!!!

var observer_06_01 = subject_06_01.subscribe(
    (data: any) => addItem('observer_06_01: ' + data),
    (error: any) => addItem(error),
    () => addItem('observer_06_01 completed')
);

subject_06_01.next('The second thing has been sent')
subject_06_01.next('A third thing has been sent')

addItem('------ 06-ReplaySubject, replay back by number ------');
// ReplaySubject, allows a number of value to be replayed back, vs BehaviorSubject only get the very last value
// also can specify a time window ...

var subject_06_02 = new ReplaySubject(2); // get last 2 values
subject_06_02.subscribe(
    data => addItem('subject_06_02: ' + data),
    err => addItem(err),
    () => addItem('subject_06_02 completed')
)

subject_06_02.next('The first thing has been sent')
subject_06_02.next('Another thing has been sent') // observer_06_02 will get this!!!
subject_06_02.next('... Observer observer_06_02 is about to subscrbe ...') // observer_06_02 will get this!!!!

var observer_06_02 = subject_06_02.subscribe(
    (data: any) => addItem('observer_06_02: ' + data),
    (error: any) => addItem(error),
    () => addItem('observer_06_02 completed')
);

subject_06_02.next('The second thing has been sent')
subject_06_02.next('A third thing has been sent')

addItem('------ 06-ReplaySubject, replay back by number and time period ------');

var subject_06_03 = new ReplaySubject(30, 200); // get 30 values within last 200 ms, if change to 500ms, then can get all
subject_06_03.subscribe(
    data => addItem('subject_06_03: ' + data),
    err => addItem(err),
    () => addItem('subject_06_03 completed')
)

var i = 1;
var interval_06_03 = setInterval(() => subject_06_03.next(i++), 100)

setTimeout(
    () => {
        var observer_06_03 = subject_06_03.subscribe(
            (data: any) => addItem('observer_06_03: ' + data),
            (error: any) => addItem(error),
            () => addItem('observer_06_03  completed')
        );
    }, 500
)

setTimeout(
    () => {
        clearInterval(interval_06_03)
    }, 1000
)

addItem('------ 06-AsyncSubject ------');

// AsyncSubject: Only the very LAST value will be sent to all Observers and ONLY sending with complete(), i.e, no complete(), no sending!
// search "_06_04", only two, i.e, subject_06_04 and observer_06_04

var subject_06_04 = new AsyncSubject(); // get 30 values within last 200 ms, if change to 500ms, then can get all
subject_06_04.subscribe(
    data => addItem('subject_06_04: ' + data),
    () => addItem('subject_06_03 completed')
)

var i = 1;
var interval_06_04 = setInterval(() => subject_06_04.next(i++), 100)

setTimeout(
    () => {
        var observer_06_04 = subject_06_04.subscribe(
            (data: any) => addItem('observer_06_04: ' + data)
        );
        subject_06_04.complete();
    }, 500
)

setTimeout(
    () => {
        clearInterval(interval_06_04)
    }, 1000
)


addItem('====================== 07-Operators ======================');

addItem('------ 07-Operators: map ------');

Observable.create((observer: any) => {
    observer.next('Hey guys!')
})
    .map((val: any) => val.toUpperCase())
    .subscribe((x: any) => addItem(x))

addItem('------ 07-Operators: map with filter ------');

// lets create our data first
const data = of([
    {
        brand: 'porsche',
        model: '911'
    },
    {
        brand: 'porsche',
        model: 'macan'
    },
    {
        brand: 'ferarri',
        model: '458'
    },
    {
        brand: 'lamborghini',
        model: 'urus'
    }
]);

// get data as brand+model string. Result: 
// ["porsche 911", "porsche macan", "ferarri 458", "lamborghini urus"]
data
    .pipe(
        map(cars => cars.map(car => `${car.brand} ${car.model}`))
    ).subscribe(cars => addItem('07-Operators, map: ' + cars))

// filter data so that we only have porsches. Result:
// [
//   {
//     brand: 'porsche',
//     model: '911'
//   },
//   {
//     brand: 'porsche',
//     model: 'macan'
//   }
// ]
data
    .pipe(
        map(cars => cars.filter(car => car.brand === 'porsche'))
    ).subscribe(cars => addItem('07-Operators, map filter: ' + cars))


addItem('------ 07-Operators: mergeMap = flatMap ------');

// setup for all
const getData = (param: any) => {
    return of(`retrieved new data with param ${param}`).pipe(
        delay(1000)
    )
}


// using a regular map, BAD, subscribe twice!
from([1, 2, 3, 4]).pipe(
    map(param => getData(param))
).subscribe(val => val.subscribe(data => addItem('07-Operators, mergeMap, map with two subscribes, BAD: ' + data)));

// using map and mergeAll
from([1, 2, 3, 4]).pipe(
    map(param => getData(param)),
    mergeAll()
).subscribe(val => addItem('07-Operators, mergeMap, map + mergeAll: ' + val));

// using mergeMap
from([1, 2, 3, 4]).pipe(
    mergeMap(param => getData(param))
).subscribe(val => addItem('07-Operators, mergeMap: ' + val));

addItem('------ 07-Operators: switchMap ------');

// using a regular map
from([1, 2, 3, 4]).pipe(
    map(param => getData(param))
).subscribe(val => val.subscribe(data => addItem('07-Operators, switchMap, using map get all of 4 with two subscribes: ' + data)));

// using map and switchAll
from([1, 2, 3, 4]).pipe(
    map(param => getData(param)),
    switchAll()
).subscribe(val => addItem('07-Operators, switchMap = map + switchAll, only get one but also with one subscribe: ' + val));

// using switchMap
from([1, 2, 3, 4]).pipe(
    switchMap(param => getData(param))
).subscribe(val => addItem('07-Operators, switchMap: ' + val));



const filters = ['brand=porsche', 'model=911', 'horsepower=389', 'color=red']
const activeFilters = new BehaviorSubject('');

const applyFilters = () => {
    filters.forEach((filter, index) => {

        let newFilters = activeFilters.value;
        if (index === 0) {
            newFilters = `?${filter}`
        } else {
            newFilters = `${newFilters}&${filter}`
        }

        activeFilters.next(newFilters)
    })
}

// using switchMap
activeFilters.pipe(
    switchMap(param => getData(param))
).subscribe(val => addItem('07-Operators, switchMap best example: ' + val));

applyFilters()


addItem('------ 07-Operators: concatMap ------');

const getDataRandom = (param: any) => {
    const delayTime = Math.floor(Math.random() * 10000) + 1;
    return of(`retrieved new data with params: ${param} and delay: ${delayTime}`).pipe(
        delay(delayTime)
    )
}

// using a regular map
from([1, 2, 3, 4]).pipe(
    map(param => getDataRandom(param))
).subscribe(val => val.subscribe(data => addItem('map not keeping order:' + data)));

// using mergeMap
from([1, 2, 3, 4]).pipe(
    mergeMap(param => getDataRandom(param))
).subscribe(val => addItem('mergeMap not keeping order:' + val));

// using concatMap
from([1, 2, 3, 4]).pipe(
    concatMap(param => getDataRandom(param))
).subscribe(val => addItem('concatMap keeping order:' + val));


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

setInterval(function () {
    // UTC time
    var utcTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    // createAndSetDiv('divUTC', 'moment.js utc local timezone UTC' + utcTime);
    divUtc.innerText = '' + moment.utc().format('YYYY-MM-DD HH:mm:ss');

    //get text from divUTC and conver to local timezone  
    var localTime = moment.utc(utcTime).toDate();
    var localTimeFormattedStr = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
    // createAndSetDiv('divLocal', 'Your Local Time with respect to above UTC time' + localTimeFormattedStr);
    divLocal.innerText = localTimeFormattedStr;
}, 1000);


addItem('====================== 10: setInterval vs setTimeout ======================');

function doStuffSetInterval() {
    addItem("doStuffSetInterval_10_01: run your code here when time interval is reached");
}
var interval_10_01 = setInterval(doStuffSetInterval, 2000);

setTimeout(
    () => {
        clearInterval(interval_10_01)
    }, 20000
)

function doStuffSetTimeout() {
    addItem("doStuffSetTimeout_10_01: run your code here when time interval is reached");
}
var timeout_10_01 = setTimeout(doStuffSetTimeout, 2000);
clearTimeout(timeout_10_01); // cleared!!!



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

