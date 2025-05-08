import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText } from "lucide-react";

// This would come from your backend
const mockInterviews = [
  {
    id: 1,
    title: "Frontend Developer Interview",
    description: "Technical interview for React position",
    jobRole: "Frontend Developer",
    model: "GPT-4",
    status: "Pending",
    date: "2024-03-20",
  },
  // Add more mock interviews as needed
];

const YourInterviews = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Interviews</h1>
      <div className="grid gap-6">
        {mockInterviews.map((interview) => (
          <Card key={interview.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{interview.title}</span>
                <span className="text-sm font-normal text-gray-500">
                  {interview.date}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Job Role</p>
                    <p className="font-medium">{interview.jobRole}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">AI Model</p>
                    <p className="font-medium">{interview.model}</p>
                  </div>
                </div>
                <p className="text-gray-600">{interview.description}</p>
                <div className="flex gap-4 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => console.log("Start interview")}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default YourInterviews;
