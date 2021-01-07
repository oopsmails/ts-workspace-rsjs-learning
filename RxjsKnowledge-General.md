

## Knowledge

### 'of' vs 'from' operator

```
Observable.of(1,2,3).subscribe(() => {})
Observable.from([1,2,3]).subscribe(() => {})
```

When passing an array to Observable.from, the only difference between it and Observable.of is the way the arguments are passed.

However, Observable.from will accept an argument that is

a subscribable object, a Promise, an Observable-like, an Array, an iterable or an array-like object to be converted

There is no similar behaviour for Observable.of - which always accepts only values and performs no conversion.

### Understanding RxJS map, mergeMap, switchMap and concatMap

https://medium.com/@luukgruijs/understanding-rxjs-map-mergemap-switchmap-and-concatmap-833fc1fb09ff


### setinterval vs settimeout

#### setTimeout():

It is a function that execute a JavaScript statement AFTER x interval.

```
var timer = setTimeout(function () {
    something();
}, 1000); // Execute something() 1 second later.
clearTimeout(timer);
```



#### setInterval():

It is a function that execute a JavaScript statement EVERY x interval.

```
var intervalID = setInterval(function () {
    somethingElse();
}, 2000); // Execute somethingElse() every 2 seconds.
The interval unit is in millisecond for both functions.


// clearInterval(intervalID); // Will clear the timer.
```

### Date UTC ISO-8601

#### Current date and time expressed according to ISO 8601

Date	2021-01-05
Date and time in UTC	

2021-01-05T19:24:11+00:00
2021-01-05T19:24:11Z
20210105T192411Z


#### With IE the UTC date-time conversion to local is little tricky. For me, the date-time from web API is '2018-02-15T05:37:26.007' and I wanted to convert as per local timezone so I used below code in JavaScript.

`vsar createdDateTime = new Date('2018-02-15T05:37:26.007' + 'Z');`


### Typescript check if null


#### In TypeScript 3.7 we have now Optional chaining and Nullish Coalescing to check null and undefined in the same time

example:

let x = foo?.bar.baz();
this code will check if foo is defined otherwise it will return undefined

old way :

if(foo != null && foo != undefined) {
   x = foo.bar.baz();
} 
this:

let x = (foo === null || foo === undefined) ? undefined : foo.bar();

if (foo && foo.bar && foo.bar.baz) { // ... }
With optional chaining will be:

let x = foo?.bar();

if (foo?.bar?.baz) { // ... }
another new feature is Nullish Coalescing, example:

let x = foo ?? bar(); // return foo if it's not null or undefined otherwise calculate bar
old way:

let x = (foo !== null && foo !== undefined) ?
foo :
bar();









