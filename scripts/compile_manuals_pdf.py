import os
import sys
import re
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(50, 755, "IUTEPAL — Repositorio Digital y Gestión Documental (TEG)")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.6)
            self.line(50, 747, 562, 747)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.6)
        self.line(50, 48, 562, 48)
        
        footer_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(562, 36, footer_text)
        self.drawString(50, 36, "IUTEPAL Puerto Cabello — Documento Institucional Oficial")
        self.restoreState()

def build_pdf_from_md(md_path, pdf_path, title_main):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=50,
        rightMargin=50,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_blue = colors.HexColor("#04224e")
    accent_yellow = colors.HexColor("#b45309")
    text_color = colors.HexColor("#1e293b")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=primary_blue,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=accent_yellow,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=primary_blue,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#0284c7"),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'H3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=primary_blue,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=text_color,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=15,
        bulletIndent=5,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'Code',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0f172a")
    )

    table_header_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=text_color
    )

    story = []
    
    # Process markdown lines
    in_code_block = False
    code_lines = []
    in_table = False
    table_rows = []

    def flush_table():
        nonlocal in_table, table_rows
        if not table_rows:
            in_table = False
            return
        
        col_count = max(len(r) for r in table_rows)
        # normalize row lengths
        grid_data = []
        for idx, row in enumerate(table_rows):
            clean_cells = []
            for cell_text in row:
                c_style = table_header_style if idx == 0 else table_cell_style
                # escape XML characters
                safe_txt = cell_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                clean_cells.append(Paragraph(safe_txt, c_style))
            while len(clean_cells) < col_count:
                clean_cells.append(Paragraph("", table_cell_style))
            grid_data.append(clean_cells)

        t = Table(grid_data, colWidths=[512 / col_count] * col_count)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), primary_blue),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#f8fafc"), colors.white])
        ]))
        story.append(Spacer(1, 4))
        story.append(t)
        story.append(Spacer(1, 6))
        in_table = False
        table_rows = []

    def flush_code():
        nonlocal in_code_block, code_lines
        if not code_lines:
            in_code_block = False
            return
        joined = "\n".join(code_lines).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        p = Paragraph(f"<font face='Courier'>{joined}</font>".replace('\n', '<br/>'), code_style)
        wrapper = Table([[p]], colWidths=[512])
        wrapper.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8)
        ]))
        story.append(Spacer(1, 4))
        story.append(wrapper)
        story.append(Spacer(1, 6))
        in_code_block = False
        code_lines = []

    for raw_line in lines:
        line = raw_line.rstrip()

        # Code blocks
        if line.startswith('```'):
            if in_code_block:
                flush_code()
            else:
                if in_table:
                    flush_table()
                in_code_block = True
                code_lines = []
            continue

        if in_code_block:
            code_lines.append(line)
            continue

        # Tables
        if '|' in line and not line.startswith('#'):
            cells = [c.strip() for c in line.split('|')[1:-1]]
            # separator line check
            if cells and all(re.match(r'^:?-+:?$', c) for c in cells):
                continue
            if cells:
                if not in_table:
                    in_table = True
                    table_rows = []
                table_rows.append(cells)
                continue
        else:
            if in_table:
                flush_table()

        # Horizontal Rule
        if line.strip() in ['---', '***', '___']:
            story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#cbd5e1"), spaceAfter=8, spaceBefore=4))
            continue

        # Headers
        if line.startswith('# '):
            clean = line[2:].strip().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            story.append(Paragraph(clean, title_style))
            continue
        elif line.startswith('## '):
            clean = line[3:].strip().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            story.append(Paragraph(clean, subtitle_style))
            continue
        elif line.startswith('### '):
            clean = line[4:].strip().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            story.append(Paragraph(clean, h1_style))
            continue
        elif line.startswith('#### '):
            clean = line[5:].strip().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            story.append(Paragraph(clean, h2_style))
            continue
        elif line.startswith('##### '):
            clean = line[6:].strip().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            story.append(Paragraph(clean, h3_style))
            continue

        # Bullets
        if line.strip().startswith(('-', '*', '•')) or re.match(r'^\d+\.', line.strip()):
            text = line.strip()
            # remove bullet symbol
            if text.startswith(('-', '*', '•')):
                text = text[1:].strip()
                prefix = "&bull; "
            else:
                m = re.match(r'^(\d+\.)\s*(.*)', text)
                prefix = f"<b>{m.group(1)}</b> "
                text = m.group(2)
            
            # Formats: bold **text**, inline `code`, links [text](url) -> text
            text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', text)
            text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
            text = re.sub(r'`(.*?)`', r"<font face='Courier'>\1</font>", text)
            text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            # restore tags
            text = text.replace('&lt;b&gt;', '<b>').replace('&lt;/b&gt;', '</b>')
            text = text.replace("&lt;font face='Courier'&gt;", "<font face='Courier'>").replace('&lt;/font&gt;', '</font>')
            story.append(Paragraph(prefix + text, bullet_style))
            continue

        # Paragraph
        if line.strip():
            text = line.strip()
            text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', text)
            text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
            text = re.sub(r'`(.*?)`', r"<font face='Courier'>\1</font>", text)
            text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            text = text.replace('&lt;b&gt;', '<b>').replace('&lt;/b&gt;', '</b>')
            text = text.replace("&lt;font face='Courier'&gt;", "<font face='Courier'>").replace('&lt;/font&gt;', '</font>')
            story.append(Paragraph(text, body_style))
        else:
            story.append(Spacer(1, 3))

    if in_code_block:
        flush_code()
    if in_table:
        flush_table()

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully compiled: {os.path.basename(pdf_path)}")

if __name__ == '__main__':
    base_dir = os.path.join(os.path.dirname(__file__), '..', 'Manuales')
    manuals = [
        ('Manual_de_Requisitos_Tecnicos_e_Instalacion.md', 'Manual de Requisitos Técnicos e Instalación.pdf', 'Manual de Requisitos Técnicos e Instalación'),
        ('Manual_de_Usuario.md', 'Manual de Usuario.pdf', 'Manual de Usuario'),
        ('Manual_del_Sistema.md', 'Manual del Sistema.pdf', 'Manual del Sistema')
    ]
    for md, pdf, title in manuals:
        md_file = os.path.join(base_dir, md)
        pdf_file = os.path.join(base_dir, pdf)
        if os.path.exists(md_file):
            print(f"Compiling {md} -> {pdf}...")
            build_pdf_from_md(md_file, pdf_file, title)
        else:
            print(f"File not found: {md_file}")
