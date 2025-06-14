
import { useState } from "react"



function RenewalModal({ onClose, onRenew,advertiseId }) {
  const [selectedPlan, setSelectedPlan] = useState("")
  
  const renewalPlans = [
    {
      id: "basic",
      name: "Daily",
      amount: 9,
      period: "1 Day",
      popular: false,
    },
    {
      id: "pro",
      name: "Monthly",
      amount: 59,
      period: "1 Month",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Half Year",
      amount: 299,
      period: "6 Months",
      popular: false,
    },
  ]

  const handleRenewal = () => {
    const plan = renewalPlans.find((p) => p.id === selectedPlan)
    if (plan && onRenew) {
      onRenew(plan.id, plan.amount,advertiseId)

    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50  bg-opacity-50 flex justify-center items-center">
      <div className="opacity-100 backdrop-blur-md bg-white/30 border shadow-lg p-8 rounded-md w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl text-black font-semibold mb-2">Renew Subscription</h2>
        <p className="text-gray-700 mb-6">Choose your renewal plan</p>

        <div className="space-y-3 mb-6">
          {renewalPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id
                  ? "border-yellow-400 bg-blue-50/50"
                  : "border-gray-300 hover:border-gray-400 bg-white/20"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-4 bg-yellow-400 text-white text-xs px-2 py-1 rounded">Popular</div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-black">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-black">${plan.amount}</p>
                  {plan.id === "monthly" && <p className="text-xs text-green-600">Save 78.15%</p>}
                </div>
              </div>

              
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRenewal}
            disabled={!selectedPlan}
            className={`w-full py-3 rounded-md font-medium transition duration-200 ${
              selectedPlan
                ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {selectedPlan ? `Renew for $${renewalPlans.find((p) => p.id === selectedPlan)?.amount}` : "Select a plan"}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-black rounded-md border border-gray-400 hover:bg-gray-100 cursor-pointer transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default RenewalModal
