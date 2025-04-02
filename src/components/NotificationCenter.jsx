import { useState, useEffect } from "react"

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([])

  window.addNotification = (message, type = "info") => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(item => item.id !== id))
    }, 5000)
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`p-3 rounded shadow-md max-w-xs animate-fade-in ${
            notification.type === "error" ? "bg-red-100 text-red-800" :
            notification.type === "success" ? "bg-green-100 text-green-800" :
            "bg-blue-100 text-blue-800"
          }`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  )
}