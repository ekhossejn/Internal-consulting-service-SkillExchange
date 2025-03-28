
def check_is_image(image):
    if image.content_type.startswith('image'):
        return True
    else:
        return False
