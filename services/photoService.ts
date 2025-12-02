import { PhotoMemory } from "../types";

const API_URL = "https://script.google.com/macros/s/AKfycbwFidbhSpS_IbGX1ZbmYi32n-XXwbTSlsKj80KcfKByUUHHPVGk9iISqHk95d9WouGV/exec";

// Helper to parse "011225.png" -> Date object
const parseDateFromFilename = (filename: string): Date | null => {
  try {
    // Regex to match ddMMyy anywhere in the string to be more flexible
    // Capture group 1: day, 2: month, 3: year
    const match = filename.match(/(\d{2})(\d{2})(\d{2})/);
    
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // JS months are 0-indexed
      let year = parseInt(match[3], 10);
      
      // Assumption: 2 digits year. If < 50, assume 20xx, else 19xx
      // For this app, we assume 20xx
      year += 2000;

      // Basic validation
      if (month < 0 || month > 11 || day < 1 || day > 31) return null;

      return new Date(year, month, day);
    }
    return null;
  } catch (e) {
    console.error("Error parsing date from filename:", filename, e);
    return null;
  }
};

// Helper: Convert Google Drive View/Open links to Direct Image Links
// Browser <img> tags cannot use "drive.google.com/file/d/ID/view".
// They must use "lh3.googleusercontent.com/d/ID" or "drive.google.com/uc?export=view&id=ID"
const transformGoogleDriveUrl = (url: string): string => {
  if (!url) return "";
  
  // If it's not a google drive link, return as is
  if (!url.includes("drive.google.com")) return url;

  let fileId = "";

  // Pattern 1: .../file/d/FILE_ID/...
  const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) {
    fileId = match1[1];
  } 
  // Pattern 2: ...?id=FILE_ID...
  else {
    const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2) {
      fileId = match2[1];
    }
  }

  if (fileId) {
    // This format is much more reliable for embedding images
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return url;
};

export const fetchPhotos = async (): Promise<PhotoMemory[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      redirect: 'follow'
    });
    
    // Check if the response is actually HTML (Google Login page usually indicates permission issues)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      throw new Error("API trả về HTML thay vì JSON. Hãy kiểm tra quyền Deploy của Google Script (Phải là 'Anyone').");
    }

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const text = await response.text();
    let data: any;
    
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse Error. Raw text:", text);
      throw new Error("Dữ liệu trả về không phải JSON hợp lệ.");
    }
    
    console.log("Raw API Data:", data); // Debug log

    // Handle various wrappers: { data: [] }, { items: [] }, { result: [] }, or just []
    const rawList = Array.isArray(data) 
      ? data 
      : (data.data || data.items || data.result || data.files || []);

    if (!Array.isArray(rawList)) {
      throw new Error("Cấu trúc dữ liệu không phải là danh sách (Array).");
    }

    const memories: PhotoMemory[] = rawList.map((item: any) => {
      // Flexible property access
      const filename = item.name || item.filename || item.title || "unknown";
      const rawUrl = item.url || item.link || item.downloadUrl || item.image;
      
      // Strict check: Must have URL
      if (!rawUrl) return null;

      // Transform URL for <img> tag compatibility
      const url = transformGoogleDriveUrl(rawUrl);

      const date = parseDateFromFilename(filename) || new Date(0);
      
      return {
        url,
        filename,
        date,
        displayDate: date.getTime() === 0 ? "Ngày không xác định" : date.toLocaleDateString('vi-VN')
      };
    }).filter((item): item is PhotoMemory => item !== null);

    return memories.sort((a, b) => a.date.getTime() - b.date.getTime());

  } catch (error: any) {
    console.error("Failed to fetch photos:", error);
    throw new Error(error.message || "Không thể tải hình ảnh.");
  }
};