const imageInput = document.getElementById('imageInput');
const imgWidth = document.getElementById('imgWidth');
const imgHeight = document.getElementById('imgHeight');
const maxKb = document.getElementById('maxKb');
const imgFormat = document.getElementById('imgFormat');
const resizeBtn = document.getElementById('resizeBtn');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const fileInfo = document.getElementById('fileInfo');
const downloadBtn = document.getElementById('downloadBtn');
const originalInfo = document.getElementById('originalInfo');

let loadedImage = null;

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const originalKB = Math.round(file.size / 1024);
    maxKb.value = originalKB;

    const reader = new FileReader();
    reader.onload = (event) => {
      loadedImage = new Image();
      loadedImage.onload = () => {
        imgWidth.value = loadedImage.width;
        imgHeight.value = loadedImage.height;
        originalInfo.textContent = `Original: ${loadedImage.width}px x ${loadedImage.height}px | Size: ${originalKB} KB`;
        processImage();
      };
      loadedImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function processImage() {
  if (!loadedImage) {
    alert("Please upload an image first!");
    return;
  }

  const targetW = parseInt(imgWidth.value) || loadedImage.width;
  const targetH = parseInt(imgHeight.value) || loadedImage.height;
  const targetMaxKB = parseInt(maxKb.value) || 500;
  const format = imgFormat.value;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = targetW;
  canvas.height = targetH;

  ctx.drawImage(loadedImage, 0, 0, targetW, targetH);

  let quality = 0.90;
  let dataUrl = canvas.toDataURL(format, quality);

  // కేవలం JPEG కి మాత్రమే సైజ్ కంట్రోల్ లూప్ వర్తిస్తుంది
  if (format === 'image/jpeg') {
    while ((dataUrl.length * 0.75) / 1024 > targetMaxKB && quality > 0.05) {
      quality -= 0.05;
      dataUrl = canvas.toDataURL(format, quality);
    }
  }

  const finalSizeBytes = Math.round(dataUrl.length * 0.75);
  const finalSizeKB = (finalSizeBytes / 1024).toFixed(2);

  previewImage.src = dataUrl;
  fileInfo.textContent = `Resized: ${targetW}px x ${targetH}px | File Size: ${finalSizeKB} KB`;
  downloadBtn.href = dataUrl;
  const ext = format.split('/')[1];
  downloadBtn.download = `resized_image.${ext}`;
  previewContainer.style.display = 'block';
}

resizeBtn.addEventListener('click', processImage);
imgWidth.addEventListener('input', () => { if(loadedImage) processImage(); });
imgHeight.addEventListener('input', () => { if(loadedImage) processImage(); });
maxKb.addEventListener('input', () => { if(loadedImage) processImage(); });
imgFormat.addEventListener('change', () => { if(loadedImage) processImage(); });
