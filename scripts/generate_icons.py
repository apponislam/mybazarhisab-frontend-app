import os
import json
from PIL import Image, ImageDraw

# Paths
WORKSPACE_DIR = r"e:\Next Js\Bazar Hisab\mybazarhisab-frontend-app"
MASTER_ICON_PATH = r"C:\Users\Appon\.gemini\antigravity-ide\brain\5ac42a06-494b-4268-9a92-0f529f6dbd6f\bazar_hisab_icon_1784085063864.png"
IOS_ICONSET_DIR = os.path.join(WORKSPACE_DIR, "ios", "AwesomeProject", "Images.xcassets", "AppIcon.appiconset")
ANDROID_RES_DIR = os.path.join(WORKSPACE_DIR, "android", "app", "src", "main", "res")

def make_circular(img):
    """Returns a circular masked copy of the image."""
    img = img.convert("RGBA")
    size = img.size
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size[0], size[1]), fill=255)
    
    result = Image.new("RGBA", size, (0, 0, 0, 0))
    result.paste(img, (0, 0), mask=mask)
    return result

def generate_ios_icons(master_img):
    print("Generating iOS icons...")
    if not os.path.exists(IOS_ICONSET_DIR):
        os.makedirs(IOS_ICONSET_DIR)
        
    ios_sizes = {
        "icon-40.png": (40, 40),
        "icon-60.png": (60, 60),
        "icon-58.png": (58, 58),
        "icon-87.png": (87, 87),
        "icon-80.png": (80, 80),
        "icon-120.png": (120, 120),
        "icon-180.png": (180, 180),
        "icon-1024.png": (1024, 1024)
    }
    
    for filename, size in ios_sizes.items():
        out_path = os.path.join(IOS_ICONSET_DIR, filename)
        # For iOS, icons should not have transparency/alpha channel (Apple app store requirement)
        # Fill transparency with background color if it exists, or just convert to RGB
        resized = master_img.resize(size, Image.Resampling.LANCZOS)
        rgb_img = Image.new("RGB", size, (26, 14, 7))  # `#1a0e07` theme background (Warm Dark Brown)
        if resized.mode == "RGBA":
            rgb_img.paste(resized, (0, 0), mask=resized.split()[3])
        else:
            rgb_img.paste(resized, (0, 0))
        rgb_img.save(out_path, "PNG")
        print(f"Saved: {out_path} ({size[0]}x{size[1]})")

    # Update Contents.json
    contents_path = os.path.join(IOS_ICONSET_DIR, "Contents.json")
    contents_data = {
        "images" : [
            {
                "idiom" : "iphone",
                "scale" : "2x",
                "size" : "20x20",
                "filename" : "icon-40.png"
            },
            {
                "idiom" : "iphone",
                "scale" : "3x",
                "size" : "20x20",
                "filename" : "icon-60.png"
            },
            {
                "idiom" : "iphone",
                "scale" : "2x",
                "size" : "29x29",
                "filename" : "icon-58.png"
            },
            {
                "idiom" : "iphone",
                "scale" : "3x",
                "size" : "29x29",
                "filename" : "icon-87.png"
            },
            {
                "idiom" : "iphone",
                "scale" : "2x",
                "size" : "40x40",
                "filename" : "icon-80.png"
            },
            {
                "idiom" : "iphone",
                "scale" : "3x",
                "size" : "40x40",
                "filename" : "icon-120.png"
            },
            {
                "idiom" : "iphone",
                "scale" : "2x",
                "size" : "60x60",
                "filename" : "icon-120.png"
            },
            {
                "idiom" : "iphone",
                "scale" : "3x",
                "size" : "60x60",
                "filename" : "icon-180.png"
            },
            {
                "idiom" : "ios-marketing",
                "scale" : "1x",
                "size" : "1024x1024",
                "filename" : "icon-1024.png"
            }
        ],
        "info" : {
            "author" : "xcode",
            "version" : 1
        }
    }
    with open(contents_path, "w") as f:
        json.dump(contents_data, f, indent=2)
    print(f"Updated: {contents_path}")

def generate_android_icons(master_img):
    print("Generating Android icons...")
    android_folders = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192
    }
    
    circular_master = make_circular(master_img)
    
    for folder, size in android_folders.items():
        folder_path = os.path.join(ANDROID_RES_DIR, folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            
        # Regular square/rounded icon
        regular_out = os.path.join(folder_path, "ic_launcher.png")
        resized_regular = master_img.resize((size, size), Image.Resampling.LANCZOS)
        resized_regular.save(regular_out, "PNG")
        print(f"Saved regular: {regular_out} ({size}x{size})")
        
        # Circular icon
        circular_out = os.path.join(folder_path, "ic_launcher_round.png")
        resized_circular = circular_master.resize((size, size), Image.Resampling.LANCZOS)
        resized_circular.save(circular_out, "PNG")
        print(f"Saved circular: {circular_out} ({size}x{size})")

def main():
    if not os.path.exists(MASTER_ICON_PATH):
        print(f"Error: Master icon not found at {MASTER_ICON_PATH}")
        return
        
    master_img = Image.open(MASTER_ICON_PATH)
    generate_ios_icons(master_img)
    generate_android_icons(master_img)
    print("App icon generation completed successfully!")

if __name__ == "__main__":
    main()
