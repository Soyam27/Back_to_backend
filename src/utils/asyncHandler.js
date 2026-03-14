const asyncHandler = (requestHandler) =>{
    return (req,res,next)=> Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err));
}

export default asyncHandler;


//Promise.resolve().then(()=>fn(req,res,next)).catch(...)



// import APIResponse from "./apiResponse.js";
// import APIError from "./apiError.js";

// const asyncHandler = (requestHandler) => {
//   return async (req, res, next) => {
//     try {

//       const response = await requestHandler(req, res);

//       if (response) {
//         return res
//           .status(response.statusCode)
//           .json(new APIResponse(response.statusCode, response.data, response.message));
//       }

//       return res
//         .status(404)
//         .json(new APIError(404, "Response not found"));

//     } catch (error) {
//       return res
//         .status(error.statusCode || 500)
//         .json(new APIError(error.statusCode || 500, error.message || "Internal Server Error"));
//     }
//   };
// };

// export default asyncHandler;