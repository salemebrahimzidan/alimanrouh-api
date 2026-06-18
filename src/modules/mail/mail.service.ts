import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendMail(
    to: string,
    subject: string,
    html: string,
  ) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async sendBookingNotification(data: {
    fullName: string;
    email?: string;
    phone: string;
    packageName: string;
    travelDate: string;
  }) {
    return this.sendMail(
      process.env.ADMIN_EMAIL!,
      'New Booking Received',
      `
        <h2>New Booking</h2>

        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email ?? '-'}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Package:</strong> ${data.packageName}</p>
        <p><strong>Travel Date:</strong> ${data.travelDate}</p>
      `,
    );
  }

  async sendContactNotification(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) {
    return this.sendMail(
      process.env.ADMIN_EMAIL!,
      'New Contact Message',
      `
        <h2>New Contact Message</h2>

        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone ?? '-'}</p>
        <p><strong>Subject:</strong> ${data.subject ?? '-'}</p>

        <hr/>

        <p>${data.message}</p>
      `,
    );
  }

  async sendBookingStatusEmail(
    email: string,
    fullName: string,
    status: string,
  ) {
    return this.sendMail(
      email,
      'Booking Status Updated',
      `
        <h2>Hello ${fullName}</h2>

        <p>Your booking status has been updated.</p>

        <h3>${status}</h3>

        <p>Thank you for choosing Al Iman Rouh.</p>
      `,
    );
  }
}