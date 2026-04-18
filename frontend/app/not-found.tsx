import { Separator } from '@base-ui/react'

const NotFound = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-8'>
            <h1 className='text-4xl font-bold inline-block'>404</h1>
            <Separator orientation='vertical' className='h-12 w-px bg-black rounded-full font-inter' />
            <span className='text-lg font-semibold text-neutral-800 font-inter'>Page Not Found</span>
        </div>
    </div>
  )
}

export default NotFound