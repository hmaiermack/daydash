import { Combobox } from '@headlessui/react'
import React, { useState, FocusEvent } from 'react'
import { ControllerRenderProps } from 'react-hook-form'

const ColorPicker = React.forwardRef<HTMLInputElement, (ControllerRenderProps & {disabled: boolean})>((props, ref) => {
    const colors = ["#2196F3", "#6196F3","#2143F3","#2246F3","#67F87C","#2136F3",]
    const [inputString, setInputString] = useState(props.value ? props.value : '')
    console.log('first')
  return (
    <Combobox defaultValue={props.value} onChange={props.onChange} refName={props.name} nullable disabled={props.disabled}>
        {({open}) => (
            <div className='mt-4' >
                <div className='w-full relative flex-col'>
            {/* 
                    onFocus in Combobox.Input "clicks" neighbor Combobox.Button so that Combobox parent will automatically open when
                clicked or tabbed to. This workaround is required as Combobox does expose a setOpen functionality, meaning that we have to
                "click" the Combobox.Button to setOpen(!open).

                see: https://github.com/tailwindlabs/headlessui/discussions/1236#discussioncomment-2988166 for solution and discussion.
            */}
            <Combobox.Label className={`w-full block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`}>Tag Color</Combobox.Label>
            <div className='flex'>
            <Combobox.Input
                className={`grow appearance-none block ${props.disabled ? 'w-full' : ''} bg-white text-gray-900 font-medium rounded-lg py-3 px-3 leading-tight`}
                placeholder={props.disabled ? 'Selected tag already has a color' : 'Tab or Enter to submit Hex' }
                displayValue={() => props.value ? props.value : inputString}
                onChange={(e) => setInputString(e.target.value)} 
                //@ts-ignore
                onFocus={(e) => {
                    if (e.relatedTarget?.id?.includes('headlessui-combobox-button')) return;
                    !open && e.target.nextSibling.click()
                }}
            />
            <Combobox.Button
            className={`w-10 h-10  ml-2 rounded-full focus:outline-none focus:shadow-outline inline-flex p-2 shadow text-white`} style={{background: `${inputString}`}}>
            <svg className={`w-6 h-6 fill-current`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M15.584 10.001L13.998 8.417 5.903 16.512 5.374 18.626 7.488 18.097z"/><path d="M4.03,15.758l-1,4c-0.086,0.341,0.015,0.701,0.263,0.949C3.482,20.896,3.738,21,4,21c0.081,0,0.162-0.01,0.242-0.03l4-1 c0.176-0.044,0.337-0.135,0.465-0.263l8.292-8.292l1.294,1.292l1.414-1.414l-1.294-1.292L21,7.414 c0.378-0.378,0.586-0.88,0.586-1.414S21.378,4.964,21,4.586L19.414,3c-0.756-0.756-2.072-0.756-2.828,0l-2.589,2.589l-1.298-1.296 l-1.414,1.414l1.298,1.296l-8.29,8.29C4.165,15.421,4.074,15.582,4.03,15.758z M5.903,16.512l8.095-8.095l1.586,1.584 l-8.096,8.096l-2.114,0.529L5.903,16.512z"/></svg>
            </Combobox.Button>
            <Combobox.Options as="div" className="w-40 bg-white flex flex-wrap">
                {inputString.length > 0 &&
                    <Combobox.Option value={inputString} as="div" className="hidden">
                    </Combobox.Option>
                }
                {
                    colors.map((color) => {
                        return (
                            <Combobox.Option as="div" key={color} value={color} className='basis-1/5'>
                                <div className='w-4 h-4 m-2 rounded-full' style={{background: `${color}`}} >

                                </div>
                            </Combobox.Option>
                        )
                    })
                }
            </Combobox.Options>
            </div>
            </div>
            </div>
        )}
    </Combobox>
  )
})

export default ColorPicker