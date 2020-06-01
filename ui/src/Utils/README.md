# Utils

This directory will contain any common functions used in the UI which are not
React component based (ie meaning a Hook would not suitable). These utilities
are expected to be small helper functions, with comments accompanying them
to descirbe usage. All naming should be clear and perscriptive.

- Content to follow -

## File structure

For a new utility function or module, eg `MyUtilModule`, the expected structure 
is as follows:

```
src/
    Utils/
        index.js
        MyUtilModule.util.js
```

where;
    - `index.js` is the top level module where all utils are exported.
    When implemented, `MyUtilModule` would be added to that index.js for use
    across the UI.
    - `*.util.js` is the utility module/function