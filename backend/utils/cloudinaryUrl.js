/**
 * Ensure Cloudinary URLs are in the proper public delivery format
 * Converts paths from multer-storage-cloudinary to clean, publicly accessible URLs
 */
export const ensurePublicCloudinaryUrl = (url) => {
  if (!url) return "";
  
  // If it's already a full HTTPS URL, ensure it uses the standard delivery endpoint
  if (url.startsWith("http")) {
    // Convert to public delivery URL if needed
    // Example: https://res.cloudinary.com/cloud/image/upload/v123/portfolio/file.pdf
    // to: https://res.cloudinary.com/cloud/image/upload/v123/portfolio/file.pdf
    return url.replace(/\/image\/upload\//, "/image/upload/");
  }
  
  return url;
};

export default ensurePublicCloudinaryUrl;
