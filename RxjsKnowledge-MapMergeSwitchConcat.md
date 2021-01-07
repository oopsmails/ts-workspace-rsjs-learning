

## Knowledge: Understanding RxJS map, mergeMap, switchMap and concatMap

**Solving multiple observables ...**

- from
https://medium.com/@luukgruijs/understanding-rxjs-map-mergemap-switchmap-and-concatmap-833fc1fb09ff


- switchMap:

https://www.youtube.com/watch?v=6lKoLwGlglE

file:///home/albert/Documents/sharing/switchMap()-RxJS TUTORIAL.mp4


- As with the RemoveFromCart action, using mergeMap would fix the bug, because switchMap will introduce race condition.
(https://ncjamieson.com/avoiding-switchmap-related-bugs/)

- If our application’s cart shows the total cost of the items plus the shipping, each change to the cart’s content would see a GetCartTotal action dispatched. Using switchMap for the effect/epic that handles the GetCartTotal action would be entirely appropriate.

- exhaustMap
exhaustMap is perhaps the least-well-known of the flattening operators, but it’s easily explained: it can be thought of as the opposite of switchMap.

If switchMap is used, pending backend requests are aborted in favour of more recently dispatched actions. However, if exhaustMap is used, dispatched actions are ignored whilst there is a pending backend request.

Let’s look at a scenario in which exhaustMap could be used.

There’s a particular type of user with whom developers should be familiar: the incessant button clicker. When the incessant button clicker clicks a button and nothing happens, they click it again. And again. And again.

If our shopping cart has a refresh button and the effect/epic that handles the refresh uses switchMap, each incessant button click will abort the pending refresh. That doesn’t make a whole lot of sense and the incessant button clicker could be clicking for a long, long time before a refresh occurs.

If the effect/epic that handles the refreshing of the cart instead used exhaustMap, a pending refresh request would see the incessant clicks ignored.

### Summary

- use concatMap with actions that should be neither aborted nor ignored and for which the ordering must be preserved — it’s also a conservative choice that will always behave in a predictable manner;
- use mergeMap with actions that should be neither aborted nor ignored and for which the ordering is unimportant;
- use switchMap with read actions that should be aborted when another action of the same type is dispatched; and
- use exhaustMap with actions that should be ignored whilst an action of the same type is pending.


### map

Mapping data is a common operation while writing your program. When you use RxJS in your code to produce your data streams it’s very likely you eventually need a way to map the data to whatever format you need it to be.

```
import { of } from 'rxjs'; 
import { map } from 'rxjs/operators';

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
  ).subscribe(cars => console.log(cars))

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
  ).subscribe(cars => console.log(cars))


```

### mergeMap = flatMap (alias of mergeMap)

To further clarify this: we have from([1,2,3,4]) as our ‘outer’ Observable, and the result of the getData() as our ‘inner’ Observable. 

- Option 1: **BAD**, We could do this by subscribing to the array, then setup a map that calls a function which handles the API call and then subscribe to the result. This could look like the following:

```
// Outer Observable

import { of, from } from 'rxjs'; 
import { map, delay } from 'rxjs/operators';

const getData = (param) => {
  return of(`retrieved new data with param ${param}`).pipe(
    delay(1000)
  )
}

from([1,2,3,4]).pipe(
  map(param => getData(param))
).subscribe(val => console.log(val);

```



- To further clarify this: we have from([1,2,3,4]) as our ‘outer’ Observable, and the result of the getData() as our ‘inner’ Observable. **In theory we have to subscribe to both our outer and inner Observable to get the data out.** This could like this:

```
import { of, from } from 'rxjs'; 
import { map, delay } from 'rxjs/operators';

const getData = (param) => {
  return of(`retrieved new data with param ${param}`).pipe(
    delay(1000)
  )
}

from([1,2,3,4]).pipe(
  map(param => getData(param))
).subscribe(val => val.subscribe(data => console.log(data)));


```

**BAD: have to call Subscribe two times**

As you can might imagine this is far from ideal as we have to call Subscribe two times. This is where mergeMap comes to the rescue. 

- map + mergeAll, also not good as mergeMap

MergeAll takes care of subscribing to the ‘inner’ Observable so that we no longer have to Subscribe two times as mergeAll merges the value of the ‘inner’ Observable into the ‘outer’ Observable. This could look like this:

```
import { of, from } from 'rxjs'; 
import { map, delay, mergeAll } from 'rxjs/operators';

const getData = (param) => {
  return of(`retrieved new data with param ${param}`).pipe(
    delay(1000)
  )
}

from([1,2,3,4]).pipe(
  map(param => getData(param)),
  mergeAll()
).subscribe(val => console.log(val));

```

- mergeMap: **BEST solution and comparing here**

```
import { of, from } from 'rxjs'; 
import { map, mergeMap, delay, mergeAll } from 'rxjs/operators';

const getData = (param) => {
  return of(`retrieved new data with param ${param}`).pipe(
    delay(1000)
  )
}

// using a regular map, BAD, subscribe twice!
from([1,2,3,4]).pipe(
  map(param => getData(param))
).subscribe(val => val.subscribe(data => console.log(data)));

// using map and mergeAll
from([1,2,3,4]).pipe(
  map(param => getData(param)),
  mergeAll()
).subscribe(val => console.log(val));

// using mergeMap
from([1,2,3,4]).pipe(
  mergeMap(param => getData(param))
).subscribe(val => console.log(val));

```

You might also have heard about flatMap. **FlatMap is an alias of mergeMap and behaves in the same way. Don’t get confused there!**


#### switchMap

SwitchMap has similar behaviour in that it will also subscribe to the inner Observable for you. However switchMap is a combination of switchAll and map. SwitchAll cancels the previous subscription and subscribes to the new one. For our scenario where we want to do an API call for each item in the array of the ‘outer’ Observable, switchMap does not work well as it will cancel the first 3 subscriptions and only deals with the last one. This means we will get only one result. The full example can be seen here:

```
// BAD, three API calls

import { of, from } from 'rxjs'; 
import { map, delay, switchAll, switchMap } from 'rxjs/operators';

const getData = (param) => {
  return of(`retrieved new data with param ${param}`).pipe(
    delay(1000)
  )
}

// using a regular map
from([1,2,3,4]).pipe(
  map(param => getData(param))
).subscribe(val => val.subscribe(data => console.log(data)));

// using map and switchAll
from([1,2,3,4]).pipe(
  map(param => getData(param)),
  switchAll()
).subscribe(val => console.log(val));

// using switchMap
from([1,2,3,4]).pipe(
  switchMap(param => getData(param))
).subscribe(val => console.log(val));


```

While switchMap wouldn’t work for our current scenario, it will work for other scenario’s. **It would for example come in handy if you compose a list of filters into a data stream and perform an API call when a filter is changed. If the previous filter changes are still being processed while a new change is already made, it will cancel the previous subscription and start a new subscription on the latest change.** An example can be seen here:

```
import { of, from, BehaviorSubject } from 'rxjs'; 
import { map, delay, switchAll, switchMap } from 'rxjs/operators';

const filters = ['brand=porsche', 'model=911', 'horsepower=389', 'color=red']
const activeFilters = new BehaviorSubject('');

const getData = (params) => {
  return of(`retrieved new data with params ${params}`).pipe(
    delay(1000)
  )
}

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
).subscribe(val => console.log(val));

applyFilters()


```

**As you can see in the console getData is only logging once with all the params. This saved us 3 API calls.**


#### ConcatMap

The last example is concatMap. As you might expect, concatMap also subscribes to the inner Observable for you. But unlike switchMap, that unsubscribes from the current Observable if a new Observable comes in, concatMap will not subscribe to the next Observable until the current one completes. **The benefit of this is that the order in which the Observables are emitting is maintained.** To demonstrate this:

```
import { of, from } from 'rxjs'; 
import { map, delay, mergeMap, concatMap } from 'rxjs/operators';

const getData = (param) => {
  const delayTime = Math.floor(Math.random() * 10000) + 1;
  return of(`retrieved new data with params: ${param} and delay: ${delayTime}`).pipe(
    delay(delayTime)
  )
}

// using a regular map
from([1,2,3,4]).pipe(
  map(param => getData(param))
).subscribe(val => val.subscribe(data => console.log('map:', data)));

// using mergeMap
from([1, 2, 3 ,4]).pipe(
  mergeMap(param => getData(param))
).subscribe(val => console.log('mergeMap:', val));

// using concatMap
from([1, 2, 3 ,4]).pipe(
  concatMap(param => getData(param))
).subscribe(val => console.log('concatMap:', val));

```


The getData function has a random delay between 1 and 10000 milliseconds. If you check the logs you can see that the map and mergeMap operators will log whatever value comes back and don’t follow the original order. On the other hand **the concatMap logs the values in the same value as they were started.**



#### Reference:

Understanding RxJS map, mergeMap, switchMap and concatMap
Luuk Gruijs
Jan 9, 2019·5 min read



Mapping data is a common operation while writing your program. When you use RxJS in your code to produce your data streams it’s very likely you eventually need a way to map the data to whatever format you need it to be. RxJS comes with a ‘normal’ map function, but also has functions like mergeMap, switchMap and concatMap which all behave slightly different.
Image for post
Photo by Dennis Kummer on Unsplash
The map operator
The map operator is the most common of all. For each value that the Observable emits you can apply a function in which you can modify the data. The return value will, behind the scenes, be reemitted as an Observable again so you can keep using it in your stream. It works pretty much the same as how you would use it with Arrays. The difference is that Arrays will always be just Arrays and while mapping you get the value of the current index in the Array. With Observables the type of data can be of all sorts of types. This means that you might have to do some additional operations in side your Observable map function to get the desired result. Let’s look at some examples:

We first created our Observable with an array of cars. We then subscribe to this Observable 2 times. The first time we modify our data in such a way that we get an array of concatenated brand and model strings. The second time we modify our data so that we get an array of only Porsche cars. In both examples we use the Observable map operator to modify the data that is being emitted by the Observable. We return the result of our modification and the map operator then behind the scenes takes care of wrapping this in an Observable again so we can later subscribe to it.
MergeMap
Now let’s say there is a scenario where we have an Observable that emits an array, and for each item in the array we need to fetch data from the server.
We could do this by subscribing to the array, then setup a map that calls a function which handles the API call and then subscribe to the result. This could look like the following:

Our map function returns the value of the getData function. In this case that is an Observable. This does however create a problem because now we’re dealing with an additional Observable.
To further clarify this: we have from([1,2,3,4]) as our ‘outer’ Observable, and the result of the getData() as our ‘inner’ Observable. In theory we have to subscribe to both our outer and inner Observable to get the data out. This could like this:

As you can might imagine this is far from ideal as we have to call Subscribe two times. This is where mergeMap comes to the rescue. MergeMap essentially is a combination of mergeAll and map. MergeAll takes care of subscribing to the ‘inner’ Observable so that we no longer have to Subscribe two times as mergeAll merges the value of the ‘inner’ Observable into the ‘outer’ Observable. This could look like this:

This already is much better, but as you might already guessed mergeMap would be the best solution for this. Here’s the full example:

You might also have heard about flatMap. FlatMap is an alias of mergeMap and behaves in the same way. Don’t get confused there!
SwitchMap
SwitchMap has similar behaviour in that it will also subscribe to the inner Observable for you. However switchMap is a combination of switchAll and map. SwitchAll cancels the previous subscription and subscribes to the new one. For our scenario where we want to do an API call for each item in the array of the ‘outer’ Observable, switchMap does not work well as it will cancel the first 3 subscriptions and only deals with the last one. This means we will get only one result. The full example can be seen here:

While switchMap wouldn’t work for our current scenario, it will work for other scenario’s. It would for example come in handy if you compose a list of filters into a data stream and perform an API call when a filter is changed. If the previous filter changes are still being processed while a new change is already made, it will cancel the previous subscription and start a new subscription on the latest change. An example can be seen here:

As you can see in the console getData is only logging once with all the params. This saved us 3 API calls.
ConcatMap
The last example is concatMap. As you might expect, concatMap also subscribes to the inner Observable for you. But unlike switchMap, that unsubscribes from the current Observable if a new Observable comes in, concatMap will not subscribe to the next Observable until the current one completes. The benefit of this is that the order in which the Observables are emitting is maintained. To demonstrate this:

The getData function has a random delay between 1 and 10000 milliseconds. If you check the logs you can see that the map and mergeMap operators will log whatever value comes back and don’t follow the original order. On the other hand the concatMap logs the values in the same value as they were started.
Conclusion
Mapping data to the format you need is a common task. RxJS comes with a few very neat operators that help you get the job done. To recap: map is for mapping ‘normal’ values to whatever format you need it to be. The return value will be wrapped in an Observable again, so you can keep using it in your data stream. When you have to deal with an ‘inner’ Observable it’s easier to use mergeMap, switchMap or concatMap. Use mergeMap if you simply want to flatten the data into one Observable, use switchMap if you need to flatten the data into one Observable but only need the latest value and use concatMap if you need to flatten the data into one Observable and the order is important to you.


