const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/deafdiomi/upload';
const CLOUDINARY_UPLOAD_PRESET = 'giangthuy_shop';

export const cloudinaryService = {
  uploadImage: async (file) => {
    try {
      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Kiểm tra định dạng file
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, and JPG files are allowed');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'products'); // Thêm vào folder products
      formData.append('resource_type', 'auto');

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}; 