// lib/email/templates/welcome.tsx
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

interface WelcomeEmailProps {
  /** Nome do usuário */
  name: string;
  /** URL do dashboard */
  dashboardUrl?: string;
  /** Nome da empresa/agência */
  companyName?: string;
}

export default function WelcomeEmail({
  name = 'Cliente',
  dashboardUrl = 'https://app.noro.travel',
  companyName = 'Noro Travel',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bem-vindo ao {companyName}! Comece a planejar suas viagens agora.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bem-vindo ao {companyName}! 🌍</Heading>

          <Text style={text}>
            Olá {name},
          </Text>

          <Text style={text}>
            É um prazer tê-lo conosco! Sua conta foi criada com sucesso e você já pode começar
            a explorar todas as funcionalidades da nossa plataforma.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Acessar Painel
            </Button>
          </Section>

          <Text style={text}>
            Se você tiver alguma dúvida ou precisar de ajuda, não hesite em nos contatar.
            Estamos aqui para tornar sua experiência incrível!
          </Text>

          <Text style={footer}>
            Atenciosamente,<br />
            Equipe {companyName}
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

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '24px 48px',
};
