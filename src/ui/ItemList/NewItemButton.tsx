import React from 'react'

const NewItemButton = ({ setNewItemInput, children }: { setNewItemInput: React.Dispatch<React.SetStateAction<boolean>>, children: React.ReactNode }) => {
  return (
        <button className="bg-green-400 hover:bg-green-500 hover:cursor-pointer text-white p-2 rounded max-w-fit mt-4" onClick={() => setNewItemInput(true)}>
            {children}
        </button>
  )
}

export default NewItemButton