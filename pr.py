import qrcode

def crear_qr_basico(texto, nombre_archivo="qr.png", 
                     version=None, box_size=10, border=4, 
                     error_correction=qrcode.constants.ERROR_CORRECT_M):
    qr = qrcode.QRCode(
        version=version,
        error_correction=error_correction,
        box_size=box_size,
        border=border,
    )
    qr.add_data(texto)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(nombre_archivo)
    return nombre_archivo

# Uso:
crear_qr_basico("https://caxasdigital.com/redirect.html", "mi_qr_url.png")
