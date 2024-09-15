import React, { useEffect, useState } from 'react';

// Define the types if needed
interface SearchWidgetProps {
  configId: string;
  location: string;
}

const AgentBuilderWidget: React.FC<SearchWidgetProps> = ({ configId, location }) => {
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
        const searchWidget = document.createElement('gen-search-widget');
        searchWidget.setAttribute('configid', configId);
        searchWidget.setAttribute('location', location);
        searchWidget.authToken = authToken;

        // Append the widget directly to the body
        document.body.appendChild(searchWidget);
      };

      return () => {
        // Clean up when the component is unmounted
        const searchWidget = document.querySelector('gen-search-widget');
        if (searchWidget) {
          document.body.removeChild(searchWidget);
        }
        document.body.removeChild(script);
      };
    }
  }, [authToken, configId, location]);

  return (
    <>
      {!authToken && <p>Loading widget...</p>}
    </>
  );
};

export default AgentBuilderWidget;
