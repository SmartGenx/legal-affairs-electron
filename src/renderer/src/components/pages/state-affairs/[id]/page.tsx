import React from 'react'
import { useParams } from 'react-router-dom'

export default function Page() {
  const { id } = useParams<{ id: string }>()
  return (
    <div>
      <h1>State Affairs Details</h1>
      <p>ID: {id}</p>
      {/* You can fetch and display details based on the ID here */}
    </div>
  )
}
