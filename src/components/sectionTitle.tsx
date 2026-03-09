import React from "react";

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 leading-tight">{title}</h2>
      <div className="flex items-center gap-1.5 mt-1.5 mb-1">
        <div className="h-0.5 w-8 rounded-full bg-blue-600"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
      </div>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}

export default SectionTitle;
