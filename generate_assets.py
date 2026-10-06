import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

os.makedirs('portfolio/assets/images', exist_ok=True)
os.makedirs('portfolio/assets/icons', exist_ok=True)

# Font loading helper
def get_font(size, bold=False, mono=False):
    try:
        if mono:
            path = "C:/Windows/Fonts/consolab.ttf" if bold else "C:/Windows/Fonts/consola.ttf"
        else:
            path = "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_gradient(draw, width, height, c1, c2, horizontal=False):
    for i in range(width if horizontal else height):
        ratio = i / (width if horizontal else height)
        r = int(c1[0] * (1 - ratio) + c2[0] * ratio)
        g = int(c1[1] * (1 - ratio) + c2[1] * ratio)
        b = int(c1[2] * (1 - ratio) + c2[2] * ratio)
        if horizontal:
            draw.line([(i, 0), (i, height)], fill=(r, g, b))
        else:
            draw.line([(0, i), (width, i)], fill=(r, g, b))

def draw_card(draw, box, fill_color, border_color=None, border_width=1, radius=16):
    draw.rounded_rectangle(box, radius=radius, fill=fill_color, outline=border_color, width=border_width)

def draw_grid_pattern(draw, width, height, spacing=40, color=(30, 41, 59, 80)):
    for x in range(0, width, spacing):
        draw.line([(x, 0), (x, height)], fill=color, width=1)
    for y in range(0, height, spacing):
        draw.line([(0, y), (width, y)], fill=color, width=1)

