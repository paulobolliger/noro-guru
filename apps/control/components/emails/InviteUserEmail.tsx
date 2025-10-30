import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface InviteUserEmailProps {
  userEmail: string;
  inviteToken: string;
  inviteLink: string;
  role: string;
}

export const InviteUserEmail = ({
  userEmail,
  inviteToken,
  inviteLink,
  role,
}: InviteUserEmailProps) => (
  <Html>
    <Head />
    <Preview>Convite para o Control Plane da Noro Guru</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Bem-vindo(a) ao Control Plane</Heading>
        
        <Text style={text}>
          Você foi convidado para se juntar ao Control Plane da Noro Guru como <strong>{role}</strong>.
        </Text>

        <Text style={text}>
          Para aceitar o convite e configurar sua conta, clique no botão abaixo:
        </Text>

        <Link href={inviteLink} style={button}>
          Aceitar Convite
        </Link>

        <Text style={text}>
          Por questões de segurança, este link expira em 24 horas. Se precisar de um novo convite,
          entre em contato com o administrador.
        </Text>

        <Text style={footer}>
          Se você não esperava este convite, por favor ignore este email.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default InviteUserEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#1D1C1D',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#1D1C1D',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '4px',
  color: '#fff',
  display: 'block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 0',
  margin: '32px 0',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '100%',
};

const footer = {
  color: '#6B7280',
  fontSize: '14px',
  margin: '32px 0 0',
};