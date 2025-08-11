# backend/analysis/signing.py
import os
from io import BytesIO
from typing import Optional

from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
from pyhanko.sign import signers
from pyhanko.sign.signers import PdfSignatureMetadata, SigFieldSpec
from pyhanko.sign import timestamps

def sign_pdf_bytes_visible(
    pdf_bytes: bytes,
    pfx_path: str,
    pfx_password: str,
    tsa_url: Optional[str] = None,
    tsa_cert_path: Optional[str] = None,
    field_name: str = "Signature1",
    reason: str = "Laudo pericial assinado digitalmente",
    location: str = "Perícia Grafotécnica"
) -> bytes:
    """
    Assina digitalmente um PDF (bytes) com campo de assinatura VISÍVEL
    no rodapé da última página.

    - pdf_bytes: bytes do PDF a ser assinado
    - pfx_path: caminho para arquivo .p12/.pfx
    - pfx_password: senha do arquivo pfx
    - tsa_url: URL do TSA (opcional)
    - tsa_cert_path: PEM do CA TSA (opcional)
    - field_name: nome do campo de assinatura (default "Signature1")
    - reason: razão da assinatura
    - location: local da assinatura
    """

    if not os.path.exists(pfx_path):
        raise FileNotFoundError(f"PFX file not found at {pfx_path}")

    passphrase = pfx_password.encode('utf-8') if isinstance(pfx_password, str) else pfx_password
    signer = signers.SimpleSigner.load_pkcs12(pfx_file=pfx_path, passphrase=passphrase)

    timestamper = None
    if tsa_url:
        if tsa_cert_path and os.path.exists(tsa_cert_path):
            timestamper = timestamps.HTTPTimeStamper(url=tsa_url, certificate=tsa_cert_path)
        else:
            timestamper = timestamps.HTTPTimeStamper(url=tsa_url)

    signature_meta = PdfSignatureMetadata(
        field_name=field_name,
        reason=reason,
        location=location,
    )

    # Configurar campo visível no rodapé (A4 padrão)
    # Posição em pontos (1 ponto = 1/72 inch)
    # Ajuste se precisar: (x, y, width, height)
    sig_field_spec = SigFieldSpec(
        sig_field_name=field_name,
        box=(50, 30, 200, 50),  # canto inferior esquerdo: x=50pt, y=30pt, largura=200pt, altura=50pt
        on_page=-1  # última página (-1)
    )

    w = IncrementalPdfFileWriter(BytesIO(pdf_bytes))

    signed_pdf = signers.sign_pdf(
        w,
        signature_meta,
        signer=signer,
        timestamper=timestamper,
        existing_fields_only=False,
        new_field_spec=sig_field_spec,
    )

    if hasattr(signed_pdf, 'getvalue'):
        return signed_pdf.getvalue()
    return bytes(signed_pdf)
