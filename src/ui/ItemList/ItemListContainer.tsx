import React from 'react'
import { ItemListErrorBoundary } from './ItemListErrorBoundary'
import ItemList from './ItemList'

const ItemListContainer = ({children}: {children?: React.ReactNode} & React.ComponentPropsWithoutRef<"div">) => {

    // const methods = useZodForm({schema})
    // const utils = trpc.useContext()
    // const { data: habitData } = trpc.useQuery(['habits.habits'], {
    //     //@ts-ignore
    //     useErrorBoundary: (err) => err.data?.httpStatus >= 500,
    // })

    // const newHabit = trpc.useMutation('habits.new-habit', {
    //     //@ts-ignore
    //     onError: (err) => {
    //         toast.error("Something went wrong. Please try again later.")
    //     },
    //     onSuccess() {
    //         utils.invalidateQueries(['habits.habits'])
    //         toast.success('Habit created!')
    //         handleClose()
    //     },
    // })

    // const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //     newHabit.mutateAsync({
    //         name: data.habitName,
    //         habitDays: [data.sunday, data.monday, data.tuesday, data.wednesday, data.thursday, data.friday, data.saturday]
    //     })
    //     newHabit.isLoading && toast.loading('Creating habit...')
    // }


  return (
    <div>
      <ItemListErrorBoundary>
          {children}
      </ItemListErrorBoundary>
    </div>

  )
}

export default ItemListContainer