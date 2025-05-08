import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const jobRoles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Product Manager",
];

const models = ["GPT-4", "GPT-3.5", "Claude-2", "Gemini Pro"];

const InterviewHelp = () => {
  const navigate = useNavigate();
  const isResumeUploaded = useSelector(
    (state: RootState) => state.auth.isResumeUploaded
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    jobRole: "",
    model: "",
    extraInfo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isResumeUploaded) {
      navigate("/profile");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post("http://localhost:5050/api/v1/interview/createinterview", formData);

      console.log("Interview created:", response.data);
      navigate("/your-interviews");
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError("Failed to create interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Interview</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Interview Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter interview title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter interview description"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobRole">Job Role</Label>
              <Select
                value={formData.jobRole}
                onValueChange={(value) =>
                  setFormData({ ...formData, jobRole: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job role" />
                </SelectTrigger>
                <SelectContent>
                  {jobRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Select Model</Label>
              <Select
                value={formData.model}
                onValueChange={(value) =>
                  setFormData({ ...formData, model: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="extraInfo">Extra Information (Optional)</Label>
              <Textarea
                id="extraInfo"
                value={formData.extraInfo}
                onChange={(e) =>
                  setFormData({ ...formData, extraInfo: e.target.value })
                }
                placeholder="Add any additional information..."
                className="min-h-[100px]"
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Interview"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewHelp;
