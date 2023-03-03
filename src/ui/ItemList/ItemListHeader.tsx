import React from 'react'

const ItemListHeader = ({children}: {children: React.ReactNode}) => {
  return (
    <h2 className="font-semibold text-lg self-start text-gray-600">{children}</h2>
  )
}

export default ItemListHeader