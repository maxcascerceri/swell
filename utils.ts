
/**
 * Resizes and compresses an image to max dimensions.
 * Returns the base64 string, mimeType, and dimensions.
 * Optimized for local storage and fast rendering.
 */
export async function compressImage(
    base64Str: string, 
    maxWidth = 1024, 
    quality = 0.8
  ): Promise<{ base64: string, mimeType: string, width: number, height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
  
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
  
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback
          const mime = base64Str.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
          resolve({ base64: base64Str, mimeType: mime, width: img.width, height: img.height });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const newBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve({ 
            base64: newBase64, 
            mimeType: 'image/jpeg', 
            width, 
            height 
        });
      };
      img.onerror = () => {
        const mime = base64Str.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
        resolve({ base64: base64Str, mimeType: mime, width: 0, height: 0 }); 
      };
    });
  }
