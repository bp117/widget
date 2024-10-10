import React from 'react';

type CitationsProps = {
  citations: string[];
};

const Citations = ({ citations }: CitationsProps) => {
  return (
    <div className="p-6 bg-gray-50 h-screen w-1/3">
      <h2 className="text-xl font-bold mb-4">Citations</h2>
      {citations.length === 0 ? (
        <p className="text-gray-500">Click on a citation link to view details.</p>
      ) : (
        citations.map((citation, index) => (
          <div key={index} className="mb-4">
            <p className="text-sm">{citation}</p>
          </div>
        ))
      )}
      <button className="bg-gray-200 px-4 py-2 mt-4">Download App</button>
    </div>
  );
};

export default Citations;
