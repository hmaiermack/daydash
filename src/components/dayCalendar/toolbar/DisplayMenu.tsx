import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import React, { Fragment } from 'react'

const DisplayMenu = ({selectedDisplay, setSelectedDisplay}: {
    selectedDisplay: "one" | "three" | "week" | undefined, 
    setSelectedDisplay: React.Dispatch<React.SetStateAction< "one" | "three" | "week" | undefined >>
}) => {

    const displayTypes = ['one', 'three', 'week']   
  return (
    <Listbox value={selectedDisplay} onChange={setSelectedDisplay}>
    <div className="relative py-1 px-2 border rounded-sm uppercase tracking-wide text-gray-700 font-semibold hover:bg-slate-100">
      <Listbox.Button className="flex items-center uppercase">
        <span className="block px-4">{selectedDisplay}</span>
        <ChevronDownIcon className="fill-slate-400 w-4 h-4" />
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute mt-4 max-h-60 right-0 w-40 px-1 rounded-sm bg-white py-2 z-[150] shadow-2xl border">
          {displayTypes.map((display, displayIdx) => (
            <Listbox.Option
              key={displayIdx}
              className={({ active }) =>
                `cursor-default select-none py-2 pl-2 flex w-full items-center ${
                  active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                }`
              }
              value={display}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? 'font-medium' : 'font-normal'
                    }`}
                  >
                    {display}
                  </span>
                  {selected ? (
                    <span className="flex items-center pl-3 text-blue-600">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </div>
    </Listbox>

  )
}

export default DisplayMenu