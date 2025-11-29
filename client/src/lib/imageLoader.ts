// Função para carregar imagem e converter para base64
export async function loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      
      try {
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };
    
    img.src = url;
  });
}

// Cache de imagens carregadas
const imageCache: Record<string, string> = {};

export async function getLogoInter(): Promise<string> {
  if (imageCache['inter']) {
    return imageCache['inter'];
  }
  
  try {
    const base64 = await loadImageAsBase64('/logos/inter-logo.png');
    imageCache['inter'] = base64;
    return base64;
  } catch (error) {
    console.error('Failed to load Inter logo:', error);
    return '';
  }
}

export async function getLogoBaseProfissional(): Promise<string> {
  if (imageCache['base']) {
    return imageCache['base'];
  }
  
  try {
    const base64 = await loadImageAsBase64('/logos/base-profissional.png');
    imageCache['base'] = base64;
    return base64;
  } catch (error) {
    console.error('Failed to load Base & Profissional logo:', error);
    return '';
  }
}
