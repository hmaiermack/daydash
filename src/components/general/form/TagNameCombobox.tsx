import React, { Fragment, useEffect } from 'react'
import { Combobox } from "@headlessui/react"
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';
import { Tag } from '@prisma/client';

//eslint-disable-next-line react/display-name
const TagNameCombobox = React.forwardRef<HTMLInputElement, (ControllerRenderProps & {tags: Tag[], tagColor: string, hidden: boolean})>((props, ref) => {
    const [date, setDate] = useState(new Date)
    const [query, setQuery] = useState('')
    const filteredTags = query === '' ? props.tags : props.tags.filter((tag) => tag.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <Combobox defaultValue={props.value} onChange={props.onChange} refName={props.name} nullable>
        {({ open }) => (
            <div className={`${props.hidden ? 'pb-4' : ''}`}>
                <Combobox.Label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`}>Tag Name</Combobox.Label>
                <div className='flex justify-center items-center'>
                <Combobox.Input 
                    className={`appearance-none block w-full bg-white text-gray-900 font-medium rounded-lg py-3 px-3 leading-tight`} 
                    displayValue={() => props.value ? props.value : query} 
                    onChange={(e) => {setQuery(e.target.value)}} 
                    //@ts-ignore
                    onFocus={(e) => !open && e.target.nextSibling.click()}
                    placeholder="Confirm with Tab or Enter" />
                    <Combobox.Button className="hidden"/>
                    {props.tagColor && props.hidden ? <div className='content-none w-8 h-8 p-3 ml-4 rounded-full' style={{backgroundColor: props.tagColor}}></div> : <></>}
                </div>
                <Combobox.Options as="div" className="w-full mt-2 rounded bg-white flex-col divide-y-2 p-2">
                    {query.length > 0 && (
                        <Combobox.Option value={query} as="div" className={`text-gray-900 font-medium leading-tight p-2 hover:bg-slate-200`}>
                            {query}
                        </Combobox.Option>
                    )}
                    {filteredTags?.map((tag) => (
                        <Combobox.Option key={tag.id} value={tag.name} as="div" className={`text-gray-900 font-medium leading-tight p-2 flex items-center hover:bg-slate-200`}>
                            {tag.name}
                            <div className='content-none w-4 h-4 ml-4 rounded-full' style={{backgroundColor: tag.colorHexValue}}></div>
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </div>
        )}
    </Combobox>
  )
})

export default TagNameCombobox