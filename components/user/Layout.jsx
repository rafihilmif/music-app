import React from 'react';

export default function Layout({
  children,
  bgColor = 'bg-[#121212]',
  gradient = '',
}) {
  return (
    <div
      className={`m-2 w-[100%] overflow-auto rounded px-4 pt-4 text-white lg:ml-0 ${bgColor} ${gradient}`}
    >
      {children}
    </div>
  );
}
