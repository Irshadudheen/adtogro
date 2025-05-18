import React from 'react'
import './404pg.css'
function NotFound() {
  return (
    <div>
      <nav className="shelf">
  <a className="book home-page">Home page</a>
  <a className="book about-us">About us</a>
  <a className="book contact">Contact</a>
  <a className="book faq">F.A.Q.</a>
  
  <span className="book not-found"></span>
 
  <span className="door left"></span>
  <span className="door right"></span>
</nav>
<h1>Error 404</h1>
<p>The page you're loking for can't be found</p>

    </div>
  )
}

export default NotFound
