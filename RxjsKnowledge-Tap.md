

## Knowledge: 'tap' operator


https://www.learnrxjs.io/learn-rxjs/operators/utility/do


Transparently perform actions or side-effects, such as logging.

💡 If you are using as a pipeable operator, do is known as tap!

### Examples

#### Example 1: Logging with tap

```
( StackBlitz | jsBin | jsFiddle )
// RxJS v6+
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

const source = of(1, 2, 3, 4, 5);
// transparently log values from source with 'tap'
const example = source.pipe(
  tap(val => console.log(`BEFORE MAP: ${val}`)),
  map(val => val + 10),
  tap(val => console.log(`AFTER MAP: ${val}`))
);

//'tap' does not transform values
//output: 11...12...13...14...15
const subscribe = example.subscribe(val => console.log(val));

```

#### Example 2: Using tap with object

```
( StackBlitz)
// RxJS v6+
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

const source = of(1, 2, 3, 4, 5);

// tap also accepts an object map to log next, error, and complete
const example = source
  .pipe(
    map(val => val + 10),
    tap({
      next: val => {
        // on next 11, etc.
        console.log('on next', val);
      },
      error: error => {
        console.log('on error', error.message);
      },
      complete: () => console.log('on complete')
    })
  )
  // output: 11, 12, 13, 14, 15
  .subscribe(val => console.log(val));

```

https://stackoverflow.com/questions/54289549/when-should-we-use-the-rxjs-tap-operator


### Most of the operators are working in streamed sequence, for example:

```
source$.pipe(
  map((a: string) => changeAndReturnArray(a)),
  filter((b: string[]) => giveMeOnlySymbolsThatAreAfterNInAlphabet(b)),
  switchMap((c: string[]) => putToSomeObservable(c))
  ....
);
```

In that example you are not 'breaking' the stream, or jumping outside of it to do some external action. Jumping outside of stream is possible with 'tap' operator, where you can:

- call functions that will cause some side effect, that might be visible to end user (for example - display dialog, show snackbar, redirect to different route (but in my opinion it's not recommended to use tap in that way))
- dispatch actions for store (if you are using any - for example ngrx store)
- debug you're code -> console.log()
- anything what can be considered as 'side effect' for your stream.


My personal opinion - use 'tap' only if you can't find any better solution. Jumping outside of stream and calling some side effect can be double edged sword, especially when your dealing with some bigger application. Side effect are always harder to maintain, and you can finish with application that is doing magic stuff without any reason.

