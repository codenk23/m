let images = [];

// File upload
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const convertBtn = document.getElementById('convertBtn');

fileInput.addEventListener('change', handleFiles);

function handleFiles() {
  const files = [...fileInput.files];
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      images.push(file);
    }
  });
  renderPreview();
}

// Preview
function renderPreview() {
  preview.innerHTML = '';
  images.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = e => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = `
        <img src="${e.target.result}" alt="img">
        <button class="remove-btn" onclick="removeImage(${index})">×</button>
      `;
      preview.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

// Remove image
function removeImage(index) {
  images.splice(index, 1);
  renderPreview();
}

// Convert to PDF
convertBtn.addEventListener('click', async () => {
  if (!images.length) {
    alert('Please upload at least one image!');
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  for (let i = 0; i < images.length; i++) {
    const img = await loadImage(images[i]);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let imgWidth = img.width;
    let imgHeight = img.height;
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    imgWidth *= ratio;
    imgHeight *= ratio;

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    if (i > 0) pdf.addPage();
    pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
  }

  pdf.save('images.pdf');
});

// Load image helper
function loadImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Switch tabs (for future features)
function setTool(tool) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
  if (tool === 'pdf') {
    document.getElementById('tool-title').innerText = "Convert Images to PDF";
  } else if (tool === 'compress') {
    document.getElementById('tool-title').innerText = "Compress Your Images";
  }
}
