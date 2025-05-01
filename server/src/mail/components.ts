const baseStyle = `
font-family: Arial, sans-serif;
background-color: #f9f9f9;
padding: 20px;
border-radius: 8px;
color: #333;
max-width: 600px;
margin: auto;
`;

const buttonStyle = `
display: inline-block;
padding: 10px 20px;
margin-top: 20px;
background-color: #1f2937;
color: white;
text-decoration: none;
border-radius: 4px;
`;

const footer = `
<hr style="margin-top: 30px;"/>
<div style="text-align: center; margin-top: 20px; font-size: 14px;">
  <p>Follow us on</p>
  <div style="margin: 10px;">
    <a href="https://www.facebook.com" style="margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook"/></a>
    <a href="https://www.youtube.com/@Irshadudheenp" style="margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/24/1384/1384060.png" alt="YouTube"/></a>
    <a href="https://www.instagram.com/_irshu_daniel" style="margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" alt="Instagram"/></a>
    <a href="https://www.linkedin.com/irshadudheenp" style="margin: 0 10px;"><img src="https://cdn-icons-png.flaticon.com/24/145/145807.png" alt="LinkedIn"/></a>
  </div>
  <p style="margin-top: 15px;">
    <img src="https://cdn-icons-png.flaticon.com/24/1179/1179069.png" alt="logo" />
    <strong style="margin-left: 5px;">Ad2gro</strong>
  </p>
  <p>&copy; ${new Date().getFullYear()} ad2gro. All rights reserved.</p>
</div>
`;
export {footer,baseStyle,buttonStyle}