import React from 'react'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import ItemList from '../../ui/ItemList/ItemList'
import ItemListContainer from '../../ui/ItemList/ItemListContainer'
import ItemListHeader from '../../ui/ItemList/ItemListHeader'
import ItemRow from '../../ui/ItemList/ItemRow'
import NewItemButton from '../../ui/ItemList/NewItemButton'
import { trpc } from '../../utils/trpc'
import { useZodForm } from '../../utils/zodForm'

const TodoContainer = () => {
  const [newItemInput,setNewItemInput] = React.useState(false)
  const utils = trpc.useContext()

  const {data} = trpc.useQuery(['todos.todos'])
  console.log(data)
  const newTodo = trpc.useMutation('todos.new-todo', {
    onError: (err) => {
      toast.error("Something went wrong. Please try again later.")
  },
  onSuccess() {
      utils.invalidateQueries(["todos.todos"])
      toast.success("Todo added!")
  },

  })
  const schema = z.object({
    name: z.string().min(1),
  })

  const methods = useZodForm({schema})

  const handleClose = () => {
    setNewItemInput(false)
    methods.reset()
  }

  const onSubmit = methods.handleSubmit((data) => {
    console.log("submitting")
    newTodo.mutateAsync({
      name: data.name,
    })
    handleClose()
    })
    
  const deleteTodo = trpc.useMutation(['todos.delete-todo'], {
    onError: () => {
      toast.error("Something went wrong. Please try again later.")
  },
  onSuccess() {
      utils.invalidateQueries(["todos.todos"])
      toast.success("Habit deleted!")
  },
  })

  const toggleTodo = trpc.useMutation(['todos.toggle-todo'], {
    onError: () => {
      toast.error("Something went wrong. Please try again later.")
  },
  onSuccess() {
      utils.invalidateQueries(["todos.todos"])
      toast.success("Habit toggled!")
  },
  })

  const handleDelete = (id: string) => {
    console.log("deleting todo: " + id)
    deleteTodo.mutateAsync({id})
    deleteTodo.isLoading && toast.loading("Loading...")
  }

  const handleToggle = (id: string) => {
    console.log("toggling todo: " + id)
    toggleTodo.mutateAsync({id})
    toggleTodo.isLoading && toast.loading("Loading...")
  }

  return (
    <div className='w-5/6 mx-auto p-8'>
        <ItemListContainer>
          <ItemList >
            <ItemListHeader>Todo List</ItemListHeader>

            {/* This should be a generic row container */}
            <div className="flex flex-col gap-4 md:flex-wrap max-h-[300px] overflow-auto">
              {data && data.map((item) => (
                <ItemRow item={item} key={item.id} deleteFn={() => handleDelete(item.id)} toggleFn={() => handleToggle(item.id)}/>
              ))}
            </div>

            {newItemInput &&    
                <form onSubmit={onSubmit} className="mt-4">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="habitName">New Item</label>
                    <input type="text" className={`appearance-none block bg-white text-gray-900 border font-medium ${methods.formState.errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-400 focus:outline-none'} rounded-lg py-3 px-3 leading-tight`} {...methods.register("name")}/>
                    {methods.formState.errors.name && <p className="text-red-500 text-xs italic">Please enter a todo item</p>}
                    <div className="flex w-full justify-between mt-4">
                    </div>
                    <div className="flex gap-12 mt-4">
                    <button type="button" className="bg-red-400 hover:bg-red-500 hover:cursor-pointer text-white p-2 rounded max-w-fit" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-400 hover:bg-blue-500 hover:cursor-pointer text-white p-2 rounded max-w-fit">
                            Add Item
                        </button>
                    </div>
                </form>
            }        

            {!newItemInput && <NewItemButton setNewItemInput={setNewItemInput}>Add new item</NewItemButton>}
          </ItemList>
        </ItemListContainer>
    </div>
  )
}

export default TodoContainer