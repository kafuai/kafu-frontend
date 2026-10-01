import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { data: emailData, error } = await resend.emails.send({
     
      from: 'Acme <onboarding@resend.dev>', 
      
      
      to: ['s.ayesh@sitcoglobal.com'], 
      
      
      // replyTo: data.workEmail, 
      
      subject: `New Demo Request - ${data.companyName}`,
      
      
      html: `
        <h2>New Demo Request Received</h2>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.workEmail}</p>
        <p><strong>Company:</strong> ${data.companyName}</p>
        <p><strong>Job Title:</strong> ${data.jobTitle}</p>
        <p><strong>Company Size:</strong> ${data.companySize}</p>
        <p><strong>Phone:</strong> ${data.phoneNumber || 'Not provided'}</p>
        <br/>
        <h3>Use Case:</h3>
        <p>${data.useCase || 'Not provided'}</p>
      `
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: emailData?.id }, { status: 200 });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}