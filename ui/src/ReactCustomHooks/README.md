# React Custom Hooks

React Hooks allow for common functions to be used in multiple components. Where
possible, any reusable logic that could be shared across multiple components
should be done so as a hook, which resides in this directory. All hooks should
follow our coding style, and the React best practises for hook implementation.

## Test approach

Hooks should be designed and tested as a developer would use them. Ergo, tests
should be written with the end user in mind, covering the cases/behaviours they 
would use it in.

## File structure

For a new custom hook `MyHook`, the expected file structure is:

```
src/
    ReactCustomHooks/
        index.js
        MyHook/
            README.md
            MyComponent.spec.js
            MyComponent.hook.js
```

where;
    - `index.js` is the top level module where all hooks are exported.
    When implemented, `MyHook` would be added to that index.js for use
    across the UI.
    - `README.md` is the documentation/design doc for this hook
    - `*.spec.js` are the tests for this hook
    - `*.hook.js` is the hook implementation itself

## List of custom hooks implemented

- useWebsocket <link to readme here>
- useTranslation <link to readme here>
- useKafkaVertxWebsocket <link to readme here>