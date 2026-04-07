# ComfyUI Setup on Darth

**Date**: 2026-04-06
**Server**: darth (10.0.0.117)
**GPU**: NVIDIA GeForce RTX 5060 Ti (16GB VRAM)

## Status: OPERATIONAL

### Access
- **Local**: http://127.0.0.1:8188 (on darth)
- **Network**: http://10.0.0.117:8188 (from LAN)
- **Tailscale**: http://100.92.94.92:8188 (from Tailscale)

### Installed Components
| Component | Version |
|-----------|---------|
| ComfyUI | 0.18.1 |
| Python | 3.10.20 |
| PyTorch | 2.5.1+cu121 |
| CUDA | 12.1 |

### Model
- **SDXL Base 1.0**: `/home/wez/ComfyUI/models/checkpoints/sd_xl_base_1.0.safetensors` (6.5GB)

### Service Management
```bash
# Start manually
cd /home/wez/ComfyUI && source venv/bin/activate && python main.py --listen 0.0.0.0 --port 8188

# Systemd service (enabled but may need path fix)
sudo systemctl status comfyui
```

### API Endpoints
- `GET /system_stats` - System info (GPU, VRAM, versions)
- `GET /object_info` - Available nodes
- `POST /prompt` - Submit workflow

### Notes
- ComfyUI installed instead of Automatic1111 due to Python 3.12 compatibility issues
- Automatic1111 SD WebUI also cloned but requires Python 3.10 venv setup
- Both use the same SDXL model file

### Failed Attempt: Automatic1111
- Python 3.12 incompatible with SD WebUI
- CLIP package build failed in isolation environment
- Switched to ComfyUI which has cleaner dependency management

## Usage

1. Open http://10.0.0.117:8188 in browser
2. Load default workflow or create new
3. Select SDXL Base 1.0 checkpoint
4. Enter prompt and generate

## Future Work
- Add LoRA models
- Add ControlNet models
- Set up OpenAPI interface for programmatic access
- Create systemd service with proper environment activation