import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText } from "lucide-react";
import {
  encodePassphrase,
  randomString,
} from "@/lib/client-utils";
import api from "@/config/axiosInstance";

const YourInterviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("http://localhost:5050/api/v1/interview/getinterviews");
        setInterviews(response.data);
      } catch (error) {
        console.error("Failed to fetch interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const startMeeting = (interviewId: string) => {
    if (e2ee) {
      navigate(
        `/interview/${interviewId}#${encodePassphrase(sharedPassphrase)}`
      );
    } else {
      navigate(`/interview/${interviewId}`);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading interviews...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Interviews</h1>
      <div className="grid gap-6">
        {interviews.map((interview: any) => (
          <Card key={interview.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{interview.title}</span>
                <span className="text-sm font-normal text-gray-500">
                  {interview.createdAt || "Date not set"}
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

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      id="use-e2ee"
                      type="checkbox"
                      checked={e2ee}
                      onChange={(ev) => setE2ee(ev.target.checked)}
                    />
                    <label htmlFor="use-e2ee">Enable end-to-end encryption</label>
                  </div>
                  {e2ee && (
                    <div className="flex items-center gap-2">
                      <label htmlFor="passphrase">Passphrase</label>
                      <input
                        id="passphrase"
                        type="password"
                        value={sharedPassphrase}
                        onChange={(ev) => setSharedPassphrase(ev.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-4 pt-4">
                  <Button className="flex-1" onClick={()=>startMeeting(interview.id)}>
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
