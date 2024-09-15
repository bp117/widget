import React, { useEffect, useState } from 'react';

// Define the types if needed
interface SearchWidgetProps {
  configId: string;
  location: string;
  triggerId: string;
}

const AgentBuilderWidget: React.FC<SearchWidgetProps> = ({ configId, location, triggerId }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch the token from an API
    const fetchAuthToken = async () => {
      try {
        const response = await fetch('https://your-api-endpoint.com/get-token', {
          method: 'GET', // Or POST, based on your API
          headers: {
            'Content-Type': 'application/json',
            // You can include additional headers like Authorization if required
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAuthToken(data.token); // Assuming the API returns { token: 'your-token' }
        } else {
          console.error('Failed to fetch token');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    // Call the function to fetch the token when the component mounts
    fetchAuthToken();
  }, []);

  useEffect(() => {
    // Only load the script and initialize the widget once the token is available
    if (authToken) {
      const script = document.createElement('script');
      script.src = "https://cloud.google.com/ai/gen-app-builder/client?hl=en_US";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const searchWidget = document.querySelector('gen-search-widget') as any;
        if (searchWidget) {
          searchWidget.authToken = authToken;
        }
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [authToken]);

  return (
    <>
      {/* Show loading or error message if token is not yet available */}
      {!authToken ? (
        <p>Loading widget...</p>
      ) : (
        <>
          {/* Widget search element */}
          <gen-search-widget 
            configid={configId} 
            location={location} 
            triggerid={triggerId}>
          </gen-search-widget>

          {/* Trigger element for opening the widget */}
          <input 
            type="text" 
            placeholder="Search here" 
            id={triggerId} 
          />
        </>
      )}
    </>
  );
};

export default AgentBuilderWidget;
