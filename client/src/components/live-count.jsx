import { useEffect, useState,useRef } from "react";

export default function DraggableLiveCount({ liveCount }) {
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const elementRef = useRef(null);
  
    // Handle the start of a drag operation
    const handleStart = (clientX, clientY) => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setOffset({
          x: clientX - rect.left,
          y: clientY - rect.top
        });
        setIsDragging(true);
      }
    };
  
    // Handle mouse down events
    const handleMouseDown = (e) => {
      handleStart(e.clientX, e.clientY);
    };
  
    // Handle touch start events
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
        e.preventDefault();
      }
    };
  
    // Handle the movement during dragging
    const handleMove = (clientX, clientY) => {
      if (!isDragging) return;
      
      // Calculate new position
      const newX = clientX - offset.x;
      const newY = clientY - offset.y;
      
      // Get viewport dimensions to set constraints
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Get element dimensions
      const elementWidth = elementRef.current ? elementRef.current.offsetWidth : 100;
      const elementHeight = elementRef.current ? elementRef.current.offsetHeight : 40;
      
      // Constrain to viewport boundaries
      const constrainedX = Math.max(0, Math.min(newX, viewportWidth - elementWidth));
      const constrainedY = Math.max(0, Math.min(newY, viewportHeight - elementHeight));
      
      setPosition({ x: constrainedX, y: constrainedY });
    };
  
    // Handle mouse move events
    const handleMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
    };
  
    // Handle touch move events
    const handleTouchMove = (e) => {
      if (e.touches.length > 0 && isDragging) {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
        e.preventDefault(); // Prevent scrolling while dragging
      }
    };
  
    // Handle the end of dragging
    const handleEnd = () => {
      setIsDragging(false);
    };
  
    // Add and remove event listeners
    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchend', handleEnd);
      }
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchend', handleEnd);
      };
    }, [isDragging]);
  
    return (
      <div
        ref={elementRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="fixed bg-black bg-opacity-80 text-white rounded-lg px-4 py-2 flex items-center space-x-2 shadow-lg z-50 cursor-grab select-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: isDragging ? 'scale(1.05)' : 'scale(1)',
          transition: isDragging ? 'none' : 'transform 0.2s'
        }}
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="font-medium">Live: {liveCount}</span>
      </div>
    );
  }