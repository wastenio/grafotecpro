from PIL import Image as PILImage, ImageDraw

def zoom_and_highlight(image_path, zoom_factor=1.5, highlights=None):
    """
    Aumenta o tamanho da imagem e adiciona marcações (círculos, retângulos, setas).
    highlights: lista de dicionários com {'type': 'circle'/'rect', 'coords': (x,y,...) , 'color': 'red'}
    """
    img = PILImage.open(image_path)

    # Zoom
    w, h = img.size
    img = img.resize((int(w * zoom_factor), int(h * zoom_factor)), PILImage.LANCZOS)

    # Marcação
    if highlights:
        draw = ImageDraw.Draw(img)
        for mark in highlights:
            color = mark.get('color', 'red')
            if mark['type'] == 'circle':
                draw.ellipse(mark['coords'], outline=color, width=3)
            elif mark['type'] == 'rect':
                draw.rectangle(mark['coords'], outline=color, width=3)

    # Salvar versão temporária
    temp_path = image_path.replace(".", "_marked.")
    img.save(temp_path)
    return temp_path
