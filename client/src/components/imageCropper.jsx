import React from 'react'

function ImageCropper() {
  return (
    <>
      <label htmlFor="block mb-3 w-fit"></label>
      <span>Choose advertise photo</span>
      <input type="file" accept='image/*'
    //   onChange={onSelectImage}
      className='block w-full text-sm text-slate-500 file:mr-4 file:py-1
      file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300
      hover:file:bg-gray-600' />
    </>
  )
}

export default ImageCropper
