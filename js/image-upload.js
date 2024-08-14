function previewImage() {
  const fileInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');

  // Check if any file is selected
  if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();

      // Set up the FileReader to display the selected image
      reader.onload = function (e) {
          preview.style.display = 'block';
          preview.src = e.target.result;
      };

      // Read the uploaded file as a URL
      reader.readAsDataURL(fileInput.files[0]);
  }
}
