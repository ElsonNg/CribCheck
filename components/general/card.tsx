import { cn } from "@/lib/utils";



interface CardProps {
    className?: string;
    children?: React.ReactNode;
}

export default function Card({className, children}: CardProps) {

    return (<div className={cn("border rounded-lg p-4 md:p-6", className)}>
        {children}
    </div>)
}