import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.warn(
    'Twilio credentials not configured. SMS features will be disabled. ' +
    'Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to enable SMS.'
  );
}

export const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

export interface SendSMSParams {
  to: string;
  message: string;
}

export interface SendSMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send SMS to a single phone number
 */
export async function sendSMS({ to, message }: SendSMSParams): Promise<SendSMSResult> {
  if (!twilioClient || !twilioPhoneNumber) {
    return {
      success: false,
      error: 'Twilio not configured',
    };
  }

  try {
    // Ensure phone number is in E.164 format (+1XXXXXXXXXX)
    const formattedPhone = to.startsWith('+') ? to : `+1${to.replace(/\D/g, '')}`;

    const messageResponse = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedPhone,
    });

    return {
      success: true,
      messageId: messageResponse.sid,
    };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send SMS to multiple phone numbers
 */
export async function sendBulkSMS(
  recipients: string[],
  message: string
): Promise<{ total: number; successful: number; failed: number; errors: string[] }> {
  const results = await Promise.allSettled(
    recipients.map((phone) => sendSMS({ to: phone, message }))
  );

  const successful = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success
  ).length;
  const failed = results.length - successful;
  const errors = results
    .filter((r) => r.status === 'fulfilled' && !r.value.success)
    .map((r) => (r.status === 'fulfilled' ? r.value.error : 'Unknown error'))
    .filter(Boolean) as string[];

  return {
    total: recipients.length,
    successful,
    failed,
    errors,
  };
}

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
