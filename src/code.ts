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

addItem('====================== 11: Typescript check if null ======================');

const message_11_01 ='';

// The null coalescing operator
addItem(message_11_01 || 'test'); // it displays 'test' in case message is null, undefined or empty string -> 'test'

// The nullish coalescing operator where empty string is a valid value
addItem(message_11_01 ?? 'test'); // -> ''

// Optional chaining
const user = {
    address: {
        street: 'street name',
        country: 'Algeria'
    }
}

addItem((user && user.address && user.address.street) ?? ''); 

addItem((user?.address?.street ?? ''); 

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

