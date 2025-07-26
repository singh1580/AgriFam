
export const generateUserReportPDF = (profiles: any[], roleFilter: string = 'all') => {
  // Create PDF content as HTML string that can be converted to PDF
  const currentDate = new Date().toLocaleDateString();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>User Management Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 10px;
        }
        .header h1 {
          color: #4CAF50;
          margin: 0;
        }
        .header .date {
          color: #666;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #4CAF50;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .role-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .farmer { background-color: #e8f5e8; color: #2e7d2e; }
        .buyer { background-color: #e8f4fd; color: #1e40af; }
        .admin { background-color: #fef2f2; color: #dc2626; }
        .summary {
          background-color: #f8f9fa;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
          border-left: 4px solid #4CAF50;
        }
        .summary h3 {
          margin-top: 0;
          color: #4CAF50;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌾 AgriConnect - User Management Report${roleFilter !== 'all' ? ` (${roleFilter.toUpperCase()} Users)` : ''}</h1>
        <div class="date">Generated on: ${currentDate}</div>
      </div>
      
      <div class="summary">
        <h3>📊 Summary Statistics</h3>
        <p><strong>Total Users:</strong> ${profiles.length}</p>
        <p><strong>Farmers:</strong> ${profiles.filter(p => p.role === 'farmer').length}</p>
        <p><strong>Buyers:</strong> ${profiles.filter(p => p.role === 'buyer').length}</p>
        <p><strong>Admins:</strong> ${profiles.filter(p => p.role === 'admin').length}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Joined Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${profiles.map(profile => `
            <tr>
              <td>${profile.full_name || 'N/A'}</td>
              <td>${profile.email}</td>
              <td><span class="role-badge ${profile.role}">${profile.role.toUpperCase()}</span></td>
              <td>${profile.phone || 'N/A'}</td>
              <td>${new Date(profile.created_at).toLocaleDateString()}</td>
              <td>Active</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
        <p>This report contains confidential information. Handle with care.</p>
        <p>© 2024 AgriConnect - Agricultural Management Platform</p>
      </div>
    </body>
    </html>
  `;

  // Create a blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `AgriConnect_${roleFilter === 'all' ? 'All_Users' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1) + '_Users'}_Report_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Also create a print-friendly version that opens in new window for PDF conversion
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Auto-trigger print dialog after content loads
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
};
