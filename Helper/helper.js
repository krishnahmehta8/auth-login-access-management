const JWT_SECRET = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiS3Jpc2huYSBNZWh0YS83OTg0NzA3MTc3LzIzMDQxOTk2IiwianRpIjoiZTI3NjJjNzYtZmUzOC00M2YzLTlmNzUtNTdjZTgxOGM2MzZkIiwiaWF0IjoxNjA3NDM1NTkwLCJleHAiOjE2MDc0MzkyMTV9.Ic9g1Va0LXP4Mv-2lnbpCvj5fYHqLE9XGDP47BUi8ms"
const jwt = require('jwt-simple');
const util_1 = require('util');

// HELPER FILE FOR SOME COMPLEX OPERATIONS

exports.createToken = async (data) => {
    console.log(data);
    if(!util_1.isNullOrUndefined(data.userName) && !util_1.isNullOrUndefined(data.role)){
    let token = await jwt.encode({
        "userName": data.userName,
        "role": data.role,
        "email" : data.email
    }, JWT_SECRET);
    console.warn('Bearer '+token);
    return 'Bearer '+token;
}else{
    return null;
}
}