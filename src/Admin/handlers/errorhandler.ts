/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

export const catchErrors = (fn:any) => {
  return function (req:any, res:any, next:any) {
    return fn(req, res, next).catch(next);
  };
};

  /*
    Not Found Error Handler
  
    If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
  */
  exports.notFound = (req:any, res:any, next:any) => {
    res.status(404).json({
      success: false,
      message: "Api url doesn't exist ",
    });
  };
  
  /*
    Development Error Handler
  
    In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
  */
  exports.developmentErrors = (err:any, req:any, res:any, next:any) => {
    err.stack = err.stack || "";
    const errorDetails = {
      message: err.message,
      status: err.status,
      stackHighlighted: err.stack.replace(
        /[a-z_-\d]+.js:\d+:\d+/gi,
        "<mark>$&</mark>"
      ),
    };
  
    res.status(500).json({
      success: false,
      message: "Oops ! Error in Server",
    });
  };
  
  /*
    Production Error Handler
  
    No stacktraces are leaked to admin
  */
  exports.productionErrors = (err:any, req:any, res:any, next:any) => {
    res.status(500).json({
      success: false,
      message: "Oops ! Error in Server",
    });
  };
  