//Use the handle the process undefined error with react.
if (typeof process === 'undefined') {
    window.process = {
      env: {}
    };
  }