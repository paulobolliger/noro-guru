import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializa o Resend com a chave da API das variáveis de ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

// Define o tipo de dados esperado no corpo da requisição
interface RequestBody {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

export async function POST(req: NextRequest) {
  try {
    const { nome, email, assunto, mensagem } = (await req.json()) as RequestBody;

    // Validação simples dos dados recebidos
    if (!nome || !email || !assunto || !mensagem) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    // Envia o e-mail usando a biblioteca Resend
    const { data, error } = await resend.emails.send({
      from: 'Contato Nomade Guru <contato@nomade.guru>', // O e-mail DEVE ser de um domínio verificado no Resend
      to: ['guru@nomade.guru'], // E-mail de destino
      // CORREÇÃO APLICADA AQUI: 'reply_to' foi alterado para 'replyTo'
      replyTo: email, 
      subject: `Nova mensagem de ${nome}: ${assunto}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Nova Mensagem do Site</h2>
          <p>Você recebeu uma nova mensagem através do formulário de contato.</p>
          <hr>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Assunto:</strong> ${assunto}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${mensagem.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    // Se o Resend retornar um erro, informa no console e retorna uma resposta de erro
    if (error) {
      console.error('Erro do Resend:', error);
      return NextResponse.json({ error: 'Erro ao enviar e-mail.' }, { status: 500 });
    }

    // Se tudo correr bem, retorna uma mensagem de sucesso
    return NextResponse.json({ message: 'E-mail enviado com sucesso!', data });

  } catch (err) {
    console.error('Erro no servidor:', err);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}

