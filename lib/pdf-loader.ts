/* eslint-disable @typescript-eslint/no-explicit-any */
const PDFJS_VERSION = "3.11.174"
const PDFJS_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`

let pdfjsLibCache: any = null

export async function loadPdfJs(): Promise<any> {
  if (pdfjsLibCache) return pdfjsLibCache

  // Dynamically load pdf.js from CDN to avoid bundling issues with canvas
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      pdfjsLibCache = (window as any).pdfjsLib
      resolve(pdfjsLibCache)
      return
    }

    const script = document.createElement("script")
    script.src = `${PDFJS_CDN}/pdf.min.js`
    script.onload = () => {
      const lib = (window as any).pdfjsLib
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/pdf.worker.min.js`
        pdfjsLibCache = lib
        resolve(lib)
      } else {
        reject(new Error("Failed to load pdf.js"))
      }
    }
    script.onerror = () => reject(new Error("Failed to load pdf.js script"))
    document.head.appendChild(script)
  })
}
