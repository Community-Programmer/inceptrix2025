import { useState, useEffect } from 'react';

interface HeaderProps {
  companyName?: string;
}

const Header = ({ companyName }: HeaderProps) => {
  const [logoUrl, setLogoUrl] = useState<string>('');

  useEffect(() => {
    if (companyName) {
      setLogoUrl(`https://logo.clearbit.com/${companyName}.com`);
    }
  }, [companyName]);

  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold mb-4">Company-wise Leetcode Problems</h1>
      {companyName && (
        <div className="flex items-center justify-center space-x-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              className="h-16 w-16 rounded-full"
            />
          )}
          <span className="text-xl font-semibold">
            {companyName.charAt(0).toUpperCase() + companyName.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
};

export default Header; 