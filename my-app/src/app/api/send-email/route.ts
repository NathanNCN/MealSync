import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';


export async function POST(request: Request) {
    try {
        // Get ingredients and email from request body
        const { ingredients, email } = await request.json();


        sgMail.setApiKey(process.env.NEXT_PUBLIC_TWILIO_API_KEY!);

        // Send email with shopping list
        await sgMail.send({
            from: 'ncncodingtesters@gmail.com',
            to: email,
            subject: 'Your next shopping list',
            text: `Your next shopping list: ${ingredients.join(', ')}`
        });

        return NextResponse.json({ status: 200, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ status: 500, message: 'Error sending email' });
    }
}
