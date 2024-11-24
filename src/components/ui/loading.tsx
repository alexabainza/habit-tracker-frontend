import { LoaderIcon } from 'lucide-react'

const Loading = () => {
    return (
        <div className="text-center text-lg text-gray-500 inline-flex flex-col items-center justify-center gap-2 p-5">
            <LoaderIcon className="w-8 h-8 animate-spin" />
            Loading...
        </div>
    )
}

export default Loading