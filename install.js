module.exports = {
  "cmds": {
    "nvidia": "pip install torch torchvision torchaudio xformers --index-url https://download.pytorch.org/whl/cu118",
    "amd": "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.6",
    "default": "pip install torch torchvision torchaudio"
  },
  "requires": [{
    "type": "conda",
    "name": "ffmpeg",
    "args": "-c conda-forge"
  }, {
    "gpu": "nvidia",
    "name": "cuda"
  }],
  "run": [{
    "method": "shell.run",
    "params": {
      "message": "git clone https://github.com/ali-vilab/dreamtalk app",
    }
  }, {
    "method": "fs.copy",
    "params": {
      "src": "app.py",
      "dest": "app/app.py"
    }
  }, {
    "method": "fs.copy",
    "params": {
      "src": "inference_for_demo_video.py",
      "dest": "app/inference_for_demo_video.py"
    }
  }, {
    "method": "fs.copy",
    "params": {
      "src": "requirements.txt",
      "dest": "app/requirements.txt"
    }
  }, {
    "method": "shell.run",
    "params": {
      "path": "app",
      "venv": "env",
      "message": "pip install -r requirements.txt",
    }
  }, {
    "method": "fs.download",
    "params": {
      "uri": "https://huggingface.co/cocktailpeanut/dt/resolve/main/renderer.pt?download=true",
      "dir": "app/checkpoints"
    }
  }, {
    "method": "fs.download",
    "params": {
      "uri": "https://huggingface.co/cocktailpeanut/dt/resolve/main/denoising_network.pth?download=true",
      "dir": "app/checkpoints"
    }
  }, {
    "method": "shell.run",
    "params": {
      "path": "app",
      "venv": "env",
      "message": [
        "pip install -r requirements.txt",
        "{{(gpu === 'nvidia' ? self.cmds.nvidia : (gpu === 'amd' ? self.cmds.amd : self.cmds.default))}}"
      ]
    }
  }, {
    "method": "notify",
    "params": {
      "html": "Click the 'start' tab to get started!"
    }
  }]
}
