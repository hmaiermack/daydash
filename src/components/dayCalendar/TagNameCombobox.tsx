import React, { useEffect } from 'react'
import { Combobox } from "@headlessui/react"
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

const TagNameCombobox = React.forwardRef<HTMLInputElement, ControllerRenderProps>((props, ref) => {
    const [date, setDate] = useState(new Date)
    const [query, setQuery] = useState('')
    const { isLoading, isError, data, error } = trpc.useQuery(["tasks.tasks", {date}]);  
    const filteredTags = query === '' ? data?.tags : data?.tags.filter((tag) => tag.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <Combobox defaultValue={props.value} onChange={props.onChange} refName={props.name} nullable>
        <Combobox.Label className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`}>Tag Name</Combobox.Label>
        <Combobox.Input className={`appearance-none block w-full bg-white text-gray-900 font-medium rounded-lg py-3 px-3 leading-tight`} displayValue={() => props.value ? props.value : query} onChange={(e) => {setQuery(e.target.value)}} placeholder="Confirm with Tab or Enter" />
        <Combobox.Options>
            {query.length > 0 && (
                <Combobox.Option value={query}>{query}</Combobox.Option>
            )}
            {filteredTags?.map((tag) => (
                <Combobox.Option key={tag.id} value={tag.name}>
                    {tag.name}
                </Combobox.Option>
            ))}
        </Combobox.Options>
    </Combobox>
  )
})

export default TagNameCombobox