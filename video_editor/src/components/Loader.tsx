"use client";

import { useEffect, useState } from "react";

const greetings = [
  "Hello",        
  "Hola",         
  "Bonjour",      
  "Hallo",     
  "こんにちは (Konnichiwa)", 
  "안녕하세요 (Annyeonghaseyo)", 
  "你好 (Nǐ hǎo)", 
  "नमस्ते (Namaste)", 
  "Olá",          
  "Salam",       
  "Привет (Privet)", 
  "Ciao",        
  "Merhaba",      
  "Sawubona",      
  "Shalom",       
  "Kia Ora",      
];

const colors = [
  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-500",
  "text-orange-500",
  "text-teal-500",
  "text-indigo-500",
  "text-amber-500",
  "text-lime-500",
  "text-rose-500",
  "text-cyan-500",
  "text-emerald-500",
  "text-fuchsia-500",
  "text-violet-500",
];

export default function Loader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 300); // change greeting every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 text-3xl font-bold">
      <div
        key={index} // Key triggers re-render for animation
        className={`${colors[index % colors.length]}`}
      >
        {greetings[index]}
      </div>
    </div>
  );
}