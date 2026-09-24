"use server";

import supabaseConfig from "@/config/supabase-config";

export const uploadImageAndGetUrl = async (file: File) => {
  try {
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const { data, error: uploadError } = await supabaseConfig.storage
      .from("pizza_bucket")
      .upload(`public/${uniqueFilename}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return {
        success: false,
        message: "Image upload failed",
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabaseConfig.storage
      .from("pizza_bucket")
      .getPublicUrl(data.path);

    return {
      success: true,
      imageUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred during image upload",
    };
  }
};

export const deleteImageByUrl = async (imageUrl: string) => {
  try {
    // Public URLs look like .../storage/v1/object/public/pizza_bucket/public/<file>
    const marker = "/pizza_bucket/";
    const index = imageUrl.indexOf(marker);
    if (index === -1) {
      return { success: false, message: "Image is not in pizza_bucket" };
    }
    const path = decodeURIComponent(
      imageUrl.substring(index + marker.length).split("?")[0]
    );

    const { error } = await supabaseConfig.storage
      .from("pizza_bucket")
      .remove([path]);

    if (error) {
      console.error("Error deleting image:", error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting image:", error);
    return { success: false, message: error.message };
  }
};
