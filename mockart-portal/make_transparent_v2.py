from PIL import Image
img = Image.open('logo.png').convert("RGBA")
datas = img.getdata()
newData = []
# Remove white
for item in datas:
    if item[0] > 220 and item[1] > 220 and item[2] > 220:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)
img.putdata(newData)
img.save('mockart_logo_v2.png', "PNG")
