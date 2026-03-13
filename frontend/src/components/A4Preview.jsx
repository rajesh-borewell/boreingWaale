import React from 'react';

/* ─── Design Tokens ──────────────────────────────────────── */
const NAVY   = '#1e3a5f';
const ORANGE = '#e07815';
const MUTED  = '#64748b';
const LIGHT  = '#f1f5f9';
const BORDER = '#cbd5e1';
const WHITE  = '#ffffff';
const FONT   = "'IBM Plex Sans', 'Inter', Arial, sans-serif";

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

export default function A4Preview({ bill }) {
    if (!bill) return null;

    const MIN_ROWS = 12;
    const items = [...bill.items];
    const emptyRowsCount = Math.max(0, MIN_ROWS - items.length);
    const emptyRows = Array.from({ length: emptyRowsCount });
    const total = bill.grandTotal ?? items.reduce((s, i) => s + (i.amount || 0), 0);
    const formattedDate = new Date(bill.date).toLocaleDateString('en-GB').replace(/\//g, '-');
    const billNo = String(bill.billNumber).padStart(4, '0');

    return (
        <div 
            className="printable-area" 
            style={{ 
                padding: '40px', 
                backgroundColor: '#f1f5f9', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'flex-start', // Prevent stretching the inner container vertically
                width: '850px', 
                minHeight: '1202px',      // 850 * 1.414 (Exact A4 proportion)
                boxSizing: 'border-box',
                margin: '0 auto'
            }}
        >
            <div
                className="main-invoice-container"
                style={{
                    fontFamily: FONT,
                    backgroundColor: WHITE,
                    color: '#1e293b',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `2px solid ${NAVY}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    // flex 1 so it can grow if contents are many,
                    // but on sparse bills it takes the rest of the height gracefully
                    flex: 1
                }}
            >
                {/* ── TOP ACCENT BAR ── */}
                <div style={{ height: '6px', background: `linear-gradient(90deg, ${NAVY} 0%, ${ORANGE} 100%)`, flexShrink: 0 }} />

            {/* ════════════════════════════════════════
                HEADER
            ════════════════════════════════════════ */}
            <div style={{ padding: '22px 28px 18px 28px', borderBottom: `2px solid ${NAVY}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>

                    {/* LEFT: Company name + contact info */}
                    <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                        {/* Vertical navy bar */}
                        <div style={{ width: '4px', borderRadius: '2px', backgroundColor: NAVY, alignSelf: 'stretch', flexShrink: 0 }} />

                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: '26px', fontWeight: '800', color: NAVY, margin: '0 0 2px', letterSpacing: '0.5px', textTransform: 'uppercase', lineHeight: 1.1 }}>
                                Rajesh Borewell
                            </h1>
                            <p style={{ fontSize: '10px', color: MUTED, margin: '0 0 12px', fontWeight: '500' }}>
                                Spl. in : Borwell Motor Repairing &amp; Sales of All Types of Borwell Motors &amp; Spare Parts
                            </p>

                            {/* Contact grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '16px 1fr', rowGap: '5px', columnGap: '7px', alignItems: 'center' }}>
                                <Icon><PhoneIcon /></Icon>
                                <InfoText><b>Rajesh Jha</b> &nbsp;9321595520</InfoText>

                                <Icon><PhoneIcon /></Icon>
                                <InfoText><b>Deonarayan Jha</b> &nbsp;9423357405</InfoText>

                                <Icon top><PinIcon /></Icon>
                                <InfoText>Shop No. 1, Abhimanyu Kadu Chawl No. 1, Near Ganesh Temple,<br />Ashela Pada, Ulhasnagar – 421 004</InfoText>

                                <Icon><MailIcon /></Icon>
                                <InfoText>rajeshborewell002@gmail.com</InfoText>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Invoice badge + Bank card */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                        {/* Invoice badge */}
                        <div style={{
                            backgroundColor: NAVY, borderRadius: '6px', padding: '10px 18px', textAlign: 'center', minWidth: '150px',
                        }}>
                            <p style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.55)', margin: '0 0 2px', letterSpacing: '2px', textTransform: 'uppercase' }}>Invoice</p>
                            <p style={{ fontSize: '22px', fontWeight: '700', color: WHITE, margin: 0, letterSpacing: '2px' }}>#{billNo}</p>
                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', margin: '3px 0 0' }}>{formattedDate}</p>
                        </div>

                        {/* Bank details card */}
                        <div style={{
                            backgroundColor: LIGHT, border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '8px 14px', minWidth: '185px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                                <BankIcon /><span style={{ fontSize: '9px', fontWeight: '700', color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Bank Details</span>
                            </div>
                            <BankRow label="A/c. No." value="3358002100068446" />
                            <BankRow label="IFSC"     value="PUNB0335800" />
                            <BankRow label="PAN No."  value="ALDPJ9814H" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
                BILL-TO BAND
            ════════════════════════════════════════ */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '9px 28px', backgroundColor: LIGHT, borderBottom: `2px solid ${NAVY}`,
            }}>
                <div>
                    <p style={{ fontSize: '9px', fontWeight: '700', color: MUTED, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 2px' }}>Bill To</p>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: NAVY, margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{bill.clientName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '9px', fontWeight: '700', color: MUTED, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 2px' }}>Date</p>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: NAVY, margin: 0 }}>{formattedDate}</p>
                </div>
            </div>

            {/* ════════════════════════════════════════
                TABLE
            ════════════════════════════════════════ */}
            <div className="table-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', flex: 1 }}>
                    <thead>
                        <tr style={{ backgroundColor: NAVY }}>
                            <Th w="8%"  a="center">Sr.</Th>
                            <Th w="44%" a="left"  pl="14px">Particulars</Th>
                            <Th w="10%" a="center">Qty</Th>
                            <Th w="18%" a="right" pr="12px">Rate (₹)</Th>
                            <Th w="20%" a="right" pr="12px" last>Amount (₹)</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : LIGHT }}>
                                <Td a="center" br>{i + 1}</Td>
                                <Td a="left"   br pl="14px" fw="600">{item.particulars}</Td>
                                <Td a="center" br>{item.qty}</Td>
                                <Td a="right"  br pr="12px">
                                    ₹ {Number(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </Td>
                                <Td a="right"  pr="12px" fw="700" color={NAVY}>
                                    ₹ {Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </Td>
                            </tr>
                        ))}
                        {emptyRows.map((_, i) => (
                            <tr key={`e${i}`} style={{ backgroundColor: (items.length + i) % 2 === 0 ? WHITE : LIGHT }}>
                                <td style={eTd(true)}  />
                                <td style={eTd(true)}  />
                                <td style={eTd(true)}  />
                                <td style={eTd(true)}  />
                                <td style={eTd(false)} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ════ AMOUNT IN WORDS  +  GRAND TOTAL (same row, two boxes) ════ */}
            <div style={{
                borderTop: `2px solid ${NAVY}`,
                display: 'flex',
                alignItems: 'stretch',
            }}>
                {/* Left box — amount in words */}
                <div style={{
                    flex: 1,
                    padding: '10px 20px',
                    backgroundColor: LIGHT,
                    borderRight: `2px solid ${NAVY}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '2px',
                }}>
                    <span style={{ fontSize: '8px', fontWeight: '700', color: MUTED, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Amount in Words</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: NAVY, fontStyle: 'italic', lineHeight: '1.4' }}>{numberToWords(total)}</span>
                </div>

                {/* Right box — Grand Total */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    padding: '10px 28px',
                    gap: '2px',
                    flexShrink: 0,
                    minWidth: '180px',
                }}>
                    <span style={{ fontSize: '9px', fontWeight: '700', color: MUTED, textTransform: 'uppercase', letterSpacing: '1px' }}>Grand Total</span>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: ORANGE, letterSpacing: '0.5px' }}>
                        ₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* ════════════════════════════════════════
                FOOTER — Digitally Verified only
            ════════════════════════════════════════ */}
            <div className="signature-container" style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: '12px', padding: '12px 28px',
                borderTop: `1px solid ${BORDER}`,
                backgroundColor: '#f8fafc',
            }}>
                <VerifiedIcon />
                <div>
                    <p style={{ fontSize: '10.5px', fontWeight: '700', color: '#16a34a', margin: 0, letterSpacing: '0.3px' }}>
                        Digitally Verified
                    </p>
                    <p style={{ fontSize: '8.5px', color: MUTED, margin: '1px 0 0', fontWeight: '400' }}>
                        Computer-generated invoice · No physical signature required
                    </p>
                </div>
            </div>

            {/* ── BOTTOM ACCENT BAR ── */}
            <div style={{ height: '6px', background: `linear-gradient(90deg, ${NAVY} 0%, ${ORANGE} 100%)`, flexShrink: 0 }} />
        </div>
        </div>
    );
}

/* ─── Layout helpers ─────────────────────────────────────── */
function Icon({ children, top }) {
    return (
        <span style={{ color: NAVY, display: 'flex', justifyContent: 'center', alignSelf: top ? 'start' : 'center', paddingTop: top ? '2px' : 0 }}>
            {children}
        </span>
    );
}
function InfoText({ children }) {
    return <span style={{ fontSize: '11px', color: '#374151', lineHeight: '1.55', fontWeight: '400' }}>{children}</span>;
}
function BankRow({ label, value }) {
    return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline', marginBottom: '2px' }}>
            <span style={{ fontSize: '9.5px', fontWeight: '600', color: MUTED, minWidth: '50px' }}>{label}</span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: NAVY }}>: {value}</span>
        </div>
    );
}

/* ─── Table helpers ──────────────────────────────────────── */
function Th({ children, w, a, pl, pr, last }) {
    return (
        <th style={{
            width: w, textAlign: a,
            padding: `9px ${pr || '6px'} 9px ${pl || '6px'}`,
            fontSize: '10.5px', fontWeight: '700', color: WHITE,
            textTransform: 'uppercase', letterSpacing: '0.4px',
            borderRight: last ? 'none' : '1px solid rgba(255,255,255,0.15)',
        }}>{children}</th>
    );
}
function Td({ children, a, pl, pr, br, fw, color }) {
    return (
        <td style={{
            padding: `7px ${pr || '6px'} 7px ${pl || '6px'}`,
            fontSize: '13px', fontWeight: fw || '400',
            color: color || '#1e293b', textAlign: a,
            borderBottom: `1px solid ${BORDER}`,
            borderRight: br ? `1px solid ${BORDER}` : 'none',
        }}>{children}</td>
    );
}
function eTd(br) {
    return { height: '26px', borderBottom: `1px solid ${BORDER}`, borderRight: br ? `1px solid ${BORDER}` : 'none' };
}

/* ─── Icons ──────────────────────────────────────────────── */
function PhoneIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.81 3.52 2 2 0 0 1 3.8 1.5h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>;
}
function PinIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>;
}
function MailIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>;
}
function BankIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="10" width="18" height="11" rx="1"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/>
    </svg>;
}
function VerifiedIcon() {
    return (
        <div style={{
            width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dcfce7',
            border: '2px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#16a34a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        </div>
    );
}
