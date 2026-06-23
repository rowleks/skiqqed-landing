const { Resend } = require('resend');

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, _context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    // Validate email
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Invalid email address' }),
      };
    }

    // Send welcome email using Resend
    const data = await resend.emails.send({
      from: 'SKIQQED <noreply@resend.dev>',
      to: [email],
      subject: 'Welcome to SKIQQED Waitlist',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #14130E;">You're on the list! 🎉</h2>
          <p style="color: #3A372C; line-height: 1.6;">
            Thanks for joining the SKIQQED waitlist! We're building something special for the next generation of African talent.
          </p>
          <p style="color: #3A372C; line-height: 1.6;">
            We'll email you the moment SKIQQED goes live. Get ready to find your first opportunity.
          </p>
          <div style="background: #C8F23B; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #14130E; margin: 0; font-weight: bold;">
              What's coming:
            </p>
            <ul style="color: #14130E; margin: 10px 0 0 20px;">
              <li>Verified internships across Africa</li>
              <li>1-on-1 mentorship programs</li>
              <li>Hands-on skill labs</li>
              <li>Career tracks: Technical, Creative, Vocational, Business</li>
            </ul>
          </div>
          <p style="color: #8A8474; font-size: 14px;">
            Questions? Reply to this email. We'd love to hear from you.
          </p>
          <p style="color: #8A8474; font-size: 14px; margin-top: 30px;">
            — The SKIQQED Team
          </p>
        </div>
      `,
    });

    console.log('Email sent successfully:', data);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email added to waitlist',
        data 
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to add email to waitlist',
        error: error.message 
      }),
    };
  }
};
