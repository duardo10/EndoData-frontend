/**
 * Utilitários para impressão de receitas
 */

/**
 * Gera conteúdo HTML para impressão de receitas
 */
export function generatePrintContent(receiptsData: any[], title: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 30px;
          }
          .receipt {
            margin-bottom: 40px;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            page-break-inside: avoid;
          }
          .receipt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          .receipt-info {
            margin-bottom: 15px;
          }
          .receipt-info div {
            margin-bottom: 5px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          .items-table th,
          .items-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .items-table th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .total {
            text-align: right;
            font-weight: bold;
            font-size: 16px;
            margin-top: 10px;
          }
          .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .status-pending { background-color: #fef3c7; color: #92400e; }
          .status-paid { background-color: #d1fae5; color: #065f46; }
          .status-cancelled { background-color: #fee2e2; color: #991b1b; }
          @media print {
            body { margin: 0; }
            .receipt { page-break-after: always; }
            .receipt:last-child { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>EndoData - ${title}</h1>
          <p>Data de Geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>Total de Receitas: ${receiptsData.length}</p>
        </div>
        
        ${receiptsData.map((receipt: any) => `
          <div class="receipt">
            <div class="receipt-header">
              <h3>Receita #${receipt.id.substring(0, 8)}</h3>
              <span class="status status-${receipt.status}">
                ${receipt.status === 'pending' ? 'Pendente' : 
                  receipt.status === 'paid' ? 'Pago' : 'Cancelado'}
              </span>
            </div>
            
            <div class="receipt-info">
              <div><strong>Paciente:</strong> ${receipt.patient?.name || 'N/A'}</div>
              <div><strong>CPF:</strong> ${receipt.patient?.cpf || 'N/A'}</div>
              <div><strong>Médico:</strong> ${receipt.user?.name || 'N/A'}</div>
              <div><strong>CRM:</strong> ${receipt.user?.crm || 'N/A'}</div>
              <div><strong>Data:</strong> ${new Date(receipt.date).toLocaleDateString('pt-BR')}</div>
            </div>

            ${receipt.items && receipt.items.length > 0 ? `
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Quantidade</th>
                    <th>Valor Unitário</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${receipt.items.map((item: any) => `
                    <tr>
                      <td>${item.description}</td>
                      <td>${item.quantity}</td>
                      <td>R$ ${parseFloat(item.unitPrice.toString()).toFixed(2)}</td>
                      <td>R$ ${parseFloat(item.totalPrice.toString()).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>Nenhum item encontrado.</p>'}
            
            <div class="total">
              <strong>Valor Total: R$ ${receipt.totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        `).join('')}
      </body>
    </html>
  `
}

/**
 * Abre janela de impressão com o conteúdo fornecido
 */
export function openPrintWindow(htmlContent: string): void {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 500)
  } else {
    alert('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.')
  }
}
