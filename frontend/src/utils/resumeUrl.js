const DEFAULT_FALLBACK_RESUME_URL = "/gaurav_resume.pdf";

const isBlockedCloudinaryRawUrl = (url) => {
  if (!url) return false;

  return /^https?:\/\/res\.cloudinary\.com\/[^/]+\/raw\/upload\//i.test(String(url));
};

export const getFallbackResumeUrl = () => {
  return DEFAULT_FALLBACK_RESUME_URL;
};

export const resolveResumeUrl = (apiResumeUrl) => {
  if (!apiResumeUrl) return getFallbackResumeUrl();

  if (isBlockedCloudinaryRawUrl(apiResumeUrl)) {
    return getFallbackResumeUrl();
  }

  return apiResumeUrl;
};
