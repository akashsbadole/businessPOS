// PDF Generation Utility using browser's print functionality
export class PDFGenerator {
  /**
   * Generate PDF from HTML element using browser's print functionality
   * @param elementId - ID of the element to convert to PDF
   * @param filename - Name of the PDF file
   */
  static async generatePDF(
    elementId: string,
    filename: string = "invoice.pdf"
  ): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }

      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Unable to open print window. Please allow popups.");
      }

      // Get the element's HTML and styles
      const elementHTML = element.outerHTML;
      const styles = this.getAllStyles();

      // Create the print document
      const printDocument = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${filename}</title>
            <meta charset="utf-8">
            <style>
              ${styles}
              
              /* Print-specific styles */
              @media print {
                @page {
                  size: A4;
                  margin: 0.5in;
                }
                
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  font-size: 12pt;
                  line-height: 1.4;
                  color: #000;
                  background: white;
                }
                
                .no-print {
                  display: none !important;
                }
                
                /* Ensure proper page breaks */
                .page-break {
                  page-break-before: always;
                }
                
                /* Table styles for better printing */
                table {
                  border-collapse: collapse;
                  width: 100%;
                  margin-bottom: 20px;
                }
                
                th, td {
                  border: 1px solid #000;
                  padding: 8px;
                  text-align: left;
                  font-size: 10pt;
                }
                
                th {
                  background-color: #f0f0f0;
                  font-weight: bold;
                }
                
                /* Header styles */
                h1, h2, h3 {
                  color: #000;
                  margin-top: 0;
                }
                
                /* Remove shadows and rounded corners for print */
                * {
                  box-shadow: none !important;
                  border-radius: 0 !important;
                  text-shadow: none !important;
                }
              }
              
              /* Hide elements that shouldn't be printed */
              .no-print,
              button,
              .modal-header,
              .modal-footer {
                display: none !important;
              }
            </style>
          </head>
          <body>
            ${elementHTML}
          </body>
        </html>
      `;

      // Write the document and trigger print
      printWindow.document.write(printDocument);
      printWindow.document.close();

      // Wait for the content to load
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();

          // Close the window after printing
          setTimeout(() => {
            printWindow.close();
          }, 1000);
        }, 500);
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  }

  /**
   * Get all CSS styles from the current document
   */
  private static getAllStyles(): string {
    let styles = "";

    // Get all stylesheets
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const styleSheet = document.styleSheets[i];
        if (styleSheet.cssRules) {
          for (let j = 0; j < styleSheet.cssRules.length; j++) {
            styles += styleSheet.cssRules[j].cssText + "\n";
          }
        }
      } catch (e) {
        // Skip external stylesheets that can't be accessed due to CORS
        console.warn("Could not access stylesheet:", e);
      }
    }

    // Get inline styles
    const styleElements = document.querySelectorAll("style");
    styleElements.forEach((styleElement) => {
      styles += styleElement.innerHTML + "\n";
    });

    return styles;
  }

  /**
   * Enhanced PDF generation with better formatting
   */
  static async generateEnhancedPDF(
    elementId: string,
    filename: string = "invoice.pdf"
  ): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }

      // Create a clone of the element for processing
      const clonedElement = element.cloneNode(true) as HTMLElement;

      // Apply print-specific styles
      clonedElement.style.width = "210mm"; // A4 width
      clonedElement.style.minHeight = "297mm"; // A4 height
      clonedElement.style.padding = "20mm";
      clonedElement.style.backgroundColor = "white";
      clonedElement.style.color = "black";
      clonedElement.style.fontSize = "12pt";
      clonedElement.style.lineHeight = "1.4";

      // Create a temporary container
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      // Use the enhanced print method
      await this.printElementEnhanced(clonedElement, filename);

      // Clean up
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error("Error generating enhanced PDF:", error);
      // Fallback to regular PDF generation
      await this.generatePDF(elementId, filename);
    }
  }

  /**
   * Enhanced print method with better browser compatibility
   */
  private static async printElementEnhanced(
    element: HTMLElement,
    filename: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const printWindow = window.open("", "_blank", "width=800,height=600");
        if (!printWindow) {
          reject(
            new Error("Unable to open print window. Please allow popups.")
          );
          return;
        }

        const styles = this.getEnhancedStyles();
        const elementHTML = element.outerHTML;

        const printDocument = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${filename}</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                ${styles}
              </style>
            </head>
            <body>
              <div class="print-container">
                ${elementHTML}
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    setTimeout(function() {
                      window.close();
                    }, 1000);
                  }, 500);
                };
              </script>
            </body>
          </html>
        `;

        printWindow.document.write(printDocument);
        printWindow.document.close();

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get enhanced styles for better PDF output
   */
  private static getEnhancedStyles(): string {
    return `
      @page {
        size: A4;
        margin: 20mm;
      }

      body {
        margin: 0;
        padding: 0;
        font-family: 'Arial', 'Helvetica', sans-serif;
        font-size: 12pt;
        line-height: 1.4;
        color: #000;
        background: white;
      }

      .print-container {
        width: 100%;
        max-width: 170mm;
        margin: 0 auto;
      }

      /* Hide elements that shouldn't be printed */
      .no-print,
      button,
      .modal-header,
      .modal-footer,
      [class*="modal"],
      [class*="dropdown"] {
        display: none !important;
      }

      /* Table styles */
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10pt;
      }

      th, td {
        border: 1px solid #000;
        padding: 4pt 6pt;
        text-align: left;
        font-size: 10pt;
      }

      th {
        background-color: #f0f0f0;
        font-weight: bold;
      }

      /* Typography */
      h1, h2, h3, h4, h5, h6 {
        margin-top: 0;
        margin-bottom: 8pt;
        color: #000;
      }

      p {
        margin: 4pt 0;
      }

      /* Remove shadows and effects */
      * {
        box-shadow: none !important;
        text-shadow: none !important;
        border-radius: 0 !important;
      }

      /* Ensure proper spacing */
      .flex {
        display: flex;
      }

      .justify-between {
        justify-content: space-between;
      }

      .text-center {
        text-align: center;
      }

      .text-right {
        text-align: right;
      }

      .font-bold {
        font-weight: bold;
      }

      .text-sm {
        font-size: 10pt;
      }

      .text-xs {
        font-size: 9pt;
      }
    `;
  }

  /**
   * Alternative method: Download HTML as file (fallback)
   */
  static downloadHTML(
    elementId: string,
    filename: string = "invoice.html"
  ): void {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }

      const elementHTML = element.outerHTML;
      const styles = this.getAllStyles();

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${filename}</title>
            <meta charset="utf-8">
            <style>${styles}</style>
          </head>
          <body>
            ${elementHTML}
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading HTML:", error);
      throw error;
    }
  }

  /**
   * Simple method to trigger browser's print dialog
   */
  static printElement(elementId: string): void {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }

      // Hide all other elements temporarily
      const body = document.body;
      const children = Array.from(body.children);

      // Hide all children except the target element
      children.forEach((child) => {
        if (child !== element && !element.contains(child)) {
          (child as HTMLElement).style.display = "none";
        }
      });

      // Add print styles
      const printStyles = document.createElement("style");
      printStyles.innerHTML = `
        @media print {
          body { margin: 0; padding: 20px; }
          .no-print { display: none !important; }
        }
      `;
      document.head.appendChild(printStyles);

      // Trigger print
      window.print();

      // Restore original display
      setTimeout(() => {
        children.forEach((child) => {
          (child as HTMLElement).style.display = "";
        });
        document.head.removeChild(printStyles);
      }, 1000);
    } catch (error) {
      console.error("Error printing element:", error);
      throw error;
    }
  }
}
