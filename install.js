module.exports = async (kernel) => {
  let cmd = "uv pip install torch==2.5.0 torchvision==0.20.0 torchaudio==2.5.0 --index-url https://download.pytorch.org/whl/cpu"
  if (kernel.platform === 'darwin') {
    if (kernel.arch === "arm64") {
      cmd = "uv pip install torch torchaudio torchvision"
    } else {
      cmd = "uv pip install torch==2.1.2 torchaudio==2.1.2"
    }
  } else {
    if (kernel.gpu === 'nvidia') {
      if (kernel.gpu_model && / 50.+/.test(kernel.gpu_model)) {
        cmd = "uv pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128"
      } else {
        cmd = "uv pip install torch==2.5.0 torchvision==0.20.0 torchaudio==2.5.0 xformers --index-url https://download.pytorch.org/whl/cu124"
      }
    } else if (kernel.gpu === 'amd') {
      cmd = "uv pip install torch==2.5.0 torchvision==0.20.0 torchaudio==2.5.0 --index-url https://download.pytorch.org/whl/rocm6.2"
    } 
  }
//module.exports = {
//  "cmds": {
//    "nvidia": "pip install torch==2.5.0 torchvision==0.20.0 torchaudio==2.5.0 xformers --index-url https://download.pytorch.org/whl/cu124",
//    "amd": "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2",
//    "default": "pip install torch==2.5.0 torchvision==0.20.0 torchaudio==2.5.0 --index-url https://download.pytorch.org/whl/cpu"
//  },
  return {
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
        "message": "conda install -y -c conda-forge cmake"
      }
    }, {
      "method": "shell.run",
      "params": {
        "path": "app",
        "venv": "env",
        "message": [
          "uv pip install pysoundfile",
          "uv pip install -r requirements.txt",
          cmd,
  //        "{{(gpu === 'nvidia' ? self.cmds.nvidia : (gpu === 'amd' ? self.cmds.amd : self.cmds.default))}}"
        ]
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
      "method": "fs.link",
      "params": {
        "venv": "app/env"
      }
    }, {
      "method": "notify",
      "params": {
        "html": "Click the 'start' tab to get started!"
      }
    }]
  }
}
