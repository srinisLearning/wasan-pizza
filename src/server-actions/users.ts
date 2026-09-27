'use server'

import  supabaseConfig  from "@/config/supabase-config";
import type { IUser } from "@/interfaces";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function registerNewUser(userData: any) {
    try {
        // Check if email exists
        const { data: existingUser } = await supabaseConfig
            .from("pizza_users")
            .select("id")
            .eq("email", userData.email)
            .single();

        if (existingUser) {
            return {
                success: false,
                message: "Email already exists"
            };
        }

        // Hash the password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        const { id, confirmPassword, ...userToSave } = userData;

        // Save the user
        const { error: insertError } = await supabaseConfig
            .from("pizza_users")
            .insert([
                {
                    ...userToSave,
                    password: hashedPassword,
                    isActive: true,
                    role: "customer"
                }
            ]);

        if (insertError) {
            throw insertError;
        }

        return {
            success: true,
            message: "User registered successfully"
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred during registration"
        };
    }
}



export async function loginUser(credentials: any) {
    try {
        const { data: user } = await supabaseConfig
            .from("pizza_users")
            .select("*")
            .eq("email", credentials.email)
            .single();

        if (!user) {
            return { success: false, message: "Invalid email or password" };
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
            return { success: false, message: "Invalid email or password" };
        }

        if (user.role !== credentials.role) {
            return { success: false, message: "Invalid role selected" };
        }

        const token = jwt.sign(
            { id: user.id, email: credentials.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        return {
            success: true,
            token,
            role: user.role,
            email: user.email,
            message: "Login successful"
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred during login"
        };
    }
}


export const validateJwtTokenAndGetUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "No token provided",
      };
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const decoded: any = jwt.verify(token, jwtSecret);

    if (!decoded) {
      return {
        success: false,
        message: "Invalid token",
      };
    }

    const { id, email } = decoded;

    const { data:user} = await supabaseConfig
    .from("pizza_users")
    .select("*")
    .eq("id", id)
    .eq("email", email)
    .single();

    if(!user) {
        return {
            success: false,
            message: "User not found"
        }
    }

    return {
        success: true,
        user,
        message: "User found"
    }
  } catch (error: any) {
    return {
        success: false,
        message: error.message || "An error occurred during token validation"
    };
  }
}

export const logoutUser = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("role");
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during logout",
    };
  }
}

export async function changePassword(payload: any) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "No token provided",
      };
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const decoded: any = jwt.verify(token, jwtSecret);

    if (!decoded) {
      return {
        success: false,
        message: "Invalid token",
      };
    }

    const { id } = decoded;

    // Check old password
    const { data: user } = await supabaseConfig
      .from("pizza_users")
      .select("password")
      .eq("id", id)
      .single();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(payload.oldPassword, user.password);
    if (!isMatch) {
      return { success: false, message: "Incorrect old password" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(payload.newPassword, salt);

    const { error } = await supabaseConfig
      .from("pizza_users")
      .update({ password: hashedNewPassword })
      .eq("id", id);

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: "Password updated successfully"
    };

  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred while changing password"
    };
  }
}

export async function getAllUsers() {
  try {
    const { data: users, error } = await supabaseConfig
      .from("pizza_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: users
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred while fetching users"
    };
  }
}

export async function updateUser(userId: string, payload: { role?: string, isActive?: boolean }) {
  try {
    const { error } = await supabaseConfig
      .from("pizza_users")
      .update(payload)
      .eq("id", userId);

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: "User updated successfully"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred while updating user"
    };
  }
}