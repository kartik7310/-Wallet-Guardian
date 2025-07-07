export function GenerateOtp(){
const  otp = Math.floor(100000 + Math.random()*900000).toString();
return otp;
}

export function ExpireOtp(){
  const expireDate = new Date(Date.now()*5*60*1000) //5 min
  return expireDate
}