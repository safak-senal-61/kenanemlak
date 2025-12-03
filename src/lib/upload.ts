import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'properties');

// Ensure upload directory exists
export function ensureUploadDirectory(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

// Generate unique filename
export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const uniqueName = `${name}-${uuidv4()}${ext}`;
  return uniqueName;
}

// Save uploaded file and return public URL
export async function saveUploadedFile(
  file: Buffer,
  originalName: string,
  propertyId: string
): Promise<string> {
  ensureUploadDirectory();
  
  const uniqueFilename = generateUniqueFilename(originalName);
  const propertyDir = path.join(UPLOAD_DIR, propertyId);
  
  // Create property-specific directory
  if (!fs.existsSync(propertyDir)) {
    fs.mkdirSync(propertyDir, { recursive: true });
  }
  
  const filePath = path.join(propertyDir, uniqueFilename);
  
  // Save file
  fs.writeFileSync(filePath, file);
  
  // Return public URL (accessible via /uploads/properties/{propertyId}/{filename})
  return `/uploads/properties/${propertyId}/${uniqueFilename}`;
}

// Delete uploaded file
export function deleteUploadedFile(fileUrl: string): void {
  try {
    const filePath = path.join(process.cwd(), 'public', fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

// Get all files for a property
export function getPropertyFiles(propertyId: string): string[] {
  const propertyDir = path.join(UPLOAD_DIR, propertyId);
  
  if (!fs.existsSync(propertyDir)) {
    return [];
  }
  
  try {
    const files = fs.readdirSync(propertyDir);
    return files.map(file => `/uploads/properties/${propertyId}/${file}`);
  } catch (error) {
    console.error('Error reading property files:', error);
    return [];
  }
}