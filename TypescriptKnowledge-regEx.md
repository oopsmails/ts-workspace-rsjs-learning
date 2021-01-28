

# regEx

## Replacing dynamically ...

### Using function to replace

- can test https://jsfiddle.net/nobu222/uLrfhncw/

```
const out = document.getElementById('output');

const today = moment();
const someday = moment('2011-01-01 21:30');

const diff = today.diff(someday, 'year');

let formattedDate = someday.format('MMM DD, YYYY hh:mm a.');


//const ampm = 'am.pm.';
let addingDot = formattedDate.replace(/am.$/, 'a.m.').replace(/pm.$/, 'p.m.');

let addingDo2t = formattedDate.replace(/am|pm/gi, (str) => {
const mapObj = {
   am:"a.m",
   pm:"p.m",
};
return mapObj[str];
});


out.innerText = addingDot2;
```

- example from https://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings


*Making it Reusable*

If you want this to be a general pattern you could pull this out to a function like this

```
function replaceAll(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
}
```

### Side learning, String.prototype ... but normally, don't extend generic object

```
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function replaceAll(str, map){
    for(key in map){
        str = str.replaceAll(key, map[key]);
    }
    return str;
}

//testing...
var str = "bat, ball, cat";
var map = {
    'bat' : 'foo',
    'ball' : 'boo',
    'cat' : 'bar'
};
var new = replaceAll(str, map);
//result: "foo, boo, bar"
```

### Best Answer???

```
using Array.prototype.reduce():

const arrayOfObjects = [
  { plants: 'men' },
  { smart:'dumb' },
  { peace: 'war' }
]
const sentence = 'plants are smart'

arrayOfObjects.reduce(
  (f, s) => `${f}`.replace(Object.keys(s)[0], s[Object.keys(s)[0]]), sentence
)

// as a reusable function
const replaceManyStr = (obj, sentence) => obj.reduce((f, s) => `${f}`.replace(Object.keys(s)[0], s[Object.keys(s)[0]]), sentence)

const result = replaceManyStr(arrayOfObjects , sentence1)
Example

// /////////////    1. replacing using reduce and objects

// arrayOfObjects.reduce((f, s) => `${f}`.replace(Object.keys(s)[0], s[Object.keys(s)[0]]), sentence)

// replaces the key in object with its value if found in the sentence
// doesn't break if words aren't found

// Example

const arrayOfObjects = [
  { plants: 'men' },
  { smart:'dumb' },
  { peace: 'war' }
]
const sentence1 = 'plants are smart'
const result1 = arrayOfObjects.reduce((f, s) => `${f}`.replace(Object.keys(s)[0], s[Object.keys(s)[0]]), sentence1)

console.log(result1)

// result1: 
// men are dumb


// Extra: string insertion python style with an array of words and indexes

// usage

// arrayOfWords.reduce((f, s, i) => `${f}`.replace(`{${i}}`, s), sentence)

// where arrayOfWords has words you want to insert in sentence

// Example

// replaces as many words in the sentence as are defined in the arrayOfWords
// use python type {0}, {1} etc notation

// five to replace
const sentence2 = '{0} is {1} and {2} are {3} every {5}'

// but four in array? doesn't break
const words2 = ['man','dumb','plants','smart']

// what happens ?
const result2 = words2.reduce((f, s, i) => `${f}`.replace(`{${i}}`, s), sentence2)

console.log(result2)

// result2: 
// man is dumb and plants are smart every {5}

// replaces as many words as are defined in the array
// three to replace
const sentence3 = '{0} is {1} and {2}'

// but five in array
const words3 = ['man','dumb','plant','smart']

// what happens ? doesn't break
const result3 = words3.reduce((f, s, i) => `${f}`.replace(`{${i}}`, s), sentence3)

console.log(result3)

// result3: 
// man is dumb and plants

```

## Using "regex back reference"

- \w vs \1

https://docs.microsoft.com/en-us/dotnet/standard/base-types/backreference-constructs-in-regular-expressions

(\w)	Match a word character and assign it to the first capturing group.
\1	Match the next character that is the same as the value of the first capturing group.

```
C# example

using System;
using System.Text.RegularExpressions;

public class Example
{
   public static void Main()
   {
      string pattern = @"(\w)\1";
      string input = "trellis llama webbing dresser swagger";
      foreach (Match match in Regex.Matches(input, pattern))
         Console.WriteLine("Found '{0}' at position {1}.",
                           match.Value, match.Index);
   }
}
// The example displays the following output:
//       Found 'll' at position 3.
//       Found 'll' at position 8.
//       Found 'bb' at position 16.
//       Found 'ss' at position 25.
//       Found 'gg' at position 33.

```

- A good example

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#switching_words_in_a_string

```
const out = document.getElementById('output');

const re = /(\w+)\s(\w+)/;
const str = 'Jane Smith';
const newstr = str.replace(re, '$2, $1');
console.log(newstr);

const someday = moment('2011-01-01 09:30');
//let output = someday.format('h:mm a.').replace(/(\w+)\s(\w+)m./, '$1 $2.m.');
let output = someday.format('h:mm a.').replace(/\s(\w+)m./, ' $1.m.');

out.innerText = output;
```




