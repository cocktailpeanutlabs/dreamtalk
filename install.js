module.exports = {
  requires: {
    bundle: "ai",
  },
  run: [{
    method: "shell.run",
    params: {
      message: "git clone https://github.com/ali-vilab/dreamtalk app",
    }
  }, {
    method: "fs.copy",
    params: {
      src: "app.py",
      dest: "app/app.py"
    }
  }, {
    method: "fs.copy",
    params: {
      src: "inference_for_demo_video.py",
      dest: "app/inference_for_demo_video.py"
    }
  }, {
    method: "shell.run",
    params: {
      message: "conda install -y -c conda-forge cmake"
    }
  }, {
    method: "shell.run",
    params: {
      path: "app",
      venv: "env",
      message: [
        "uv pip install pysoundfile",
        "uv pip install -r ../requirements.txt",
      ]
    }
  }, {
    method: "script.start",
    params: {
      uri: "torch.js",
      params: {
        venv: "env",
        path: "app"
      }
    }
  }, {
    method: "fs.download",
    params: {
      uri: "https://huggingface.co/cocktailpeanut/dt/resolve/main/renderer.pt?download=true",
      dir: "app/checkpoints"
    }
  }, {
    method: "fs.download",
    params: {
      uri: "https://huggingface.co/cocktailpeanut/dt/resolve/main/denoising_network.pth?download=true",
      dir: "app/checkpoints"
    }
  }, {
    method: "notify",
    params: {
      html: "Click the 'start' tab to get started!"
    }
  }]
}
