export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: number;
  link: string;
  attempted?: boolean;
  dateSolved?: string;
}

export interface CompanyData {
  [key: string]: string[];
}

export interface ProblemData {
  [key: string]: Problem;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
} 