import { CheckCircle } from "lucide-react"
import { IoMdInformationCircle } from "react-icons/io"

interface SuccessMessageProps {
    alertText: React.ReactNode,
    isSuccess: boolean
}

export default function InlineAlert({ alertText, isSuccess }: SuccessMessageProps) {
    return (
        isSuccess ? (
            <div className="flex items-center gap-3 bg-green-100 py-3 px-4 rounded-lg text-green-900 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>{alertText}</div>
            </div>
        ) : (
            <div className="flex items-center gap-3 bg-red-100 py-3 px-4 rounded-lg text-red-900 mb-4">
                <IoMdInformationCircle className="text-2xl text-red-500" />
                {alertText}
            </div>
        )
    );
    
}