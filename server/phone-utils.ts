import { parsePhoneNumberFromString } from "libphonenumber-js";

export interface PhoneCountryResult {
  country: string | null;
  region: "india" | "international";
}

export function detectCountryFromPhone(phoneNumber: string): PhoneCountryResult {
  try {
    // Normalize the phone number
    let normalizedPhone = phoneNumber.trim();
    
    // Remove leading zeros (common in local format like 09876543210)
    normalizedPhone = normalizedPhone.replace(/^0+/, "");
    
    // Try parsing as-is first (handles +91, +1, etc.)
    let parsed = parsePhoneNumberFromString(normalizedPhone);
    
    // If not parsed and starts with 91, try with + (handles 919876543210)
    if (!parsed && normalizedPhone.startsWith("91") && normalizedPhone.length >= 12) {
      parsed = parsePhoneNumberFromString("+" + normalizedPhone);
    }
    
    // If parsed successfully, return the country
    if (parsed && parsed.country) {
      const country = parsed.country;
      const region = country === "IN" ? "india" : "international";
      return { country, region };
    }
    
    // If still not parsed and is exactly 10 digits starting with 6-9, assume India
    // (Indian mobile numbers always start with 6, 7, 8, or 9)
    if (/^[6-9]\d{9}$/.test(normalizedPhone)) {
      return { country: "IN", region: "india" };
    }
    
    // Default to international for unrecognized formats
    return { country: null, region: "international" };
  } catch (error) {
    console.error("Error parsing phone number:", error);
    return { country: null, region: "international" };
  }
}
