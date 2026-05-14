import React from 'react';

/* ─── PRINT RULES ─────────────────────────────────────── */
const PRINT_CSS = `
  @media print {
    @page { size: A4 portrait; margin: 15mm; }
    body  { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin: 0; background: #fff !important; }
    .no-print { display: none !important; }
    .no-print-bg { background-color: transparent !important; padding: 0 !important; }
    #print-bill-wrapper { 
      box-shadow: none !important; 
      margin: 0 !important; 
      border: none !important; 
      border-radius: 0 !important;
      padding: 0 !important;
      width: 100% !important; 
      max-width: none !important;
      min-height: auto !important; 
    }
  }
`;

const TOTAL_ROWS = 12;

/* ─── Number to Words (Indian system) ───────────────────── */
function numberToWords(n) {
    if (n === 0) return 'Zero';
    const a = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
        'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen',
        'Seventeen','Eighteen','Nineteen'];
    const b = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
    const inWords = (num) => {
        if (num < 20) return a[num];
        if (num < 100) return b[Math.floor(num/10)] + (num % 10 ? ' ' + a[num % 10] : '');
        if (num < 1000) return a[Math.floor(num/100)] + ' Hundred' + (num % 100 ? ' ' + inWords(num % 100) : '');
        if (num < 100000) return inWords(Math.floor(num/1000)) + ' Thousand' + (num % 1000 ? ' ' + inWords(num % 1000) : '');
        if (num < 10000000) return inWords(Math.floor(num/100000)) + ' Lakh' + (num % 100000 ? ' ' + inWords(num % 100000) : '');
        return inWords(Math.floor(num/10000000)) + ' Crore' + (num % 10000000 ? ' ' + inWords(num % 10000000) : '');
    };
    const rupees = Math.floor(n);
    const paise  = Math.round((n - rupees) * 100);
    let result = inWords(rupees) + ' Rupees';
    if (paise > 0) result += ' and ' + inWords(paise) + ' Paise';
    return result + ' Only';
} 

