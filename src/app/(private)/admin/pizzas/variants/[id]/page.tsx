import PageTitle from '@/components/ui/page-title';
import { getPizzaById } from '@/server-actions/pizzas';
import VariantsContent from './_components/variants-content';
import React from 'react'
import toast from 'react-hot-toast';

interface PizzaVairantPageProps {
    params: Promise<{id: string}>;
}

const PizzaVariantsPage = async ({params}: PizzaVairantPageProps) => {
    const {id} = await params;
    const data = await getPizzaById(id);
    if(!data.success){
        return(<div>Pizza Not Found</div>)
    }
   
  return (
     <>
     <div className="flex justify-between items-center my-5">
        <h1 className='text-xl'>Variants for
            <span className='uppercase text-primary font-bold ml-3'>{data.data?.name}</span>
             </h1>
     </div>
     
     <VariantsContent pizzaId={id} />
     
     </>
  )
}

export default PizzaVariantsPage