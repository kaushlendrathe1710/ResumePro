import { parsePhoneNumberFromString } from "libphonenumber-js";

export interface PhoneCountryResult {
  country: string | null;
  region: "india" | "international";
}

export function detectCountryFromPhone(phoneNumber: string): PhoneCountryResult {
  try {
    const parsed = parsePhoneNumberFromString(phoneNumber);
    
    if (!parsed || !parsed.country) {
      return { country: null, region: "international" };
    }
    
    const country = parsed.country;
    const region = country === "IN" ? "india" : "international";
    
    return { country, region };
  } catch (error) {
    console.error("Error parsing phone number:", error);
    return { country: null, region: "international" };
  }
}
