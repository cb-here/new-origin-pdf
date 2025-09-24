export const sendResponse = ({
  message,
  title,
  Response = {},
  Error = null,
  statusCode = 200,
  status = true,
  res,
}) => {
  return res.status(statusCode).json({
    statusCode,
    status,
    title,
    message,
    ...(status !== false &&
      Response &&
      ((Array.isArray(Response) && Response.length > 0) ||
        (!Array.isArray(Response) && Object.keys(Response).length > 0)) && {
        Response,
      }),
    ...(Error && Error),
  });
};

// bad request responses
export const badRequest = (res, statusCode = 400, message, Error = {}) =>
  sendResponse({
    res,
    statusCode,
    status: false,
    message,
    title: "Request failed",
    Error,
  });

export const successResponse = (res, statusCode = 200, message = "", Response = {}) =>
  sendResponse({
    res,
    statusCode,
    status: true,
    message,
    title: "Request successful",
    Response,
  });
