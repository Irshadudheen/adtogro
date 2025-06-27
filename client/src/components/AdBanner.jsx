import { useEffect, useState, useRef, useCallback } from "react"
import { fetchLogo, countClick, countImpression } from "../Api/advertise"

const AdBanner = () => {
  const [adData, setAdData] = useState([])
  const [impressionsCounted, setImpressionsCounted] = useState(new Set())
  const adRefs = useRef([])
  const observerRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const logs = await fetchLogo()
        
        setAdData(logs)
      } catch (error) {
        console.error("Error fetching ad data:", error)
      }
    }
    fetchData()
  }, [])

  const handleImpression = useCallback(
    async (adId, index) => {
      // Check if impression already counted for this ad
      if (impressionsCounted.has(adId)) {
        return
      }

      try {
        setImpressionsCounted((prev) => new Set([...prev, adId]))
        const res = await countImpression(adId)
       

        // Mark this ad as having its impression counted
      } catch (error) {
        console.error("Error counting impression:", error)
      }
    },
    [impressionsCounted],
  )

  useEffect(() => {
    // Only set up observer when we have ad data
    if (adData.length === 0) return

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index"))
            const ad = adData[index]

            if (ad && !impressionsCounted.has(ad.id)) {
              await handleImpression(ad.id, index)
              // Unobserve after counting to prevent multiple counts
              observer.unobserve(entry.target)
            }
          }
        })
      },
      {
        threshold: 0.5, // 50% visible
        rootMargin: "0px",
      },
    )

    observerRef.current = observer

    // Observe all current ad elements
    adRefs.current.forEach((ref, index) => {
      if (ref && adData[index] && !impressionsCounted.has(adData[index].id)) {
        observer.observe(ref)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [adData, handleImpression, impressionsCounted])

  const handleClick = async (id, url) => {
    try {
      await countClick(id)
      window.open(url, "_blank")
    } catch (error) {
      console.error("Click error:", error)
    }
  }

  const renderAdGrid = () => {
    const cells = []

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const index = i * 10 + j
        const ad = index < adData.length ? adData[index] : null

        cells.push(
          <div key={`cell-${i}-${j}`} className="relative border border-gray-400 overflow-hidden group">
            {ad && (
              <div
                ref={(el) => {
                  adRefs.current[index] = el
                }}
                data-index={index}
                onClick={() => handleClick(ad.id, ad.companyWebsite)}
                className="block w-full h-full cursor-pointer"
              >
                <img
                  src={ad.adImage || "/placeholder.svg"}
                  alt={ad.companyName}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {ad.companyName}
                </div>
                {/* Debug indicator */}
               
              </div>
            )}
          </div>,
        )
      }
    }

    return cells
  }

  return (
    <div className="w-full flex justify-center p-4">
      <div className="w-full max-w-screen-lg aspect-square">
        <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-0">{renderAdGrid()}</div>
      </div>
    </div>
  )
}

export default AdBanner