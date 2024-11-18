// app/api/send/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    const { data, error } = await resend.emails.send({
      from: 'Your Portfolio <onboarding@resend.dev>',
      to: ['hengleap70@gmail.com'], // Your email address
      subject: `New Contact Form Submission: ${subject}`,
      react: EmailTemplate({ 
        name, 
        email, 
        subject, 
        message 
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}