import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg

def create_recovery_video():
    src_images = [
        r"C:\Users\muawi\.gemini\antigravity-ide\brain\eb50cb86-b8ec-4de0-a5ac-63429656d54e\scene1_subdued_walk_1792560830731.jpg",
        r"C:\Users\muawi\.gemini\antigravity-ide\brain\eb50cb86-b8ec-4de0-a5ac-63429656d54e\scene2_decision_quit_1792560930205.jpg",
        r"C:\Users\muawi\.gemini\antigravity-ide\brain\eb50cb86-b8ec-4de0-a5ac-63429656d54e\scene3_compassionate_care_1792560990386.jpg",
        r"C:\Users\muawi\.gemini\antigravity-ide\brain\eb50cb86-b8ec-4de0-a5ac-63429656d54e\scene4_hope_renewal_1792561041044.jpg"
    ]
    
    out_dir = r"e:\Muawia\Khyber Rehabilation Center\frontend\public\videos"
    os.makedirs(out_dir, exist_ok=True)
    out_video_path = os.path.join(out_dir, "recovery-journey.mp4")
    out_poster_path = os.path.join(out_dir, "recovery-journey-poster.jpg")
    
    # Save poster image directly from Scene 4 (high-res)
    img_poster = Image.open(src_images[3])
    img_poster.save(out_poster_path, quality=92)
    print("Poster saved to:", out_poster_path)

    width, height = 1280, 720
    fps = 24
    
    # Narrative captions for each scene
    scenes_meta = [
        {
            "tag": "ACT I • THE SHADOWS",
            "caption": "Every struggle begins in isolation. You don't have to carry it alone.",
            "zoom_start": 1.0,
            "zoom_end": 1.08,
            "pan_x": 0,
            "pan_y": 0.02
        },
        {
            "tag": "ACT II • THE TURNING POINT",
            "caption": "A single conscious decision: choosing to pause, let go, and ask for help.",
            "zoom_start": 1.02,
            "zoom_end": 1.12,
            "pan_x": 0.01,
            "pan_y": 0.03
        },
        {
            "tag": "ACT III • COMPASSIONATE CARE",
            "caption": "Evidence-based medical detox and empathetic counseling restore trust.",
            "zoom_start": 1.05,
            "zoom_end": 1.0,
            "pan_x": -0.01,
            "pan_y": 0
        },
        {
            "tag": "ACT IV • A PURPOSEFUL LIFE",
            "caption": "Restoring Dignity. Rebuilding Lives. Recovery is possible for everyone.",
            "zoom_start": 1.0,
            "zoom_end": 1.07,
            "pan_x": 0.02,
            "pan_y": -0.01
        }
    ]
    
    loaded_imgs = [Image.open(p).convert("RGB") for p in src_images]
    
    # Try finding an Arial or Segoe UI font, fallback to default
    try:
        font_tag = ImageFont.truetype("arialbd.ttf", 20)
        font_caption = ImageFont.truetype("arial.ttf", 26)
        font_brand = ImageFont.truetype("arialbd.ttf", 16)
    except Exception:
        font_tag = ImageFont.load_default()
        font_caption = ImageFont.load_default()
        font_brand = ImageFont.load_default()

    frames_per_scene = int(fps * 5.0)  # 5.0 seconds per scene
    crossfade_frames = int(fps * 1.0)  # 1.0 second crossfade

    # Pre-render scenes frames
    def get_scene_frame(scene_idx, t_norm):
        # t_norm from 0.0 to 1.0
        base_img = loaded_imgs[scene_idx]
        meta = scenes_meta[scene_idx]
        
        # Ken burns zoom
        current_zoom = meta["zoom_start"] + (meta["zoom_end"] - meta["zoom_start"]) * t_norm
        
        orig_w, orig_h = base_img.size
        crop_w = orig_w / current_zoom
        crop_h = orig_h / current_zoom
        
        # Pan offset
        shift_x = (orig_w - crop_w) * (0.5 + meta["pan_x"] * t_norm)
        shift_y = (orig_h - crop_h) * (0.5 + meta["pan_y"] * t_norm)
        
        shift_x = max(0, min(orig_w - crop_w, shift_x))
        shift_y = max(0, min(orig_h - crop_h, shift_y))
        
        cropped = base_img.crop((shift_x, shift_y, shift_x + crop_w, shift_y + crop_h))
        frame = cropped.resize((width, height), Image.Resampling.LANCZOS)
        
        # Add subtle cinematic gradient overlay at bottom
        draw = ImageDraw.Draw(frame, "RGBA")
        
        # Vignette shadow at bottom for text readability
        overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        for y in range(height - 180, height):
            alpha = int(185 * ((y - (height - 180)) / 180) ** 1.3)
            overlay_draw.line([(0, y), (width, y)], fill=(4, 18, 30, alpha))
            
        # Top branding subtle banner
        for y in range(0, 60):
            alpha = int(110 * (1 - (y / 60)))
            overlay_draw.line([(0, y), (width, y)], fill=(2, 20, 36, alpha))
            
        frame = Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")
        draw = ImageDraw.Draw(frame)
        
        # Center watermark top
        draw.text((36, 20), "KHYBER REHABILITATION CENTER • PESHAWAR", font=font_brand, fill=(255, 255, 255, 220))
        
        # Tag pill
        tag_text = meta["tag"]
        draw.text((40, height - 120), tag_text, font=font_tag, fill=(1, 156, 220))
        
        # Main caption
        caption_text = meta["caption"]
        draw.text((40, height - 85), caption_text, font=font_caption, fill=(255, 255, 255))
        
        return np.array(frame)

    print("Generating video frames and encoding with imageio_ffmpeg...")
    writer = imageio_ffmpeg.write_frames(
        out_video_path,
        (width, height),
        fps=fps,
        codec="libx264",
        pix_fmt_in="rgb24",
        pix_fmt_out="yuv420p",
        ffmpeg_log_level="warning",
        output_params=["-crf", "20", "-preset", "medium", "-movflags", "+faststart"]
    )
    writer.send(None)  # initialize generator

    num_scenes = len(loaded_imgs)
    total_frames = 0
    
    for s_idx in range(num_scenes):
        for f in range(frames_per_scene):
            t_norm = f / float(frames_per_scene)
            current_frame = get_scene_frame(s_idx, t_norm)
            
            # Check if in crossfade to next scene
            if s_idx < num_scenes - 1 and f >= (frames_per_scene - crossfade_frames):
                fade_alpha = (f - (frames_per_scene - crossfade_frames)) / float(crossfade_frames)
                next_frame = get_scene_frame(s_idx + 1, 0.0)
                blended = (current_frame.astype(np.float32) * (1.0 - fade_alpha) + next_frame.astype(np.float32) * fade_alpha).astype(np.uint8)
                writer.send(blended)
            else:
                writer.send(current_frame)
            total_frames += 1

    writer.close()
    print(f"Video created successfully! Total frames: {total_frames}, saved to: {out_video_path}")
    
    file_size_mb = os.path.getsize(out_video_path) / (1024 * 1024)
    print(f"File size: {file_size_mb:.2f} MB")

if __name__ == "__main__":
    create_recovery_video()
