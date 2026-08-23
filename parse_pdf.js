const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = 'User Terms and Conditions.pdf';
const outPath = 'app/termsandcondition/page.tsx';

fs.mkdirSync('app/termsandcondition', { recursive: true });

fs.readFile(pdfPath, (err, dataBuffer) => {
  if (err) throw err;
  
  pdf(dataBuffer).then(function(data) {
    let text = data.text;
    
    // Clean up text
    // Remove page numbers like "Page 1 of 26"
    text = text.replace(/Page \d+ of \d+/g, '');
    
    // Split into lines
    let lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Group into sections
    // We'll just render it as paragraphs and headers.
    // If a line is all caps or starts with number dot space (e.g. "1. DEFINITIONS") we can make it a header.
    // Or just let's put it in a clean format.
    
    let contentJsx = lines.map((line, index) => {
      // Escape braces and brackets for JSX
      let escapedLine = line.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      // Check if it's a main header like "1. DEFINITIONS"
      if (/^\d+\.\s+[A-Z\s]+$/.test(line) || line === 'USER TERMS & CONDITIONS') {
         return `            <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-[#CCFF00]/90 group-hover:text-[#CCFF00] transition-colors">\n              ${escapedLine}\n            </h2>`;
      } 
      // Subheaders like 1.1 
      else if (/^\d+\.\d+\s+/.test(line)) {
         return `            <h3 className="text-lg font-semibold mt-6 mb-2 text-white/90">\n              ${escapedLine}\n            </h3>`;
      }
      else {
         return `            <p className="text-white/60 leading-relaxed md:text-lg mb-4">\n              ${escapedLine}\n            </p>`;
      }
    }).join('\n');

    let template = `'use client';

import PageLayout from "../components/PageLayout";

export default function TermsAndConditions() {
  return (
    <PageLayout>
      <div className="rounded-[32px] md:rounded-[48px] border border-white/10 bg-black/40 backdrop-blur-2xl p-8 md:p-16 text-white shadow-2xl premium-glow mb-20">
        <header className="mb-12 border-b border-white/10 pb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            Terms & <span className="text-[#CCFF00]">Conditions.</span>
          </h1>
        </header>

        <div className="space-y-4 group">
${contentJsx}
        </div>
      </div>
    </PageLayout>
  );
}
`;

    fs.writeFileSync(outPath, template);
    console.log('File written to ' + outPath);
  });
});
