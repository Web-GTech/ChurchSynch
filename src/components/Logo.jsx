import React from 'react';

const Logo = ({ 
  className, 
  primaryColor = "currentColor", 
  secondaryColor, 
  type = "full", 
  text = "Church Facilities",
  imgSrc // Nova prop para a URL da imagem
}) => {
  const gradientId = `logoGradientUnique_${Math.random().toString(36).substring(7)}`;

  if (imgSrc && type === "icon") {
    return (
      <div className={`flex items-center justify-center ${className || 'h-10 w-10'}`}>
        <img  
          src={imgSrc} 
          alt={`${text} Logo`} 
          className="object-contain w-full h-full"
         src="https://images.unsplash.com/photo-1591689185969-9bb6c0e9456c" />
      </div>
    );
  }
  
  if (imgSrc && type === "full") {
     return (
      <div className={`flex items-center ${className}`}>
        <img  
          src={imgSrc} 
          alt={`${text} Icon`} 
          className="h-8 w-8 mr-2 object-contain"
         src="https://images.unsplash.com/photo-1597592001007-7a1074c3150d" />
        <span 
          style={{ color: primaryColor }}
          className="font-logo text-2xl font-bold tracking-tight"
        >
          {text}
        </span>
      </div>
    );
  }


  if (type === "icon") {
    return (
      <svg 
        className={className}
        viewBox="0 0 60 60" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`${text} Icon`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: primaryColor, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: secondaryColor || primaryColor, stopOpacity: secondaryColor ? 0.8 : 1 }} />
          </linearGradient>
        </defs>
        <circle cx="30" cy="30" r="28" fill={`url(#${gradientId})`} stroke={secondaryColor || primaryColor} strokeWidth="1.5" />
        <text 
          x="50%" 
          y="50%" 
          dy=".35em" 
          textAnchor="middle" 
          fontFamily="Montserrat, sans-serif" 
          fontSize="26" 
          fontWeight="bold"
          fill={primaryColor === "white" || primaryColor === "#FFFFFF" ? (secondaryColor === "rgba(255,255,255,0.7)" ? "#0c4a6e" : "white") : "white"}
          letterSpacing="-0.5"
        >
          CF
        </text>
      </svg>
    );
  }


  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        viewBox="0 0 40 40" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`${text} Icon`}
        className="h-8 w-8 mr-2"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: primaryColor, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: secondaryColor || primaryColor, stopOpacity: secondaryColor ? 0.7 : 1 }} />
          </linearGradient>
        </defs>
         <path 
            d="M20 4L4 10L20 16L36 10L20 4Z M4 12V22L20 28V18L4 12Z M36 12V22L20 28V18L36 12Z M4 24V30L20 36V30L4 24Z M36 24V30L20 36V30L36 24Z" 
            fill={`url(#${gradientId})`}
        />
      </svg>
      <span 
        style={{ color: primaryColor }}
        className="font-logo text-2xl font-bold tracking-tight"
      >
        {text}
      </span>
    </div>
  );
};

export default Logo;