// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import nodemailer from 'nodemailer';

export const server = {
  sendContact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(3, "El nombre es muy corto"),
      email: z.string().email("Email inválido"),
      message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
    }),
    handler: async (input) => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: import.meta.env.GMAIL_USER,
          pass: import.meta.env.GMAIL_PASS, // La clave de 16 letras
        },
      });

      await transporter.sendMail({
        from: input.email,
        to: import.meta.env.GMAIL_USER,
        subject: `Nuevo mensaje de ${input.name}`,
        html: `<p><strong>Nombre:</strong> ${input.name}</p>
               <p><strong>Email:</strong> ${input.email}</p>
               <p><strong>Mensaje:</strong> ${input.message}</p>`,
      });

      return { success: true };
    }
  })
}