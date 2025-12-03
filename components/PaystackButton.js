"use client";

import { PaystackButton } from "react-paystack";

export default function PaystackPaymentButton({ amount, email, onSuccess, onClose }) {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    const componentProps = {
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        publicKey,
        text: `Pay ₦${amount.toFixed(2)}`,
        onSuccess: (reference) => onSuccess(reference),
        onClose: onClose || (() => console.log("Payment closed")),
    };

    return (
        <PaystackButton
            {...componentProps}
            className="w-full bg-primary-green text-white py-4 rounded-xl font-bold hover:bg-secondary-green transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2"
        />
    );
}
