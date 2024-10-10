import React from 'react';

type Citation = {
  text: string;
  source: string;
  url: string;
};

type CitationsProps = {
  citations: Citation[];
};

const Citations = ({ citations }: CitationsProps) => {
  return (
    <div className="p-6 bg-gray-50 h-screen w-1/3 flex flex-col">
      <button className="bg-gray-200 px-4 py-2 mb-4">Download App</button>
      <h2 className="text-xl font-bold mb-4">Citations</h2>
      {citations.length === 0 ? (
        <p className="text-gray-500">Click on a citation link to view details.</p>
      ) : (
        <div className="flex-1 overflow-auto">
          {citations.map((citation, index) => (
            <div key={index} className="mb-4">
              <p className="text-sm font-semibold">{citation.source}</p>
              <p className="text-sm">{citation.text}</p>
              <a href={citation.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Read more
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Citations;
