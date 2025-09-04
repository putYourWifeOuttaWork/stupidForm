import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * Generates a PDF from a given HTML element.
 * @param elementId The ID of the HTML element to convert to PDF.
 * @param filename The name of the PDF file to generate.
 * @returns A Promise that resolves with the generated PDF as a Blob.
 */
export async function generatePdfFromElement(elementId: string, filename: string): Promise<Blob | null> {
  const input = document.getElementById(elementId)

  if (!input) {
    console.error(`Element with ID "${elementId}" not found.`)
    return null
  }

  // Temporarily adjust styles for better PDF rendering if needed
  // For example, you might want to hide scrollbars or ensure all content is visible
  const originalOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden' // Hide scrollbars during capture

  try {
    const canvas = await html2canvas(input, {
      scale: 1, // Balanced scale for reasonable file size
      useCORS: true, // Enable CORS if your content includes images from other origins
      logging: false, // Disable logging for cleaner console
      windowWidth: input.scrollWidth, // Capture full width
      windowHeight: input.scrollHeight, // Capture full height
      allowTaint: true, // Allow tainted canvas for better compatibility
      backgroundColor: '#ffffff' // Set white background to reduce transparency artifacts
    })

    // Use JPEG format with compression to reduce file size
    const imgData = canvas.toDataURL('image/jpeg', 0.8) // 0.8 quality for good balance
    const pdf = new jsPDF('p', 'mm', 'a4') // 'p' for portrait, 'mm' for millimeters, 'a4' size
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Return the PDF as a Blob
    return pdf.output('blob')

  } catch (error) {
    console.error('Error generating PDF:', error)
    return null
  } finally {
    // Restore original styles
    document.body.style.overflow = originalOverflow
  }
}
