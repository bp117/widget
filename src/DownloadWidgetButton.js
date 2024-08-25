import React from 'react';

const DownloadWidgetButton = ({ useCaseId, promptId, apiKey, apiUrl }) => {
  const handleDownload = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Embedded Fancy Search Widget</title>
</head>
<body>
  <div id="fancy-widget"></div>

  <script src="https://cdn.example.com/js/searchwidget.js"></script>
  <script>
    const config = {
      useCaseId: '${useCaseId}',
      promptId: '${promptId}',
      apiKey: '${apiKey}',
      apiUrl: '${apiUrl}'
    };

    FancySearchWidget('fancy-widget', config);
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'embed-widget.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload}>
      Download Widget HTML
    </button>
  );
};

export default DownloadWidgetButton;
