import os
import re
from pypdf import PdfReader

pdf_path = 'User Terms and Conditions.pdf'
out_path = 'app/termsandcondition/page.tsx'

os.makedirs(os.path.dirname(out_path), exist_ok=True)

reader = PdfReader(pdf_path)
text = ""
for page in reader.pages:
    text += page.extract_text() + "\n"

# Clean up
text = re.sub(r'Page \d+ of \d+', '', text)

lines = [line.strip() for line in text.split('\n') if line.strip()]

content_jsx = []

for line in lines:
    escaped_line = line.replace('{', '&#123;').replace('}', '&#125;').replace('<', '&lt;').replace('>', '&gt;')
    
    # Heuristic for header
    if re.match(r'^\d+\.\s+[A-Z\s&]+$', line) or line == 'USER TERMS & CONDITIONS':
        content_jsx.append(f'            <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-[#CCFF00]/90 group-hover:text-[#CCFF00] transition-colors">\n              {escaped_line}\n            </h2>')
    elif re.match(r'^\d+\.\d+\s+', line):
        content_jsx.append(f'            <h3 className="text-lg font-semibold mt-6 mb-2 text-white/90">\n              {escaped_line}\n            </h3>')
    elif re.match(r'^[a-z]\)', line) or re.match(r'^\([a-z]\)', line):
        content_jsx.append(f'            <p className="text-white/60 leading-relaxed md:text-lg mb-2 ml-4">\n              {escaped_line}\n            </p>')
    else:
        content_jsx.append(f'            <p className="text-white/60 leading-relaxed md:text-lg mb-4">\n              {escaped_line}\n            </p>')

content_jsx_str = "\n".join(content_jsx)

template = f"""'use client';

import PageLayout from "../components/PageLayout";

export default function TermsAndConditions() {{
  return (
    <PageLayout>
      <div className="rounded-[32px] md:rounded-[48px] border border-white/10 bg-black/40 backdrop-blur-2xl p-8 md:p-16 text-white shadow-2xl premium-glow mb-20">
        <header className="mb-12 border-b border-white/10 pb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            Terms & <span className="text-[#CCFF00]">Conditions.</span>
          </h1>
        </header>

        <div className="space-y-4 group">
{content_jsx_str}
        </div>
      </div>
    </PageLayout>
  );
}}
"""

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(template)

print("Successfully written to", out_path)
