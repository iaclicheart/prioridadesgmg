from PIL import Image
import sys

def make_transparent(img_path):
    try:
        img = Image.open(img_path).convert("RGBA")
        datas = img.getdata()
        newData = []
        for item in datas:
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        img.putdata(newData)
        img.save(img_path, "PNG")
        print("Success")
    except Exception as e:
        print("Error:", e)

make_transparent("logo.png")
