// lib/email/templates/booking-confirmation.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface BookingConfirmationEmailProps {
  /** Nome do cliente */
  customerName: string;
  /** Número da reserva */
  bookingNumber: string;
  /** Destino */
  destination: string;
  /** Data de início */
  startDate: string;
  /** Data de fim */
  endDate: string;
  /** Valor total */
  totalAmount: string;
  /** Moeda */
  currency?: string;
  /** URL para ver detalhes */
  detailsUrl?: string;
  /** Items da reserva */
  items?: Array<{
    name: string;
    description?: string;
    quantity?: number;
    price?: string;
  }>;
}

export default function BookingConfirmationEmail({
  customerName = 'Cliente',
  bookingNumber = '000000',
  destination = 'Destino',
  startDate = '01/01/2025',
  endDate = '07/01/2025',
  totalAmount = '0,00',
  currency = 'EUR',
  detailsUrl,
  items = [],
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reserva confirmada: {destination} - #{bookingNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reserva Confirmada! ✅</Heading>

          <Text style={text}>
            Olá {customerName},
          </Text>

          <Text style={text}>
            Sua reserva foi confirmada com sucesso! Abaixo estão os detalhes da sua viagem:
          </Text>

          {/* Informações da reserva */}
          <Section style={infoBox}>
            <Row>
              <Column>
                <Text style={label}>Número da Reserva</Text>
                <Text style={value}>#{bookingNumber}</Text>
              </Column>
            </Row>

            <Hr style={hr} />

            <Row>
              <Column>
                <Text style={label}>Destino</Text>
                <Text style={value}>{destination}</Text>
              </Column>
            </Row>

            <Hr style={hr} />

            <Row>
              <Column style={{ width: '50%' }}>
                <Text style={label}>Data de Início</Text>
                <Text style={value}>{startDate}</Text>
              </Column>
              <Column style={{ width: '50%' }}>
                <Text style={label}>Data de Fim</Text>
                <Text style={value}>{endDate}</Text>
              </Column>
            </Row>
          </Section>

          {/* Items da reserva */}
          {items.length > 0 && (
            <>
              <Text style={sectionTitle}>Serviços Incluídos</Text>
              <Section style={itemsBox}>
                {items.map((item, index) => (
                  <div key={index}>
                    <Row style={{ marginBottom: '12px' }}>
                      <Column>
                        <Text style={itemName}>{item.name}</Text>
                        {item.description && (
                          <Text style={itemDescription}>{item.description}</Text>
                        )}
                      </Column>
                      {item.price && (
                        <Column style={{ width: '30%', textAlign: 'right' }}>
                          <Text style={itemPrice}>
                            {currency} {item.price}
                          </Text>
                        </Column>
                      )}
                    </Row>
                    {index < items.length - 1 && <Hr style={itemDivider} />}
                  </div>
                ))}
              </Section>
            </>
          )}

          {/* Total */}
          <Section style={totalBox}>
            <Row>
              <Column>
                <Text style={totalLabel}>Valor Total</Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={totalValue}>{currency} {totalAmount}</Text>
              </Column>
            </Row>
          </Section>

          {/* Botão de ação */}
          {detailsUrl && (
            <Section style={buttonContainer}>
              <Button style={button} href={detailsUrl}>
                Ver Detalhes da Reserva
              </Button>
            </Section>
          )}

          <Text style={text}>
            Obrigado por escolher nossos serviços! Se tiver alguma dúvida, não hesite em nos contatar.
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
  marginBottom: '16px',
};

const sectionTitle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  padding: '24px 48px 12px',
  marginBottom: '0',
};

const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  margin: '24px 48px',
  padding: '20px',
};

const label = {
  color: '#6b7280',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  fontWeight: 'bold',
  margin: '0 0 4px',
};

const value = {
  color: '#333',
  fontSize: '16px',
  margin: '0',
};

const hr = {
  border: 'none',
  borderTop: '1px solid #e5e7eb',
  margin: '16px 0',
};

const itemsBox = {
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  margin: '12px 48px 24px',
  padding: '20px',
};

const itemName = {
  color: '#333',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const itemDescription = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '4px 0 0',
};

const itemPrice = {
  color: '#333',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const itemDivider = {
  border: 'none',
  borderTop: '1px solid #e5e7eb',
  margin: '12px 0',
};

const totalBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  margin: '24px 48px',
  padding: '20px',
};

const totalLabel = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
};

const totalValue = {
  color: '#16a34a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
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
