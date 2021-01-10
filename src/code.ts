import * as moment from 'moment';
import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { from } from 'rxjs/observable/from';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { of } from 'rxjs/observable/of';
import { concatMap, delay, map, mergeAll, mergeMap, switchAll, switchMap, takeUntil } from 'rxjs/operators';
import { Customer, Permission, PrintMedia, User } from './customer.model';


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

addItem(user?.address?.street ?? ''); 

addItem('====================== Free Testing ======================');


type RecordType_12_01 = Record<PrintMedia, Customer>;
const record01: RecordType_12_01 = {
    1: {name: 'joe1'},
    // 3: {name: 'joe'}, // error
    5: {name: 'joe5'},
    6: {name: 'joe6'},
    10: {name: 'joe10'}
};

// type RecordType_12_02 = Record<Permission.AllRead, User>;
// const record02: RecordType_12_02 = {
//     Permission.AllRead: {name: 'joe'}
// };

addItem(record01); 



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

