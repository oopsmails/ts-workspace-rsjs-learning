import { Observable, Subject } from 'rxjs';
import { from } from 'rxjs/observable/from';
import { takeUntil } from 'rxjs/operators';



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

addItem('====================== 07-Operators ======================');

addItem('------ 07-Operators: map ------');

Observable.create((observer: any) => {
    observer.next('Hey guys!')
})
    .map((val: any) => val.toUpperCase())
    .subscribe((x: any) => addItem(x))

addItem('------ 07-Operators: pluck ------');

from ([
    { first: 'Gary', last: 'Simon', age: '34'},
    { first: 'Jane', last: 'Simon', age: '34'},
    { first: 'John', last: 'Simon', age: '34'}
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

observable_07_03.subscribe((x: any) => addItem(x))


addItem('====================== Testing ======================');

addItem('------ 08: How to stop infinite Observable ------');

const _stopSignalSubject = new Subject();
const stopSignalObservable$ = _stopSignalSubject.asObservable();
const takeUntilNumber = 5;
var observable_08_01 = Observable.create((data: any) => {
    var i = 1
    setInterval(() => {
        data.next(i++);
    }, 1000)
})
.pipe(
    takeUntil(stopSignalObservable$)
)

observable_08_01.subscribe(
    (x: any) => {
        addItem('x = ' + x + ', will take till ' + takeUntilNumber)
        if (x === takeUntilNumber) {
            _stopSignalSubject.next()
        }
    }
)


function addItem(val: any) {
    var node = document.createElement('li');
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById('output').appendChild(node);
}

