# Test utils

Details regarding the approaches and terminology around test can be found
[here](../../docs/Test.md). This readme details code used to enable 
testing for this UI.

## Files in this directory

Files found in this directory are helper functions and utilities to make 
writing and maintating tests as easy as possible. If the barriers to entry for 
writing and working with tests are lowered, implementation can be achieved 
faster, at higher quality, and be more focused on what the user experience is 
expected.

For a new test helper or utility function, eg `TestHelper`, the expected 
structure is as follows:

```
src/
    TestUtils/
        index.js
        TestHelper.testutil.js
```

where;
    - `index.js` is the top level module where all utils are exported.
    When implemented, `TestHelper` would be added to that index.js for use
    across the UI.
    - `*.testutil.js` is the utility module/function