export const BRAND = {
  logo: "/assets/pks-logo.jpg",
  logoSource: "/assets/PKS Logo Image-02.jpg",
  logoFallback: "/assets/logo.svg",
  primary: "#0B2D5B",
  accent: "#C9A227",
  name: "PKS BROZCO ENTERPRISES",
};

export async function loadBrandLogoDataUrl(): Promise<string | undefined> {
  if (typeof window === "undefined") return undefined;

  for (const path of [BRAND.logo, BRAND.logoFallback]) {
    try {
      const res = await fetch(encodeURI(path));
      if (!res.ok) continue;

      if (path.endsWith(".svg")) {
        const rasterized = await rasterizeSvg(path);
        if (rasterized) return rasterized;
        continue;
      }

      const blob = await res.blob();
      return await blobToDataUrl(blob);
    } catch {
      /* try next */
    }
  }
  return undefined;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function rasterizeSvg(path: string, width = 280, height = 52): Promise<string | undefined> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(undefined);
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(undefined);
    img.src = encodeURI(path);
  });
}
