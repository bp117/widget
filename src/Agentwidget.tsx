import React, { useEffect, useState } from 'react';

interface SearchWidgetProps {
  configId: string;
  location: string;
}

const AgentBuilderWidget: React.FC<SearchWidgetProps> = ({ configId, location }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch the auth token from an API
    const fetchAuthToken = async () => {
      try {
        const response = await fetch('https://your-api-endpoint.com/get-token', {
          method: 'GET', // Or POST based on your backend API
          headers: {
            'Content-Type': 'application/json',
            // Add any authorization headers if needed
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

    // Fetch the token when the component mounts
    fetchAuthToken();
  }, []);

  useEffect(() => {
    // Ensure we only proceed when the authToken is available
    if (authToken) {
      // Load the widget script dynamically
      const script = document.createElement('script');
      script.src = "https://cloud.google.com/ai/gen-app-builder/client?hl=en_US";
      script.async = true;

      script.onload = () => {
        // Create the widget after the script is loaded
        const searchWidget = document.createElement('gen-search-widget');
        searchWidget.setAttribute('configid', configId);
        searchWidget.setAttribute('location', location);

        // Append the widget to the body
        document.body.appendChild(searchWidget);

        // Set the authToken safely after DOM insertion
        setTimeout(() => {
          if (searchWidget) {
            (searchWidget as any).authToken = authToken;

            // Simulate a click on the hidden trigger element to open the widget
            const trigger = document.getElementById('hiddenTrigger');
            if (trigger) {
              trigger.click();
            }
          }
        }, 100); // Short delay to ensure the widget is ready
      };

      script.onerror = () => {
        console.error('Failed to load the widget script.');
      };

      // Append the script to the body
      document.body.appendChild(script);

      // Clean up: Remove the script and widget when the component is unmounted
      return () => {
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

      {/* Hidden trigger button */}
      <button id="hiddenTrigger" style={{ display: 'none' }}>
        Hidden Trigger
      </button>
    </>
  );
};

export default AgentBuilderWidget;
