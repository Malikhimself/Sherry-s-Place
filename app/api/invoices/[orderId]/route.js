import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getOrderById } from "@/app/actions/orders";
import path from "path";

export async function GET(request, { params }) {
    const { orderId } = await params;
    const { success, order, error } = await getOrderById(orderId);

    if (error || !success) {
        console.error("Invoice API Error: Order not found or auth failed", error);
        return NextResponse.json({ error: error || "Order not found" }, { status: 404 });
    }

    try {
        // Create a new PDF document
        const doc = new PDFDocument({ margin: 50 });

        // Buffer to store PDF data
        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));

        // Promise to handle PDF generation completion
        const pdfPromise = new Promise((resolve, reject) => {
            doc.on("end", () => {
                const pdfData = Buffer.concat(chunks);
                resolve(pdfData);
            });
            doc.on("error", reject);
        });

        // --- PDF Content ---

        // Header
        const logoPath = path.join(process.cwd(), "public", "logo.jpg");
        try {
            doc.image(logoPath, 50, 45, { width: 50 });
        } catch (e) {
            console.error("Logo not found", e);
        }

        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("Sherry's Place", 110, 57)
            .fontSize(10)
            .text("Sherry's Place", 200, 50, { align: "right" })
            .text("41, Salami Kasumu Street", 200, 65, { align: "right" })
            .text("Mosan, Lagos State, Nigeria", 200, 80, { align: "right" })
            .moveDown();

        // Invoice Info
        doc
            .fillColor("#000000")
            .fontSize(20)
            .text("INVOICE", 50, 160);

        doc
            .fontSize(10)
            .text(`Invoice Number: ${order.id}`, 50, 200)
            .text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 215)
            .text(`Balance Due: ₦0.00`, 50, 230) // Assuming paid
            .moveDown();

        // Customer Info
        doc
            .text(`Bill To:`, 300, 200)
            .text(order.user?.name || "Customer", 300, 215)
            .text(order.user?.email || "", 300, 230)
            .moveDown();

        // Table Header
        const tableTop = 330;
        doc
            .font("Helvetica-Bold")
            .text("Item", 50, tableTop)
            .text("Quantity", 300, tableTop)
            .text("Price", 370, tableTop)
            .text("Total", 450, tableTop, { align: "right" });

        doc
            .strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, tableTop + 15)
            .lineTo(550, tableTop + 15)
            .stroke();

        // Table Rows
        let i = 0;
        let position = 0;
        doc.font("Helvetica");

        for (const item of order.items) {
            position = tableTop + 30 + (i * 30);
            doc
                .fontSize(10)
                .text(item.product.name.substring(0, 40) + (item.product.name.length > 40 ? "..." : ""), 50, position)
                .text(item.quantity.toString(), 300, position)
                .text(`₦${item.price.toFixed(2)}`, 370, position)
                .text(`₦${(item.price * item.quantity).toFixed(2)}`, 450, position, { align: "right" });

            doc
                .strokeColor("#eeeeee")
                .lineWidth(1)
                .moveTo(50, position + 20)
                .lineTo(550, position + 20)
                .stroke();

            i++;
        }

        // Total
        const subtotalPosition = position + 40;
        doc
            .font("Helvetica-Bold")
            .text("Subtotal", 370, subtotalPosition)
            .text(`₦${order.total.toFixed(2)}`, 450, subtotalPosition, { align: "right" });

        doc
            .text("Total", 370, subtotalPosition + 20)
            .text(`₦${order.total.toFixed(2)}`, 450, subtotalPosition + 20, { align: "right" });

        // Footer
        doc
            .fontSize(10)
            .text(
                "Thank you for your patronage.",
                50,
                700,
                { align: "center", width: 500 }
            );

        // Finalize PDF file
        doc.end();

        // Wait for PDF generation
        const pdfBuffer = await pdfPromise;

        // Return response
        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="invoice-${order.id}.pdf"`,
            },
        });
    } catch (err) {
        console.error("Invoice Generation Error:", err);
        return NextResponse.json({ error: "Failed to generate invoice: " + err.message }, { status: 500 });
    }
}
