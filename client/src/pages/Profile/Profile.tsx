import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/FileUploader/FileUploader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL:'http://localhost:8000/api/v1',
  headers:{
      'Content-Type':'multipart/form-data'
  },
  withCredentials: true
});

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isResumeUploaded = useSelector((state: RootState) => state.auth.isResumeUploaded);


  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("resume", file);
  
    try {
      const response = await api.post('/resume/upload-pdf',formData)
  
      console.log("Upload successful:", response.data);

    } catch (error: any) {
      console.error("Upload failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Username</span>
              <span>{user}</span>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Resume</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Resume Status</span>
                  {isResumeUploaded ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>Uploaded</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="w-5 h-5 mr-2" />
                      <span>Not Uploaded</span>
                    </div>
                  )}
                </div>
                <FileUploader onFileUpload={handleFileUpload} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
