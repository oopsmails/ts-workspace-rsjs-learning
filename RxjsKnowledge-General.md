

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




