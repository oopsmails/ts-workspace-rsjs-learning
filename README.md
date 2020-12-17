https://coursetro.com/courses/25/A-Comprehensive-RxJS-Tutorial---Learn-ReactiveX-for-JavaScript-


## This is a test and learn workspace

### Not using yarn anymore

yarn init -y

yarn add rxjs webpack webpack-dev-server typescript ts-loader

yarn add webpack-cli --dev


### Switch to npm

#### Errors: webpack version

config-yargs.js:89
describe: optionsSchema.definitions.output.properties.path.description,
TypeError: Cannot read property 'properties' of undefined

- Take out yarn.lock, otherwise server will not start
- "webpack": "4.19.0", if using "typescript": "^2.8.1", then compile error


#### Typescript version

assert.d.ts(78,47)
      TS1144: '{' or ';' expected.

- "typescript": "~3.7.5", from "typescript": "^2.8.1",