# -------------------------------------------------------------
# 1. WHO I AM IMAGE (800x600, 4:3)
# -------------------------------------------------------------
def create_who_i_am():
    w, h = 800, 600
    img = Image.new('RGB', (w, h), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    
    # Background gradient
    draw_gradient(draw, w, h, (10, 15, 29), (15, 23, 42))
    draw_grid_pattern(draw, w, h, spacing=40, color=(24, 35, 60))
    
    # Ambient glows
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([500, -50, 850, 300], fill=(0, 102, 255, 60))
    gdraw.ellipse([-100, 350, 300, 650], fill=(138, 43, 226, 45))
    gdraw.ellipse([250, 200, 550, 500], fill=(0, 229, 255, 30))
    glow = glow.filter(ImageFilter.GaussianBlur(50))
    img.paste(glow, (0, 0), glow)
    
    draw = ImageDraw.Draw(img)
    
    # Main Editor Card
    draw_card(draw, [40, 50, 480, 550], (15, 23, 42, 230), border_color=(51, 65, 85), border_width=1, radius=18)
    
    # Window Header
    draw.rounded_rectangle([40, 50, 480, 95], radius=18, fill=(30, 41, 59))
    draw.rectangle([40, 75, 480, 95], fill=(30, 41, 59)) # square bottom
    draw.ellipse([60, 68, 72, 80], fill=(239, 68, 68))
    draw.ellipse([80, 68, 92, 80], fill=(245, 158, 11))
    draw.ellipse([100, 68, 112, 80], fill=(16, 185, 129))
    
    tab_font = get_font(13, mono=True)
    draw.text((140, 68), "DikshaShukla.config.js", fill=(203, 213, 225), font=tab_font)
    
    # Code Lines
    code_lines = [
        ('const developer = {', (147, 197, 253), 10),
        ('  name: "Diksha Shukla",', (248, 113, 113), 25),
        ('  role: "Frontend Developer",', (52, 211, 153), 25),
        ('  program: "Samsung Innovation Campus",', (96, 165, 250), 25),
        ('  mission: "Craft responsive, user-first",', (251, 191, 36), 25),
        ('  webApps: "with semantic excellence",', (251, 191, 36), 25),
        ('  skills: [', (147, 197, 253), 25),
        ('    "HTML5", "CSS3 Grid/Flexbox",', (192, 132, 252), 40),
        ('    "JavaScript ES6+", "UI/UX",', (192, 132, 252), 40),
        ('    "Git/GitHub", "Accessible Web"', (192, 132, 252), 40),
        ('  ],', (147, 197, 253), 25),
        ('  status: "Open for Opportunities",', (52, 211, 153), 25),
        ('  verifiedRepos: 9', (248, 113, 113), 25),
        ('};', (147, 197, 253), 10),
        ('export default developer;', (96, 165, 250), 10),
    ]
    
    code_font = get_font(13, mono=True)
    y_code = 115
    line_num_font = get_font(12, mono=True)
    for idx, (line, color, indent) in enumerate(code_lines):
        draw.text((55, y_code), f"{idx+1:2d}", fill=(71, 85, 105), font=line_num_font)
        draw.text((55 + indent + 25, y_code), line, fill=color, font=code_font)
        y_code += 28

    # Right Column Cards
    # Profile Summary Card
    draw_card(draw, [510, 50, 760, 280], (17, 24, 39), border_color=(59, 130, 246), border_width=2, radius=18)
    
    # Avatar badge circle in card
    draw.ellipse([605, 75, 665, 135], fill=(37, 99, 235))
    draw.ellipse([608, 78, 662, 132], fill=(15, 23, 42))
    name_init_font = get_font(24, bold=True)
    draw.text((621, 91), "DS", fill=(96, 165, 250), font=name_init_font)
    
    p_name_font = get_font(20, bold=True)
    draw.text((550, 150), "Diksha Shukla", fill=(255, 255, 255), font=p_name_font)
    
    p_sub_font = get_font(13)
    draw.text((535, 180), "Frontend Engineer & Creator", fill=(147, 197, 253), font=p_sub_font)
    
    # Campus Tag
    draw.rounded_rectangle([530, 215, 740, 250], radius=8, fill=(30, 58, 138))
    badge_font = get_font(12, bold=True)
    draw.text((545, 224), "Samsung Innovation Campus", fill=(191, 219, 254), font=badge_font)

    # Core Pillars Card
    draw_card(draw, [510, 305, 760, 550], (17, 24, 39), border_color=(51, 65, 85), border_width=1, radius=18)
    
    card_h_font = get_font(15, bold=True)
    draw.text((530, 325), "CORE PILLARS", fill=(244, 63, 94), font=card_h_font)
    
    pillars = [
        ("Semantic HTML5", "Clean markup structure", (59, 130, 246)),
        ("Modern CSS3", "Grid, Flexbox & Tokens", (168, 85, 247)),
        ("Vanilla JavaScript", "Lightweight interactivity", (234, 179, 8)),
        ("User First Design", "Accessible & Responsive", (16, 185, 129))
    ]
    
    y_pil = 355
    pil_title_font = get_font(14, bold=True)
    pil_sub_font = get_font(12)
    for title, desc, col in pillars:
        draw.ellipse([530, y_pil + 4, 542, y_pil + 16], fill=col)
        draw.text((552, y_pil), title, fill=(241, 245, 249), font=pil_title_font)
        draw.text((552, y_pil + 18), desc, fill=(148, 163, 184), font=pil_sub_font)
        y_pil += 44

    img.save('portfolio/assets/images/who-i-am.webp', 'WEBP', quality=95)
    print("Created who-i-am.webp")

# -------------------------------------------------------------
# 2. MY SKILLS IMAGE (800x600, 4:3)
# -------------------------------------------------------------
def create_my_skills():
    w, h = 800, 600
    img = Image.new('RGB', (w, h), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    
    draw_gradient(draw, w, h, (10, 15, 29), (13, 20, 36))
    draw_grid_pattern(draw, w, h, spacing=40, color=(20, 32, 54))
    
    # Ambient glows
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([250, 150, 550, 450], fill=(0, 102, 255, 55))
    gdraw.ellipse([50, 50, 250, 250], fill=(236, 72, 153, 30))
    gdraw.ellipse([550, 350, 750, 550], fill=(16, 185, 129, 35))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    img.paste(glow, (0, 0), glow)
    
    draw = ImageDraw.Draw(img)
    
    # Connecting circuit lines behind
    cx, cy = 400, 300
    targets = [(180, 160), (620, 160), (180, 440), (620, 440), (400, 110), (400, 490)]
    for tx, ty in targets:
        draw.line([(cx, cy), (tx, ty)], fill=(41, 65, 102), width=2)
    
    # Central Hub
    draw.ellipse([cx - 90, cy - 90, cx + 90, cy + 90], fill=(17, 24, 39), outline=(59, 130, 246), width=3)
    draw.ellipse([cx - 75, cy - 75, cx + 75, cy + 75], fill=(23, 37, 84))
    hub_title_font = get_font(18, bold=True)
    draw.text((cx - 45, cy - 25), "CORE", fill=(255, 255, 255), font=hub_title_font)
    hub_sub_font = get_font(13)
    draw.text((cx - 52, cy + 5), "ENGINEERING", fill=(147, 197, 253), font=hub_sub_font)
    
    # 4 Outer Skill Clusters
    clusters = [
        ([50, 90, 300, 220], "HTML5 & SEMANTIC WEB", ["Accessible Landmarks", "Hierarchical Headings", "SEO Optimization"], (239, 68, 68)),
        ([500, 90, 750, 220], "CSS3 & MODERN STYLING", ["CSS Grid & Flexbox", "Design Tokens / Variables", "Smooth Micro-animations"], (59, 130, 246)),
        ([50, 380, 300, 510], "JAVASCRIPT (ES6+)", ["DOM Manipulation", "Async & Fetch APIs", "Lightweight Vanilla Logic"], (234, 179, 8)),
        ([500, 380, 750, 510], "WORKFLOW & INNOVATION", ["Git & GitHub Versioning", "Samsung Innovation Campus", "Responsive Multi-device"], (16, 185, 129))
    ]
    
    c_head_font = get_font(14, bold=True)
    c_item_font = get_font(12)
    for box, title, items, color in clusters:
        draw_card(draw, box, (15, 23, 42, 240), border_color=color, border_width=1, radius=14)
        draw.text((box[0] + 18, box[1] + 16), title, fill=color, font=c_head_font)
        y_item = box[1] + 44
        for item in items:
            draw.ellipse([box[0] + 18, y_item + 4, box[0] + 24, y_item + 10], fill=color)
            draw.text((box[0] + 32, y_item), item, fill=(203, 213, 225), font=c_item_font)
            y_item += 22
            
    # Top banner
    draw_card(draw, [280, 40, 520, 85], (30, 41, 59), border_color=(96, 165, 250), border_width=1, radius=10)
    b_font = get_font(14, bold=True)
    draw.text((310, 52), "TECHNICAL CAPABILITY", fill=(255, 255, 255), font=b_font)
    
    # Bottom banner
    draw_card(draw, [250, 515, 550, 560], (15, 23, 42), border_color=(51, 65, 85), border_width=1, radius=10)
    score_font = get_font(13)
    draw.text((275, 528), "A11Y • RESPONSIVE • CLEAN CODE", fill=(52, 211, 153), font=score_font)
    
    img.save('portfolio/assets/images/my-skills.webp', 'WEBP', quality=95)
    print("Created my-skills.webp")

# -------------------------------------------------------------
# 3. FUTURE GOAL IMAGE (800x600, 4:3)
# -------------------------------------------------------------
def create_future_goal():
    w, h = 800, 600
    img = Image.new('RGB', (w, h), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    
    draw_gradient(draw, w, h, (10, 15, 29), (17, 24, 48))
    draw_grid_pattern(draw, w, h, spacing=40, color=(20, 32, 54))
    
    # Ambient glows
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([300, 50, 700, 350], fill=(0, 102, 255, 60))
    gdraw.ellipse([50, 250, 450, 550], fill=(168, 85, 247, 45))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    img.paste(glow, (0, 0), glow)
    
    draw = ImageDraw.Draw(img)
    
    # Header tag
    draw_card(draw, [40, 40, 760, 100], (17, 24, 39), border_color=(59, 130, 246), border_width=1, radius=16)
    f_tag_font = get_font(13, bold=True)
    draw.text((65, 54), "STRATEGIC CAREER ROADMAP", fill=(96, 165, 250), font=f_tag_font)
    f_title_font = get_font(18, bold=True)
    draw.text((65, 70), "From Strong Frontend Fundamentals to Intelligent Web Systems", fill=(255, 255, 255), font=f_title_font)
    
    # Ascending Progression Stages (3 Cards)
    stages = [
        (
            [40, 130, 260, 540],
            "PHASE 01",
            "FOUNDATION & CAMPUS",
            "Present",
            (59, 130, 246),
            [
                "Samsung Innovation Campus training",
                "Deep semantic HTML5 & CSS3",
                "Vanilla JavaScript ES6+",
                "9+ GitHub repositories built",
                "Accessible & responsive web design"
            ]
        ),
        (
            [290, 130, 510, 540],
            "PHASE 02",
            "ENTERPRISE FRONTEND",
            "Next Leap",
            (168, 85, 247),
            [
                "Modern framework scaling (React/Next)",
                "Component design systems",
                "State management & TypeScript",
                "Performance & Web Vitals mastery",
                "Open-source collaboration"
            ]
        ),
        (
            [540, 130, 760, 540],
            "PHASE 03",
            "AI & FULLSTACK VISION",
            "Future Horizon",
            (16, 185, 129),
            [
                "AI-assisted UI/UX systems",
                "Audio & sensor interfaces (Vigil/HAR)",
                "Fullstack web architecture",
                "High-impact user experiences",
                "Technical leadership & mentorship"
            ]
        )
    ]
    
    ph_font = get_font(12, bold=True)
    title_font = get_font(14, bold=True)
    badge_f = get_font(11, bold=True)
    bullet_font = get_font(12)
    
    for box, phase, title, timeframe, col, bullets in stages:
        draw_card(draw, box, (15, 23, 42, 240), border_color=col, border_width=2, radius=16)
        
        # Phase header
        draw.text((box[0] + 16, box[1] + 18), phase, fill=col, font=ph_font)
        
        # Time badge
        draw.rounded_rectangle([box[2] - 80, box[1] + 14, box[2] - 16, box[1] + 34], radius=6, fill=col)
        draw.text((box[2] - 74, box[1] + 18), timeframe, fill=(255, 255, 255), font=badge_f)
        
        # Title
        draw.text((box[0] + 16, box[1] + 46), title, fill=(255, 255, 255), font=title_font)
        draw.line([(box[0] + 16, box[1] + 75), (box[2] - 16, box[1] + 75)], fill=(51, 65, 85), width=1)
        
        y_b = box[1] + 95
        for b in bullets:
            draw.ellipse([box[0] + 18, y_b + 4, box[0] + 24, y_b + 10], fill=col)
            draw.text((box[0] + 32, y_b), b, fill=(203, 213, 225), font=bullet_font)
            y_b += 62

    img.save('portfolio/assets/images/future-goal.webp', 'WEBP', quality=95)
    print("Created future-goal.webp")

# -------------------------------------------------------------
# 4. DIKSHA AVATAR IMAGE (400x400, 1:1)
# -------------------------------------------------------------
def create_avatar():
    w, h = 400, 400
    img = Image.new('RGB', (w, h), color=(10, 15, 29))
    draw = ImageDraw.Draw(img)
    
    draw_gradient(draw, w, h, (10, 15, 29), (15, 23, 42))
    
    # Outer glow
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([80, 80, 320, 320], fill=(0, 102, 255, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(40))
    img.paste(glow, (0, 0), glow)
    
    draw = ImageDraw.Draw(img)
    
    # Outer rings
    draw.ellipse([45, 45, 355, 355], outline=(59, 130, 246), width=3)
    draw.ellipse([55, 55, 345, 345], fill=(15, 23, 42))
    
    # Abstract modern coder silhouette / graphic
    # Head & hair
    draw.ellipse([145, 105, 255, 225], fill=(37, 99, 235))
    draw.ellipse([152, 112, 248, 218], fill=(241, 245, 249))
    # Modern glasses / eyes
    draw.rounded_rectangle([165, 145, 205, 165], radius=6, fill=(15, 23, 42))
    draw.rounded_rectangle([195, 145, 235, 165], radius=6, fill=(15, 23, 42))
    draw.line([(200, 155), (205, 155)], fill=(15, 23, 42), width=3)
    # Smile
    draw.arc([185, 175, 215, 195], 0, 180, fill=(15, 23, 42), width=3)
    
    # Body / Shoulders
    draw.ellipse([100, 220, 300, 345], fill=(30, 58, 138))
    draw.ellipse([110, 230, 290, 355], fill=(29, 78, 216))
    
    # Code badge across chest
    draw.rounded_rectangle([130, 275, 270, 310], radius=8, fill=(15, 23, 42), outline=(96, 165, 250), width=1)
    tag_f = get_font(13, bold=True, mono=True)
    draw.text((142, 283), "<Diksha />", fill=(96, 165, 250), font=tag_f)
    
    # Status dot (Available for hire)
    draw.ellipse([275, 275, 305, 305], fill=(16, 185, 129), outline=(15, 23, 42), width=3)
    
    img.save('portfolio/assets/images/diksha-avatar.webp', 'WEBP', quality=95)
    print("Created diksha-avatar.webp")

if __name__ == '__main__':
    create_who_i_am()
    create_my_skills()
    create_future_goal()
    create_avatar()
