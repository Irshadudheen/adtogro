import { useEffect, useState } from "react"
import { uploadImage } from "@/Api/upload";
import '../animationloadinguploadImage/style.css'
const defaultInitialData = {
  companyName: "",
  adImage: "",
  companyWebsite: "",
  contactEmail: "",
  adDescription: "",
  targetAudience: "",
  orginalImage:""

};

const EditAdvertiseModal = ({
  isOpen = true,
  onClose = () => {},
  onSave  ,
  
  initialData =defaultInitialData
}) => {
  const [LoadingImageUpload,setLoadingImageUpload]= useState(false)
  const [formData, setFormData] = useState(initialData)
  const [imagePreview, setImagePreview] = useState()
  useEffect(()=>{
    setFormData(initialData)
    setImagePreview(initialData?.adImage)
  },[initialData])
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = async(event) => {
    const file = event.target.files?.[0]
    if (file) {
      setLoadingImageUpload(true)
      const formData = new FormData();
formData.append('image', file);
      const uploadImageInCloudinary = await uploadImage(formData)
   
       handleInputChange("adImage", uploadImageInCloudinary)
       handleInputChange("orginalImage",uploadImageInCloudinary)
       setImagePreview(uploadImageInCloudinary)
    setLoadingImageUpload(false)
    }
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.69)] bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white border shadow-lg rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 ">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Advertisement</h2>
            <p className="text-sm text-gray-600 mt-1">Make changes to your ad details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              placeholder="Enter company name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Advertisement Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview||formData.adImage || "/placeholder.svg"}
                    alt="Preview"
                    className="mx-auto max-h-48 rounded-lg object-cover"
                    draggable={false}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("imageInput")?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Change Image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <button
                      type="button"
                      onClick={() => document.getElementById("imageInput")?.click()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Upload Image
                    </button>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
              <input id="imageInput" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>

          {/* Website Link */}
          <div className="space-y-2">
            <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">
              Website Link
            </label>
            <input
              id="link"
              type="url"
              value={formData.companyWebsite}
              onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
              Contact Information
            </label>
            <input
              id="contactEmail
"
              type="text"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              placeholder="Email or phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          {/* Ad Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Advertisement Description
            </label>
            <textarea
              id="description"
              value={formData.adDescription}
              onChange={(e) => handleInputChange("adDescription", e.target.value)}
              placeholder="Describe your product or service..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
              Target Audience
            </label>
            <select
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) => handleInputChange("targetAudience", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="">Select target audience</option>
              <option value="general">General Public</option>
              <option value="young-adults">Young Adults (18-30)</option>
              <option value="professionals">Working Professionals</option>
              <option value="families">Families with Children</option>
              <option value="seniors">Seniors (55+)</option>
              <option value="students">Students</option>
              <option value="entrepreneurs">Entrepreneurs</option>
              <option value="tech-enthusiasts">Tech Enthusiasts</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
          >
            Save Changes
          </button>
        </div>
      </div>
      {LoadingImageUpload&& (<div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.75)] z-50"><span class="loader">Load&nbsp;ng</span></div>)}
    </div>
  )
}

export default EditAdvertiseModal