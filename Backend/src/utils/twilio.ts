
import twilio from "twilio";
import dotenv from "dotenv";
import logger from "./logger"; 

dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  throw new Error(" Missing Twilio environment variables");
}


const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function sendSms(to: string, message: string) {
  try {
    const response = await client.messages.create({
      body: message,
      to: to.startsWith('+') ? to : `+91${to}`, 
      from: TWILIO_PHONE_NUMBER,
    });

    logger?.info?.(` SMS sent to ${to}: SID => ${response.sid}`) || console.log(` SMS sent to ${to}: SID => ${response.sid}`);
    return response;
  } catch (error: any) {
    logger?.error?.(` SMS failed: ${error.message}`) || console.error(` SMS failed: ${error.message}`);
    throw error;
  }
}

