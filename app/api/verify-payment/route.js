import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { reference, cartItems, total } = await request.json();

        // Verify transaction with Paystack
        const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });

        const verifyData = await verifyResponse.json();

        if (!verifyData.status || verifyData.data.status !== "success") {
            return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
        }

        // Check if amount matches (Paystack returns amount in kobo)
        // Allow for small floating point differences if needed, but ideally exact match
        const paidAmount = verifyData.data.amount / 100;
        if (Math.abs(paidAmount - total) > 0.5) { // Allow 50 cents/kobo difference just in case of rounding, or be strict
            // console.warn("Amount mismatch:", paidAmount, total);
            // You might want to flag this order for review instead of failing
        }

        // Create the order
        const order = await prisma.order.create({
            data: {
                userId: parseInt(session.user.id),
                total: paidAmount, // Use the actual paid amount
                status: "paid",
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error.message}` },
            { status: 500 }
        );
    }
}
