// lib/email/templates/reset-password.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  /** Nome do usuário */
  name: string;
  /** URL para redefinir senha */
  resetUrl: string;
  /** Tempo de expiração do link (em horas) */
  expiresIn?: number;
}

export default function ResetPasswordEmail({
  name = 'Cliente',
  resetUrl,
  expiresIn = 24,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Redefinir sua senha</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Redefinir Senha</Heading>

          <Text style={text}>
            Olá {name},
          </Text>

          <Text style={text}>
            Recebemos uma solicitação para redefinir a senha da sua conta.
            Se você não fez esta solicitação, pode ignorar este email com segurança.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Redefinir Senha
            </Button>
          </Section>

          <Text style={text}>
            Este link expirará em {expiresIn} horas por motivos de segurança.
          </Text>

          <Text style={text}>
            Se o botão acima não funcionar, copie e cole este link no seu navegador:
          </Text>

          <Text style={code}>
            {resetUrl}
          </Text>

          <Text style={footer}>
            Atenciosamente,<br />
            Equipe Noro Travel
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Estilos
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
};

const buttonContainer = {
  padding: '27px 48px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
};

const code = {
  backgroundColor: '#f4f4f4',
  border: '1px solid #e1e1e1',
  borderRadius: '4px',
  color: '#333',
  fontSize: '14px',
  fontFamily: 'monospace',
  padding: '12px',
  margin: '16px 48px',
  wordBreak: 'break-all' as const,
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '24px 48px',
};
