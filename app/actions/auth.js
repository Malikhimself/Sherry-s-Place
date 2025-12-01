"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/lib/auth";

const prisma = new PrismaClient();

export async function signUpWithEmail(formData) {
    try {
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");

        // Validate input
        if (!name || !email || !password) {
            return { error: "All fields are required" };
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "User with this email already exists" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Sign in the user automatically
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        return { success: true, user: { id: user.id, name: user.name, email: user.email } };
    } catch (error) {
        console.error("Sign up error:", error);
        return { error: "An error occurred during sign up" };
    }
}

export async function signInWithEmail(formData) {
    try {
        const email = formData.get("email");
        const password = formData.get("password");

        if (!email || !password) {
            return { error: "Email and password are required" };
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return { error: "Invalid email or password" };
        }

        return { success: true };
    } catch (error) {
        console.error("Sign in error:", error);
        return { error: "An error occurred during sign in" };
    }
}

export async function signOutUser() {
    await signOut({ redirect: false });
}

export async function getUserSession() {
    const session = await auth();
    return session;
}

export async function updateUserProfile(userId, data) {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
            },
        });

        return { success: true, user };
    } catch (error) {
        console.error("Update profile error:", error);
        return { error: "Failed to update profile" };
    }
}
