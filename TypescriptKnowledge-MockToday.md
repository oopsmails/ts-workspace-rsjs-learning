

## Knowledge: Mocking Today in unit test

Refs:

https://stackoverflow.com/questions/33380311/jasmine-date-mocking-with-moment-js

### An alternative to jasmine or even other mock frameworks to avoid dependencies.

```
const currentToday = moment().toDate();
console.log(`currentToday:`, currentToday)

const newToday = moment('1980-01-01').toDate();
console.log(`newToday    :`, newToday);

Date.now = () => {
  return newToday
};

const fakedToday = moment().toDate();
console.log(`fakedToday  :`, fakedToday);
```

### 

jasmine.clock().mockDate expects Date as input. Date and moment are not fully compatible. If you provide the to-be-mocked date in the spec itself you could simply use Date there instead.

If your code generates a moment you want to mock, or you'd rather use the moment API, take a look at moment.toDate(). This method returns the Date object backing a moment.

**Important note** - don't forget to reset the mocked date after your test! AFAIK, calling jasmine.clock().mockDate(..) is a global action, so it would be a good idea to set (and unset) it in a separate beforeEach block instead. Then just clear it later using jasmine.clock().uninstall() in an afterEach block.

```
it('uses the mocked time with moment', function() {
    var today = moment('2015-10-19').toDate();
    jasmine.clock().mockDate(today);
    expect(moment().valueOf()).toEqual(today.valueOf());
});

```

