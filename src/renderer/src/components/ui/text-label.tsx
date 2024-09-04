/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextLabel = (props: any) => {
  return (
    <div>
      <label htmlFor="{props.type}" className="text-sm mb-1 block font-bold text-gray-500">
        {props.text}
      </label>
    </div>
  )
}
export default TextLabel
