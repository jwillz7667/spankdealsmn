/**
 * Client-safe phone number utilities (no server dependencies)
 */

/**
 * Validate phone number format (US numbers)
 */
export function validatePhoneNumber(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // US phone numbers should be 10 or 11 digits (with country code)
  if (digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))) {
    return true;
  }

  return false;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return phone;
}
