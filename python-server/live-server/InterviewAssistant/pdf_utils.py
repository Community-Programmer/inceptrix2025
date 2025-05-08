import fitz

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from a given PDF file.
    :param pdf_path: Path to the PDF file
    :return: Extracted text from the PDF file
    """
    doc = fitz.open(pdf_path)
    return "\n".join(page.get_text() for page in doc)
