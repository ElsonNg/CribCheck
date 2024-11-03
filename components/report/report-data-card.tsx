

interface ReportDataCardProps {
    className?: string;
    title: string;
    locations: string;
    description: string;
    children?: React.ReactNode;

}

export default function ReportDataCard({ className, children, title, locations, description }: ReportDataCardProps) {
    return (<div className="animate-fadeInUp px-6 py-4 flex flex-col md:flex-row justify-start items-center gap-8 bg-[#EEEEEE] rounded-md">
        <div className="basis-[20%] md:basis-[10%]">
            {children}
        </div>
        <div className="basis-[80%] md:basis-[90%] flex flex-col justify-center items-start gap-0.5">
            <span className="text-lg font-bold">{title}</span>
            <span className="text-md font-medium">{locations} location(s)</span>
            <span className="text-md font-medium">{description}</span>

        </div>
    </div>)
}