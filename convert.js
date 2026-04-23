import fs from 'fs';
import path from 'path';

const files = ['Dashboard', 'Login', 'AddExpense', 'ExpenseHistory', 'Reports'];

files.forEach(file => {
  let content = fs.readFileSync(`src/raw_screens/${file}.html`, 'utf-8');
  
  // Extract CSS
  const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  let styles = styleMatch ? styleMatch[1] : '';
  
  // Extract Body
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  let body = bodyMatch ? bodyMatch[1] : '';

  // Remove HTML comments
  body = body.replace(/<!--[\s\S]*?-->/g, '');

  // Remove trailing scripts
  body = body.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');

  // Clean up body for JSX
  // 1. replace class= with className=
  body = body.replace(/class=/g, 'className=');
  // 2. replace for= with htmlFor=
  body = body.replace(/for=/g, 'htmlFor=');
  // 3. close unclosed tags (img, input, br, hr)
  body = body.replace(/<(img|input|br|hr)([^>]*[^\/])>/g, '<$1$2 />');
  
  // 4. SVG camelCase fixes
  const svgAttrs = ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'stroke-dasharray', 'stroke-dashoffset', 'clip-path', 'stroke-miterlimit', 'vector-effect', 'stop-color', 'stop-opacity'];
  svgAttrs.forEach(attr => {
    const camel = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
    body = body.split(attr + '=').join(camel + '=');
  });

  // Make inline styles as objects
  body = body.replace(/style="([^"]*)"/g, (match, p1) => {
    const styleObj = p1.split(';').filter(s => s.trim()).map(s => {
      const parts = s.split(':');
      if (parts.length < 2) return '';
      const key = parts[0];
      const val = parts.slice(1).join(':').replace(/"/g, "'");
      const camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      return `${camelKey}: "${val.trim()}"`;
    }).join(', ');
    return `style={{${styleObj}}}`;
  });

  // Convert SVG viewBox to camelCase (viewbox is sometimes used)
  body = body.replace(/viewbox=/g, 'viewBox=');
  body = body.replace(/xmlns:xlink/g, 'xmlnsXlink');

  // Export React component
  const component = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import './${file}.css';

export default function ${file}() {
  const navigate = useNavigate();

  return (
    <>
      ${body}
    </>
  );
}
`;

  fs.mkdirSync('src/pages', { recursive: true });
  fs.writeFileSync(`src/pages/${file}.jsx`, component);
  fs.writeFileSync(`src/pages/${file}.css`, styles);
});

console.log('Conversion done.');
