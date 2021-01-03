

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



