import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API funcionando!',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  return NextResponse.json({
    success: true,
    message: 'Dados recebidos com sucesso',
    data: body
  });
}
