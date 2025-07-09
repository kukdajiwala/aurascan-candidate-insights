import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  File, 
  FileText, 
  X, 
  Camera, 
  Download,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFilesUploaded?: (files: { resume?: string; coverLetter?: string; photo?: string }) => void;
  showPhotoUpload?: boolean;
}

interface UploadedFile {
  name: string;
  size: string;
  type: string;
  content: string;
  uploadDate: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded, showPhotoUpload = false }) => {
  const [uploadedFiles, setUploadedFiles] = useState<{
    resume?: UploadedFile;
    coverLetter?: UploadedFile;
    photo?: UploadedFile;
  }>({});
  const [dragActive, setDragActive] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState<'resume' | 'coverLetter' | 'photo'>('resume');
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File, type: 'resume' | 'coverLetter' | 'photo') => {
    if (!file) return;

    // Validate file type
    const allowedTypes = {
      resume: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      coverLetter: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      photo: ['image/jpeg', 'image/png', 'image/jpg']
    };

    if (!allowedTypes[type].includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: `Please upload a ${type === 'photo' ? 'JPG/PNG image' : 'PDF or Word document'}`,
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      // Read file content
      const fileContent = await readFileContent(file, type);
      
      const fileInfo: UploadedFile = {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        content: fileContent,
        uploadDate: new Date().toISOString()
      };

      setUploadedFiles(prev => ({
        ...prev,
        [type]: fileInfo
      }));

      toast({
        title: "File Uploaded Successfully",
        description: `${file.name} has been uploaded and processed`
      });

      // Notify parent component
      if (onFilesUploaded) {
        const newFiles = {
          resume: uploadedFiles.resume?.content,
          coverLetter: uploadedFiles.coverLetter?.content,
          photo: uploadedFiles.photo?.content,
          [type]: fileContent
        };
        onFilesUploaded(newFiles);
      }

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error processing your file",
        variant: "destructive"
      });
    }
  };

  const readFileContent = (file: File, type: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (type === 'photo') {
          resolve(e.target?.result as string);
        } else {
          // For PDF/Word files, we'll extract text content
          // In a real implementation, you'd use a proper PDF parser
          // For now, we'll use a placeholder text extraction
          const content = extractTextFromFile(file);
          resolve(content);
        }
      };
      
      reader.onerror = reject;
      
      if (type === 'photo') {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const extractTextFromFile = (file: File): string => {
    // This is a simplified text extraction
    // In a real implementation, you'd use libraries like pdf-parse or mammoth
    return `[File Content: ${file.name}]\nThis is a placeholder for extracted text content from the uploaded document. In a production environment, this would contain the actual extracted text from the PDF or Word document using appropriate parsing libraries.`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], currentUploadType);
    }
  };

  const removeFile = (type: 'resume' | 'coverLetter' | 'photo') => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });

    toast({
      title: "File Removed",
      description: "File has been removed successfully"
    });
  };

  const triggerFileUpload = (type: 'resume' | 'coverLetter' | 'photo') => {
    setCurrentUploadType(type);
    if (type === 'photo') {
      photoInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5 text-aura-blue-600" />
            Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume Upload */}
            <div className="space-y-4">
              <Label>Resume/CV</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? 'border-aura-blue-500 bg-aura-blue-50' : 'border-aura-gray-300 hover:border-aura-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadedFiles.resume ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{uploadedFiles.resume.name}</p>
                      <p className="text-aura-gray-500">{uploadedFiles.resume.size}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile('resume')}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileText className="h-8 w-8 text-aura-gray-400 mx-auto" />
                    <p className="text-sm text-aura-gray-600">
                      Drop your resume here or click to browse
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => triggerFileUpload('resume')}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter Upload */}
            <div className="space-y-4">
              <Label>Cover Letter</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? 'border-aura-blue-500 bg-aura-blue-50' : 'border-aura-gray-300 hover:border-aura-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadedFiles.coverLetter ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{uploadedFiles.coverLetter.name}</p>
                      <p className="text-aura-gray-500">{uploadedFiles.coverLetter.size}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile('coverLetter')}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <File className="h-8 w-8 text-aura-gray-400 mx-auto" />
                    <p className="text-sm text-aura-gray-600">
                      Drop your cover letter here or click to browse
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => triggerFileUpload('coverLetter')}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Photo Upload (if enabled) */}
            {showPhotoUpload && (
              <div className="space-y-4 md:col-span-2">
                <Label>Profile Photo (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center border-aura-gray-300 hover:border-aura-blue-400 transition-colors">
                  {uploadedFiles.photo ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        <img
                          src={uploadedFiles.photo.content}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{uploadedFiles.photo.name}</p>
                        <p className="text-aura-gray-500">{uploadedFiles.photo.size}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile('photo')}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera className="h-8 w-8 text-aura-gray-400 mx-auto" />
                      <p className="text-sm text-aura-gray-600">
                        Upload a professional photo
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerFileUpload('photo')}
                      >
                        Choose Photo
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* File Upload Statistics */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-aura-gray-600">
              <div className="flex items-center space-x-4">
                <span>Files Uploaded: {Object.keys(uploadedFiles).length}</span>
                <span>Max Size: 5MB per file</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>Supported: PDF, DOC, DOCX, JPG, PNG</span>
              </div>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0], currentUploadType);
              }
            }}
            className="hidden"
          />
          <input
            ref={photoInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0], 'photo');
              }
            }}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;