export default function PrintBill({ bill }) {
    if (!bill) return null;

    const items = [...(bill.items || [])];
    const total = bill.grandTotal ?? items.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const dateStr = new Date(bill.date).toLocaleDateString('en-GB').replace(/\//g, '-');
    const billNo = String(bill.billNumber).padStart(4, '0');

    const gridRows = Array.from({ length: TOTAL_ROWS }, (_, i) => items[i] ?? null);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#e5e7eb', padding: '20px' }} className="no-print-bg">
            <style>{PRINT_CSS}</style>

            <div
                id="print-bill-wrapper"
                style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    width: '100%',
                    maxWidth: '850px',
                    minHeight: '1100px',
                    boxSizing: 'border-box',
                    padding: '50px 60px',
                    fontFamily: "Arial, sans-serif",
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    margin: '0 auto'
                }}
            >
                {/* ════ HEADER ════ */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 10px' }}>
                        <Contact phone="9321595520" name="Rajesh Jha" />
                        <Contact phone="9423357405" name="Deonarayan Jha" />
                    </div>

                    <h1 style={{
                        fontSize: '46px',
                        fontWeight: '900',
                        margin: '0',
                        textTransform: 'uppercase',
                        fontFamily: "'Arial Black', Impact, sans-serif",
                        lineHeight: '1.1',
                        letterSpacing: '1px'
                    }}>
                        RAJESH BOREWELL
                    </h1>

                    <div style={{ marginTop: '0px', marginBottom: '8px' }}>
                        <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '700', 
                            borderBottom: '1px solid #000', 
                            paddingBottom: '2px',
                            display: 'inline-block'
                        }}>
                            Spl. in : Borwell Motor Repairing & Sales of All Types of Borwell Motors & Spare Parts
                        </span>
                    </div>

                    <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                        <div>Shop No. 1, Abhimanyu Kadu Chawl No. 1, Near Ganesh Temple, </div>
                        <div>Ashela Pada, Ulhasnagar - 421 004. • Email : rajeshborewell002@gmail.com</div>
                        <div style={{ fontWeight: '700', marginTop: '4px', fontSize: '12px' }}>
                            A/c. No. : 3358002100068446 &nbsp;&nbsp;&nbsp; IFSC : PUNB0335800
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '12px' }}>PAN No. : ALDPJ9814H</div>
                    </div>

                    {/* The Heavy Horizontal Line */}
                    <div style={{ borderTop: '2px solid #000', marginTop: '12px', marginBottom: '15px' }} />
                </div>

                {/* ════ BILL INFO ════ */}
                <div style={{ padding: '0 5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontSize: '15px', fontWeight: '700' }}>No.</span>
                            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '2px' }}>{billNo}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontSize: '15px', fontWeight: '700' }}>Date</span>
                            <span style={{ borderBottom: '1px solid #000', minWidth: '150px', textAlign: 'center', fontSize: '16px', fontWeight: '500', paddingBottom: '2px' }}>
                                {dateStr}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '700' }}>M/s.</span>
                        <span style={{ fontSize: '16px', fontWeight: '700', textTransform: 'uppercase', borderBottom: '1px solid #000', flex: 1, paddingBottom: '2px' }}>
                            {bill.clientName}
                        </span>
                    </div>
                </div>

                {/* ════ TABLE ════ */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000' }}>
                        <colgroup>
                            <col style={{ width: '8%' }} />
                            <col style={{ width: '46%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '18%' }} />
                            <col style={{ width: '18%' }} />
                        </colgroup>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #000' }}>
                                <Th borderRight>SR.<br/>NO.</Th>
                                <Th borderRight>PARTICULARS</Th>
                                <Th borderRight>QTY.</Th>
                                <Th borderRight>RATE</Th>
                                <Th>AMOUNT</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {gridRows.map((item, i) => (
                                <tr key={i} style={{ height: '38px', borderBottom: '1px solid #e5e7eb' }}>
                                    <Td borderRight align="center">{item ? i + 1 : ''}</Td>
                                    <Td borderRight align="left" padLeft>{item?.particulars ?? ''}</Td>
                                    <Td borderRight align="center">{item?.qty ?? ''}</Td>
                                    <Td borderRight align="right">{item ? '₹ ' + Number(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</Td>
                                    <Td align="right" fontWeight={item ? "600" : "normal"}>{item ? '₹ ' + Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</Td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ borderTop: '2px solid #000', height: '42px' }}>
                                <td colSpan={3} style={{ borderRight: '1px solid #000', padding: '8px 16px', fontSize: '11px', fontStyle: 'italic', fontWeight: '700', verticalAlign: 'middle' }}>
                                    {numberToWords(total)}
                                </td>
                                <td style={{ borderRight: '1px solid #000', padding: '8px 12px', textAlign: 'center', fontWeight: '800', fontSize: '14px' }}>TOTAL</td>
                                <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: '800', fontSize: '15px' }}>₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* ════ FOOTER ════ */}
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '15px' }}>
                    <div style={{ textAlign: 'right', fontWeight: '800', fontSize: '15px', marginTop: '10px' }}>
                        For RAJESH BOREWELL
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '100px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '220px', borderTop: '1px solid #000', marginBottom: '8px' }}></div>
                            <span style={{ fontSize: '14px', fontWeight: '700' }}>Party's Signature</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>(Authorized Signatory)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Th({ children, borderRight }) {
    return (
        <th style={{
            padding: '12px 4px', fontSize: '12px', fontWeight: '800',
            borderRight: borderRight ? '1px solid #000' : 'none',
            textAlign: 'center'
        }}>{children}</th>
    );
}

function Td({ children, borderRight, align, padLeft, fontWeight }) {
    return (
        <td style={{
            padding: padLeft ? '6px 16px' : '6px 6px', fontSize: '13px',
            fontWeight: fontWeight || 'normal',
            borderRight: borderRight ? '1px solid #000' : 'none',
            textAlign: align
        }}>{children}</td>
    );
}

function Contact({ phone, name }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
            <span style={{ fontSize: '13px', fontWeight: '800' }}>{name} : {phone}</span>
        </div>
    );
}