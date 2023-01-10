import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ClockIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import { signOut, useSession } from 'next-auth/react'
import React, { Fragment } from 'react'
import CLink from '../../general/CLink'

const OptionsMenu = () => {
    const {data: session} = useSession()


  return (
    <Menu as="div" className="relative border rounded-sm uppercase tracking-wide text-gray-700 font-semibold hover:bg-slate-100">
    <div>
      <Menu.Button className="flex items-center uppercase py-1 px-2 ">
        <span className="block px-4">Options</span>
        <ChevronDownIcon className="fill-slate-400 w-4 h-4" />
      </Menu.Button>
    </div>
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Menu.Items className="absolute right-0 mt-4 z-[200] rounded-sm origin-top-right  bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="px-1 py-2 divide-y divide-gray-100">
      <Menu.Item>
          {({ active }) => (
            <CLink href={`/user/${session?.user.id}`}>
            <button
              className={`${
                active ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
              } group flex w-full items-center py-2 text-sm tracking-tighter`}
            >
              {session?.user.name ? (
                <div className='flex px-1'>
                  <UserCircleIcon className="h-5 w-5 mr-2" />
                  <span>{session.user.name}</span>
                </div>
              ): (
                <div className='flex px-1'>
                <UserCircleIcon className="h-5 w-5 mr-2" />
                <span>{session?.user.email}</span>
              </div>
              )}
            </button>
            </CLink>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
              } flex w-full items-center py-2 text-sm tracking-tighter`}
            >
              <div className='flex px-1'>
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>Calendar Display Range</span>
              </div>
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'text-white bg-red-400' : 'text-gray-700'
              } flex w-full items-center py-2 text-sm tracking-tighter `}
              onClick={() => signOut()}
            >
              <div className='flex px-1'>
                <span>Sign Out</span>
              </div>
            </button>
          )}
        </Menu.Item>
      </div>
      </Menu.Items>
    </Transition>
  </Menu>

  )
}

export default OptionsMenu